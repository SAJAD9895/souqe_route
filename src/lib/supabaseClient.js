import { createClient } from '@supabase/supabase-js'

// Supabase backs everything: registration leads (website_leads), the product
// catalog (catalog_*), the admin panel's login, and its Create Account tab.
//
// There are TWO Supabase projects, mirroring the superadmin panel's deploys:
//   test → the staging project, safe to create throwaway accounts in
//   live → the production project, real accounts for the real admin panel
// The admin header has a dropdown that picks which one the panel works on;
// the public registration form uses PUBLIC_SUPABASE_ENV below.

export const SUPABASE_ENVS = [
    {
        id: 'test',
        label: 'Test (Staging)',
        url: import.meta.env.VITE_SUPABASE_STAGING_URL,
        anonKey: import.meta.env.VITE_SUPABASE_STAGING_ANON_KEY
    },
    {
        id: 'live',
        label: 'Live (Production)',
        url: import.meta.env.VITE_SUPABASE_PROD_URL,
        anonKey: import.meta.env.VITE_SUPABASE_PROD_ANON_KEY
    }
]

// Default to test so a mis-click never creates an account in the live project.
export const DEFAULT_SUPABASE_ENV = 'test'

// The project the public registration form writes leads to: live in
// production builds, test under `npm run dev`. VITE_LEADS_SUPABASE_ENV
// overrides it (e.g. to point a preview deploy at test).
export const PUBLIC_SUPABASE_ENV =
    import.meta.env.VITE_LEADS_SUPABASE_ENV || (import.meta.env.PROD ? 'live' : 'test')

export const getSupabaseEnv = (envId) =>
    SUPABASE_ENVS.find((env) => env.id === envId) || SUPABASE_ENVS[0]

// The project ref is the subdomain — shown in the UI so the operator can see
// exactly which project a submission is going to.
export const getSupabaseProjectRef = (envId) => {
    const { url } = getSupabaseEnv(envId)
    if (!url) return 'not configured'
    return url.replace(/^https?:\/\//, '').split('.')[0]
}

const requireConfigured = (env) => {
    if (!env.url || !env.anonKey) {
        throw new Error(
            `Supabase "${env.label}" is not configured. Set the VITE_SUPABASE_* vars for it in .env.`
        )
    }
}

// One client per environment, created on first use and reused after that.
// These are session-less: they act as `anon`. Used by the public form, the
// Products tab and Create Account's signUp.
const clients = {}

export const getSupabaseClient = (envId) => {
    const env = getSupabaseEnv(envId)
    requireConfigured(env)

    if (!clients[env.id]) {
        clients[env.id] = createClient(env.url, env.anonKey, {
            auth: {
                // This client only signs users UP. Persisting a session would
                // leave the admin's browser logged in as the account it just
                // created, which is never what we want here.
                persistSession: false,
                autoRefreshToken: false
            }
        })
    }

    return clients[env.id]
}

// The admin panel's signed-in client, one per environment. Kept separate from
// the session-less clients above so that signing an account up in the Create
// Account tab can never replace the admin's own session. Each env gets its own
// storageKey, so the admin can be signed in to test and live independently.
const adminClients = {}

export const getSupabaseAdminClient = (envId) => {
    const env = getSupabaseEnv(envId)
    requireConfigured(env)

    if (!adminClients[env.id]) {
        adminClients[env.id] = createClient(env.url, env.anonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                storageKey: `souqroute-admin-${env.id}`
            }
        })
    }

    return adminClients[env.id]
}
