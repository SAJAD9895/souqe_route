-- ============================================================
-- WEBSITE LEADS — SouqRoute registration form + admin panel
-- ============================================================
-- Replaces the Firestore `leads` collection.
--
-- Run this ONCE PER SUPABASE PROJECT, AFTER product_catalog.sql
-- (website_leads.product_id references catalog_products):
--   Test / Staging    -> gmgrsuynufoycvnqaltj
--   Live / Production -> akwycltnkqcrwezqldbt
--
-- Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run.
--
-- ── WHY website_leads AND NOT leads ─────────────────────────
-- The superadmin panel (souqroute_panel) already owns `public.leads`
-- (marketplace leads: title, source, priority, assignments…) and
-- `legacy_website_leads` (the pre-Firestore table). This must not collide.
--
-- ── ACCESS MODEL ────────────────────────────────────────────
--   anon (public form)  -> may ONLY call submit_website_lead(). No direct
--                          insert, no read. status/created_at are forced.
--   authenticated admin -> read / update status / delete, but only if the
--                          user's id is in website_admins.
-- Sign-ups are OPEN on both projects (the admin's Create Account tab uses
-- them), so "authenticated" alone is NOT enough — hence the allowlist.
--
-- ── BOOTSTRAP AN ADMIN (per project) ────────────────────────
-- 1. Authentication -> Users -> Add user (e.g. info@souqroute.com,
--    tick "Auto Confirm User").
-- 2. Run:
--      INSERT INTO public.website_admins (user_id, email)
--      SELECT id, email FROM auth.users WHERE email = 'info@souqroute.com'
--      ON CONFLICT (user_id) DO NOTHING;
-- ============================================================


