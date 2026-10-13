import { getSupabaseAdminClient, getSupabaseClient } from './supabaseClient'

// Data access for registration leads. Every call takes the environment id
// ('test' | 'live') so the caller always states which Supabase project it means.
//
// Schema lives in supabase/website_leads.sql and must be run once per project.
// The table is website_leads, not leads — the superadmin panel already owns
// `public.leads` in these same projects.
//
// Access model (enforced by RLS, not by this file):
//   - the public form can only call the submit_website_lead RPC
//   - reads / status changes / deletes need a signed-in user who is listed in
//     website_admins, so they go through the admin (session) client

export const LEADS_TABLE = 'website_leads'

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'rejected']

// Inserts the lead, and the optional product, in one transaction.
// `lead` uses the snake_case column names; `product` is null or
// { name, description, category_id, image_primary_url, image_secondary_url, search_keywords }.
export const submitLead = async (env, lead, product = null) => {
    const { error } = await getSupabaseClient(env).rpc('submit_website_lead', {
        p_lead: lead,
        p_product: product
    })

    if (error) throw error
}

// The panel's (souqroute_panel) product taxonomy — products submitted with a
// registration are filed under one of these. anon may read active categories.
// Returned flattened in tree order, children labelled "Parent › Child".
export const listProductCategories = async (env) => {
    const { data, error } = await getSupabaseClient(env)
        .from('categories')
        .select('id, name, parent_id, sort_order')
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

    if (error) throw error

    const rows = data || []
    const byParent = new Map()
    rows.forEach((row) => {
        const key = row.parent_id || 'root'
        if (!byParent.has(key)) byParent.set(key, [])
        byParent.get(key).push(row)
    })

    const ids = new Set(rows.map((row) => row.id))
    const flat = []
    const walk = (parentKey, prefix) => {
        for (const row of byParent.get(parentKey) || []) {
            const label = prefix ? `${prefix} › ${row.name}` : row.name
            flat.push({ id: row.id, label })
            walk(row.id, label)
        }
    }
    walk('root', '')
    // Children whose parent is inactive would otherwise be unreachable.
    rows.filter((row) => row.parent_id && !ids.has(row.parent_id))
        .forEach((row) => { flat.push({ id: row.id, label: row.name }); walk(row.id, row.name) })
    return flat
}

export const isWebsiteAdmin = async (env) => {
    const { data, error } = await getSupabaseAdminClient(env).rpc('is_website_admin')
    if (error) throw error
    return data === true
}

export const listLeads = async (env) => {
    const { data, error } = await getSupabaseAdminClient(env)
        .from(LEADS_TABLE)
        .select('*, product:catalog_products(id, name, image_primary_url), panel_product:products(id, name, status)')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

export const updateLeadStatus = async (env, id, status) => {
    // .select() so an update RLS silently filtered out (0 rows) is detectable.
    const { data, error } = await getSupabaseAdminClient(env)
        .from(LEADS_TABLE)
        .update({ status })
        .eq('id', id)
        .select('id')

    if (error) throw error
    if (!data?.length) throw new Error('Lead not updated — this account is not an admin.')
}

export const deleteLead = async (env, id) => {
    const { data, error } = await getSupabaseAdminClient(env)
        .from(LEADS_TABLE)
        .delete()
        .eq('id', id)
        .select('id')

    if (error) throw error
    if (!data?.length) throw new Error('Lead not deleted — this account is not an admin.')
}
