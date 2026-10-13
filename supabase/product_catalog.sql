-- ============================================================
-- PRODUCT CATALOG — SouqRoute admin panel (/souquerootadmin)
-- ============================================================
-- Run this ONCE PER SUPABASE PROJECT:
--   Test / Staging    -> gmgrsuynufoycvnqaltj
--   Live / Production -> akwycltnkqcrwezqldbt
--
-- Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
--
-- ── WHY THE TABLES ARE NAMED catalog_* ──────────────────────
-- These projects ALREADY have `products` and `master_products` tables
-- belonging to the superadmin panel's supplier catalog (company_id /
-- master_product_id, RLS scoped to auth.uid()). That app reads and writes
-- `products` in several places, so this script must NOT touch it — no
-- rename, no drop, no ALTER. The marketing-site catalog therefore lives in
-- its own `catalog_products` / `catalog_categories` tables. Both can
-- coexist in one database indefinitely.
--
-- ── NOTE ON ACCESS ──────────────────────────────────────────
-- The admin panel is gated by a hardcoded client-side password and has NO
-- database identity. The policies below deliberately allow the `anon` role
-- to write, because that is the only way the panel can function as built.
-- Anyone holding the public anon key (it ships in the JS bundle) can add,
-- edit or delete catalog entries and upload images. Tighten these to
-- `TO authenticated` the moment the panel gets a real login.
-- ============================================================


-- ── TABLE: catalog_categories ────────────────────────────────
-- The dropdown source. The panel's "+ Add" button inserts here.
CREATE TABLE IF NOT EXISTS public.catalog_categories (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name       text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.catalog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view catalog categories"   ON public.catalog_categories;
DROP POLICY IF EXISTS "Anyone can insert catalog categories" ON public.catalog_categories;
DROP POLICY IF EXISTS "Anyone can delete catalog categories" ON public.catalog_categories;

CREATE POLICY "Anyone can view catalog categories"
    ON public.catalog_categories FOR SELECT USING ( true );

CREATE POLICY "Anyone can insert catalog categories"
    ON public.catalog_categories FOR INSERT WITH CHECK ( true );

CREATE POLICY "Anyone can delete catalog categories"
    ON public.catalog_categories FOR DELETE USING ( true );


-- ── TABLE: catalog_products ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.catalog_products (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 text NOT NULL,
    description          text,
    category_id          uuid REFERENCES public.catalog_categories(id) ON DELETE SET NULL,

    -- Two upload slots, as used by the Add Product form.
    image_primary_url    text,
    image_secondary_url  text,

    -- Free-form tags entered comma-separated in the panel.
    search_keywords      text[] NOT NULL DEFAULT '{}',
    hashtags             text[] NOT NULL DEFAULT '{}',

    -- Maintained by the trigger below; powers a single ILIKE search
    -- across name + description + keywords + hashtags.
    search_text          text,

    created_at           timestamptz DEFAULT now(),
    updated_at           timestamptz DEFAULT now()
);


-- ── SEARCH: keep search_text in sync ─────────────────────────
CREATE OR REPLACE FUNCTION public.catalog_products_build_search_text()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_text :=
        lower(
            coalesce(NEW.name, '') || ' ' ||
            coalesce(NEW.description, '') || ' ' ||
            coalesce(array_to_string(NEW.search_keywords, ' '), '') || ' ' ||
            coalesce(array_to_string(NEW.hashtags, ' '), '')
        );
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS catalog_products_search_text_trigger ON public.catalog_products;

CREATE TRIGGER catalog_products_search_text_trigger
    BEFORE INSERT OR UPDATE ON public.catalog_products
    FOR EACH ROW EXECUTE FUNCTION public.catalog_products_build_search_text();

CREATE INDEX IF NOT EXISTS catalog_products_category_id_idx
    ON public.catalog_products (category_id);
CREATE INDEX IF NOT EXISTS catalog_products_created_at_idx
    ON public.catalog_products (created_at DESC);

-- Optional speed-up: a trigram index makes ILIKE search fast once the catalog
-- grows. Search works correctly without it, so this is wrapped to swallow any
-- failure — pg_trgm lands in different schemas across Supabase projects, and an
-- uncaught error here would roll back this whole script.
DO $trgm$
BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE INDEX IF NOT EXISTS catalog_products_search_text_idx
        ON public.catalog_products USING gin (search_text gin_trgm_ops);
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipped trigram index (search still works): %', SQLERRM;
END
$trgm$;


-- ── RLS: catalog_products ────────────────────────────────────
ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view catalog products"   ON public.catalog_products;
DROP POLICY IF EXISTS "Anyone can insert catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "Anyone can update catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "Anyone can delete catalog products" ON public.catalog_products;

CREATE POLICY "Anyone can view catalog products"
    ON public.catalog_products FOR SELECT USING ( true );

CREATE POLICY "Anyone can insert catalog products"
    ON public.catalog_products FOR INSERT WITH CHECK ( true );

CREATE POLICY "Anyone can update catalog products"
    ON public.catalog_products FOR UPDATE USING ( true ) WITH CHECK ( true );

CREATE POLICY "Anyone can delete catalog products"
    ON public.catalog_products FOR DELETE USING ( true );


-- ── STORAGE: product_images bucket ───────────────────────────
-- Does not collide with the superadmin buckets (company_logo, cover_images).
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view product images"   ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT TO public
    USING ( bucket_id = 'product_images' );

CREATE POLICY "Anyone can upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'product_images' );

CREATE POLICY "Anyone can delete product images"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'product_images' );


-- ── SEED: a few starter categories ───────────────────────────
INSERT INTO public.catalog_categories (name)
VALUES
    ('Furniture'),
    ('Electrical Cable Accessories'),
    ('MEP Supplies'),
    ('Construction Materials'),
    ('Industrial Equipment')
ON CONFLICT (name) DO NOTHING;


-- ── VERIFY ───────────────────────────────────────────────────
-- Should return 5 category rows and 0 product rows:
--   SELECT count(*) FROM public.catalog_categories;
--   SELECT count(*) FROM public.catalog_products;
