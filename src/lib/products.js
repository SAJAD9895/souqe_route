import { getSupabaseClient } from './supabaseClient'

// Data access for the admin panel's Products tab. Every call takes the
// environment id ('test' | 'live') so the caller always states which Supabase
// project it means — see ./supabaseClient.js.
//
// Schema lives in supabase/product_catalog.sql and must be run once per project.
//
// The tables are catalog_* rather than products/product_categories because these
// Supabase projects already host the superadmin panel's supplier catalog in
// `products` / `master_products`. That app still reads and writes those tables,
// so this catalog stays entirely out of their way.

export const PRODUCT_IMAGE_BUCKET = 'product_images'
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB

// "cable, copper , 3-core" -> ['cable', 'copper', '3-core']
export const parseTagList = (value) =>
    (value || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

// Hashtags are stored without the leading '#' so search matches either way.
export const parseHashtagList = (value) =>
    parseTagList(value).map((tag) => tag.replace(/^#+/, '')).filter(Boolean)

export const formatTagList = (tags) => (tags || []).join(', ')

/* ── Categories ──────────────────────────────────────────────── */

export const listCategories = async (env) => {
    const { data, error } = await getSupabaseClient(env)
        .from('catalog_categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) throw error
    return data || []
}

export const createCategory = async (env, name) => {
    const trimmed = (name || '').trim()
    if (!trimmed) throw new Error('Category name is required.')

    const { data, error } = await getSupabaseClient(env)
        .from('catalog_categories')
        .insert({ name: trimmed })
        .select()
        .single()

    if (error) {
        // 23505 = unique_violation, i.e. the category already exists.
        if (error.code === '23505') {
            throw new Error(`"${trimmed}" already exists.`)
        }
        throw error
    }
    return data
}

/* ── Images ──────────────────────────────────────────────────── */

export const uploadProductImage = async (env, file) => {
    if (!file) return null

    if (!file.type.startsWith('image/')) {
        throw new Error(`"${file.name}" is not an image.`)
    }
    if (file.size > MAX_IMAGE_BYTES) {
        throw new Error(`"${file.name}" is larger than 5MB.`)
    }

    const client = getSupabaseClient(env)
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

    const { error } = await client.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data } = client.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
}

// Best-effort cleanup so deleting a product doesn't orphan its files.
// A failure here is not worth surfacing — the row is already gone.
const removeImageByUrl = async (env, url) => {
    if (!url) return
    const marker = `/${PRODUCT_IMAGE_BUCKET}/`
    const index = url.indexOf(marker)
    if (index === -1) return

    const path = url.slice(index + marker.length).split('?')[0]
    try {
        await getSupabaseClient(env).storage.from(PRODUCT_IMAGE_BUCKET).remove([path])
    } catch (error) {
        console.warn('Could not remove product image:', error)
    }
}

/* ── Products ────────────────────────────────────────────────── */

export const listProducts = async (env, { search } = {}) => {
    let query = getSupabaseClient(env)
        .from('catalog_products')
        .select('*, category:catalog_categories(id, name)')
        .order('created_at', { ascending: false })

    // search_text is maintained by a trigger and covers name, description,
    // keywords and hashtags in one lowercase blob.
    const term = (search || '').trim().toLowerCase()
    if (term) query = query.ilike('search_text', `%${term}%`)

    const { data, error } = await query
    if (error) throw error
    return data || []
}

export const createProduct = async (env, payload) => {
    const { data, error } = await getSupabaseClient(env)
        .from('catalog_products')
        .insert(payload)
        .select('*, category:catalog_categories(id, name)')
        .single()

    if (error) throw error
    return data
}

export const updateProduct = async (env, id, payload) => {
    const { data, error } = await getSupabaseClient(env)
        .from('catalog_products')
        .update(payload)
        .eq('id', id)
        .select('*, category:catalog_categories(id, name)')
        .single()

    if (error) throw error
    return data
}

export const deleteProduct = async (env, product) => {
    const { error } = await getSupabaseClient(env)
        .from('catalog_products')
        .delete()
        .eq('id', product.id)

    if (error) throw error

    await removeImageByUrl(env, product.image_primary_url)
    await removeImageByUrl(env, product.image_secondary_url)
}