-- ── ADMIN ALLOWLIST ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.website_admins (
    user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS on with no policies: only the SQL editor / service role can edit it.
ALTER TABLE public.website_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.website_admins FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_website_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.website_admins WHERE user_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.is_website_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_website_admin() TO anon, authenticated;


-- ── TABLE: website_leads ─────────────────────────────────────
-- Length caps and the email pattern mirror the old firestore.rules.
CREATE TABLE IF NOT EXISTS public.website_leads (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name         text NOT NULL CHECK (char_length(first_name)        BETWEEN 1 AND 100),
    last_name          text NOT NULL CHECK (char_length(last_name)         BETWEEN 1 AND 100),
    company            text NOT NULL CHECK (char_length(company)           BETWEEN 1 AND 200),
    business_activity  text NOT NULL CHECK (char_length(business_activity) BETWEEN 1 AND 200),
    phone              text NOT NULL CHECK (char_length(phone)             BETWEEN 1 AND 40),
    email              text NOT NULL CHECK (char_length(email) <= 254
                                            AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    city               text NOT NULL CHECK (char_length(city)              BETWEEN 1 AND 100),
    country            text NOT NULL CHECK (char_length(country)           BETWEEN 1 AND 100),

    brands_represented text CHECK (char_length(brands_represented) <= 500),
    mobile_number      text CHECK (char_length(mobile_number)      <= 40),
    website            text CHECK (char_length(website)            <= 300),
    office_no          text CHECK (char_length(office_no)          <= 100),
    building_name      text CHECK (char_length(building_name)      <= 200),
    street             text CHECK (char_length(street)             <= 200),
    locality           text CHECK (char_length(locality)           <= 200),
    po_box             text CHECK (char_length(po_box)             <= 50),
    message            text CHECK (char_length(message)            <= 2000),

    -- The optional product submitted with the registration.
    product_id         uuid REFERENCES public.catalog_products(id) ON DELETE SET NULL,

    status             text NOT NULL DEFAULT 'new'
                       CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'rejected')),

    -- Idempotency key for imported rows ('supabase-v1:<id>', 'firestore:<docId>').
    -- NULL for rows submitted through the form.
    legacy_ref         text UNIQUE,

    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS website_leads_created_at_idx ON public.website_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS website_leads_status_idx     ON public.website_leads (status);
CREATE INDEX IF NOT EXISTS website_leads_product_id_idx ON public.website_leads (product_id);

CREATE OR REPLACE FUNCTION public.website_leads_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS website_leads_updated_at_trigger ON public.website_leads;

CREATE TRIGGER website_leads_updated_at_trigger
    BEFORE UPDATE ON public.website_leads
    FOR EACH ROW EXECUTE FUNCTION public.website_leads_set_updated_at();


-- ── RLS: website_leads ───────────────────────────────────────
ALTER TABLE public.website_leads ENABLE ROW LEVEL SECURITY;

-- No direct access for the public at all; inserts go through the RPC below.
REVOKE ALL ON public.website_leads FROM anon;
REVOKE INSERT ON public.website_leads FROM authenticated;
GRANT SELECT, UPDATE, DELETE ON public.website_leads TO authenticated;

-- Admins may only move a lead through the pipeline, not rewrite contact data.
REVOKE UPDATE ON public.website_leads FROM authenticated;
GRANT UPDATE (status) ON public.website_leads TO authenticated;

DROP POLICY IF EXISTS "Admins can view website leads"   ON public.website_leads;
DROP POLICY IF EXISTS "Admins can update website leads" ON public.website_leads;
DROP POLICY IF EXISTS "Admins can delete website leads" ON public.website_leads;

CREATE POLICY "Admins can view website leads"
    ON public.website_leads FOR SELECT TO authenticated
    USING ( public.is_website_admin() );

CREATE POLICY "Admins can update website leads"
    ON public.website_leads FOR UPDATE TO authenticated
    USING ( public.is_website_admin() )
    WITH CHECK ( public.is_website_admin() );

CREATE POLICY "Admins can delete website leads"
    ON public.website_leads FOR DELETE TO authenticated
    USING ( public.is_website_admin() );


-- ── RPC: submit_website_lead ─────────────────────────────────
-- The ONLY way the public form writes. Inserts the optional product and the
-- lead in one transaction, so a rejected lead never leaves an orphan product.
-- status and created_at always come from the column defaults.
--
--   p_lead    jsonb  snake_case lead fields (see table above)
--   p_product jsonb  NULL, or { name, description, category_id,
--                    image_primary_url, image_secondary_url, search_keywords[] }
CREATE OR REPLACE FUNCTION public.submit_website_lead(
    p_lead    jsonb,
    p_product jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_product_id   uuid;
    v_product_name text;
    v_keywords     text[];
    v_image_1      text;
    v_image_2      text;
    -- Only accept images uploaded to this project's product_images bucket.
    c_image_marker constant text := '/storage/v1/object/public/product_images/';
BEGIN
    IF p_lead IS NULL OR jsonb_typeof(p_lead) <> 'object' THEN
        RAISE EXCEPTION 'INVALID_LEAD: lead payload is required';
    END IF;

    IF p_product IS NOT NULL AND jsonb_typeof(p_product) = 'object' THEN
        v_product_name := nullif(btrim(p_product->>'name'), '');
        IF v_product_name IS NULL OR char_length(v_product_name) > 200 THEN
            RAISE EXCEPTION 'INVALID_PRODUCT: product name is required (max 200 characters)';
        END IF;

        IF char_length(coalesce(p_product->>'description', '')) > 2000 THEN
            RAISE EXCEPTION 'INVALID_PRODUCT: description is too long (max 2000 characters)';
        END IF;

        v_image_1 := nullif(btrim(p_product->>'image_primary_url'), '');
        v_image_2 := nullif(btrim(p_product->>'image_secondary_url'), '');
        IF (v_image_1 IS NOT NULL AND position(c_image_marker IN v_image_1) = 0)
        OR (v_image_2 IS NOT NULL AND position(c_image_marker IN v_image_2) = 0) THEN
            RAISE EXCEPTION 'INVALID_PRODUCT: images must be uploaded through the form';
        END IF;

        SELECT coalesce(array_agg(left(btrim(k), 50)), '{}')
          INTO v_keywords
          FROM (
              SELECT jsonb_array_elements_text(
                         CASE WHEN jsonb_typeof(p_product->'search_keywords') = 'array'
                              THEN p_product->'search_keywords' ELSE '[]'::jsonb END
                     ) AS k
              LIMIT 20
          ) kw
         WHERE btrim(k) <> '';

        INSERT INTO public.catalog_products (
            name, description, category_id,
            image_primary_url, image_secondary_url, search_keywords
        )
        VALUES (
            v_product_name,
            nullif(btrim(p_product->>'description'), ''),
            nullif(p_product->>'category_id', '')::uuid,
            v_image_1,
            v_image_2,
            v_keywords
        )
        RETURNING id INTO v_product_id;
    END IF;

    INSERT INTO public.website_leads (
        first_name, last_name, company, business_activity, phone, email,
        city, country, brands_represented, mobile_number, website, office_no,
        building_name, street, locality, po_box, message, product_id
    )
    VALUES (
        btrim(p_lead->>'first_name'),
        btrim(p_lead->>'last_name'),
        btrim(p_lead->>'company'),
        btrim(p_lead->>'business_activity'),
        btrim(p_lead->>'phone'),
        btrim(p_lead->>'email'),
        btrim(p_lead->>'city'),
        btrim(p_lead->>'country'),
        nullif(btrim(p_lead->>'brands_represented'), ''),
        nullif(btrim(p_lead->>'mobile_number'), ''),
        nullif(btrim(p_lead->>'website'), ''),
        nullif(btrim(p_lead->>'office_no'), ''),
        nullif(btrim(p_lead->>'building_name'), ''),
        nullif(btrim(p_lead->>'street'), ''),
        nullif(btrim(p_lead->>'locality'), ''),
        nullif(btrim(p_lead->>'po_box'), ''),
        nullif(btrim(p_lead->>'message'), ''),
        v_product_id
    );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_website_lead(jsonb, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_website_lead(jsonb, jsonb) TO anon, authenticated;


-- ── VERIFY ───────────────────────────────────────────────────
--   SELECT count(*) FROM public.website_leads;
--   SELECT * FROM public.website_admins;
-- As anon, both `GET` and `POST /rest/v1/website_leads` must be refused
-- (permission denied, 42501). Only `POST /rest/v1/rpc/submit_website_lead` works.
