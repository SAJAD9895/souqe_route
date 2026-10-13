#!/usr/bin/env node
// One-off import of existing registration leads into Supabase `website_leads`.
//
// Sources:
//   A. leads-backup.json — the 38 original Supabase-era leads, with their real
//      submission dates. Imported as legacy_ref 'supabase-v1:<id>'.
//   B. (optional) Firestore `leads` — every doc that is NOT `legacy-*`, i.e.
//      real form submissions made while Firestore was the backend. The
//      `legacy-*` docs are copies of source A with the wrong (import-day)
//      created_at, so they are skipped. Imported as 'firestore:<docId>'.
//
// Safe to re-run: rows are upserted on legacy_ref with ignoreDuplicates.
//
// Needs the project's SERVICE ROLE key (bypasses RLS, allows setting
// created_at). Never commit it, never prefix it with VITE_.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=... node --env-file=.env scripts/migrate-leads-to-supabase.mjs \
//       [--env live|test] [--dry-run] [--firestore path/to/service-account.json]
//
// --env defaults to live. --firestore needs firebase-admin, which is not a
// project dependency: `npm i --no-save firebase-admin` before running.

import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const option = (name) => {
    const index = args.indexOf(`--${name}`)
    return index === -1 ? undefined : args[index + 1]
}

const envId = option('env') || 'live'
const dryRun = flag('dry-run')
const serviceAccountPath = option('firestore')

const SUPABASE_URLS = {
    test: process.env.VITE_SUPABASE_STAGING_URL,
    live: process.env.VITE_SUPABASE_PROD_URL
}

const url = SUPABASE_URLS[envId]
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
    console.error(`Unknown --env "${envId}" or its URL is not set (load .env with --env-file=.env).`)
    process.exit(1)
}
if (!serviceKey && !dryRun) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set.')
    process.exit(1)
}

const REQUIRED = ['first_name', 'last_name', 'company', 'business_activity', 'phone', 'email', 'city', 'country']
const OPTIONAL = ['brands_represented', 'mobile_number', 'website', 'office_no', 'building_name', 'street', 'locality', 'po_box', 'message']
const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'rejected']
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const clean = (value) => (typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim())

// Maps a raw lead (either source) to a website_leads row, or returns a reason
// it can't be imported.
const toRow = (raw, legacyRef, createdAt) => {
    const row = { legacy_ref: legacyRef }

    for (const key of REQUIRED) {
        row[key] = clean(raw[key])
        if (!row[key]) return { skip: `missing ${key}` }
    }
    for (const key of OPTIONAL) {
        row[key] = clean(raw[key]) || null
    }
    if (!EMAIL_RE.test(row.email)) return { skip: `invalid email "${row.email}"` }

    const status = clean(raw.status).toLowerCase()
    row.status = STATUSES.includes(status) ? status : 'new'

    const date = new Date(createdAt)
    if (!Number.isNaN(date.getTime())) row.created_at = date.toISOString()

    return { row }
}

const loadBackup = async () => {
    const raw = JSON.parse(await readFile(new URL('../leads-backup.json', import.meta.url), 'utf8'))
    // Postgres text format ("2026-01-26 11:43:10.911783+00") -> ISO.
    return raw.map((lead) => toRow(
        lead,
        `supabase-v1:${lead.id}`,
        String(lead.created_at).replace(' ', 'T').replace(/\+00$/, 'Z')
    ))
}

const loadFirestore = async () => {
    let admin
    try {
        admin = await import('firebase-admin')
    } catch {
        console.error('--firestore needs firebase-admin: run `npm i --no-save firebase-admin` first.')
        process.exit(1)
    }
    const { initializeApp, cert } = admin.default?.initializeApp ? admin.default : admin
    const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'))
    const app = initializeApp({ credential: cert(serviceAccount) })
    const { getFirestore } = await import('firebase-admin/firestore')

    const snapshot = await getFirestore(app).collection('leads').get()
    return snapshot.docs
        .filter((doc) => !doc.id.startsWith('legacy-'))
        .map((doc) => {
            const data = doc.data()
            const createdAt = data.created_at?.toDate ? data.created_at.toDate() : data.created_at
            return toRow(data, `firestore:${doc.id}`, createdAt)
        })
}

const main = async () => {
    const results = [...await loadBackup()]
    if (serviceAccountPath) results.push(...await loadFirestore())

    const rows = results.filter((r) => r.row).map((r) => r.row)
    const skipped = results.filter((r) => r.skip)

    console.log(`Target: ${envId} (${url})`)
    console.log(`Prepared ${rows.length} rows (${rows.filter((r) => r.legacy_ref.startsWith('firestore:')).length} from Firestore), skipped ${skipped.length}.`)
    skipped.forEach((s) => console.log(`  skip: ${s.skip}`))

    if (dryRun) {
        console.log('Dry run — nothing written.')
        return
    }

    const supabase = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false }
    })

    const { data, error } = await supabase
        .from('website_leads')
        .upsert(rows, { onConflict: 'legacy_ref', ignoreDuplicates: true })
        .select('id')

    if (error) {
        console.error('Import failed:', error)
        process.exit(1)
    }

    console.log(`Inserted ${data.length} new rows (${rows.length - data.length} already present).`)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
