-- ============================================================
-- WEBSITE LEADS — SouqRoute registration form + admin panel
-- ============================================================
-- Replaces the Firestore `leads` collection.
--
-- Run this ONCE PER SUPABASE PROJECT (safe to re-run after edits), AFTER
-- product_catalog.sql AND after the souqroute_panel migrations — it uses the
-- panel's companies / products / product_images / categories tables and its
-- is_master_user(), slugify(), notify_masters() helpers. Both projects have
-- the panel schema applied.
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
--                          user's id is in website_admins (this site's
--                          /souquerootadmin) OR is a souqroute_panel master
--                          (platform_users, via is_master_user()).
--
-- ── WHERE A REGISTRATION ENDS UP ────────────────────────────
-- A product is REQUIRED with every new registration. One submission writes:
--   - one website_leads row ("Website registrations" in the panel)
--   - a PENDING panel company built from the registration (reused if the same
--     email registered before)
--   - a PENDING_REVIEW panel product under it (the panel's Moderation queue)
--   - if the visitor typed a category that isn't listed: that category, unless
--     one with the same normalised name already exists (then it is reused).
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

-- Links into souqroute_panel. product_id above is the LEGACY link to the
-- marketing catalog (catalog_products) and is no longer written.
ALTER TABLE public.website_leads
    ADD COLUMN IF NOT EXISTS company_id       uuid REFERENCES public.companies(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS panel_product_id uuid REFERENCES public.products(id)  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS website_leads_company_id_idx ON public.website_leads (company_id);
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
    USING ( public.is_website_admin() OR public.is_master_user() );

CREATE POLICY "Admins can update website leads"
    ON public.website_leads FOR UPDATE TO authenticated
    USING ( public.is_website_admin() OR public.is_master_user() )
    WITH CHECK ( public.is_website_admin() OR public.is_master_user() );

CREATE POLICY "Admins can delete website leads"
    ON public.website_leads FOR DELETE TO authenticated
    USING ( public.is_website_admin() OR public.is_master_user() );


-- ── INTERNAL: website_lead_ensure_company ────────────────────
-- Returns the panel company for a registration, creating it if needed:
--   1. the company already linked to this lead, else
--   2. a company an earlier registration with the same email created, else
--   3. a new PENDING / DRAFT company built from the registration.
-- Links the lead to it. Not callable by clients (no grants).
CREATE OR REPLACE FUNCTION public.website_lead_ensure_company(p_lead_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    l            public.website_leads%ROWTYPE;
    v_company_id uuid;
    v_country_id uuid;
    v_city_id    uuid;
    v_base       text;
    v_slug       text;
    v_n          int := 1;
BEGIN
    SELECT * INTO l FROM public.website_leads WHERE id = p_lead_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'WEBSITE_LEAD_NOT_FOUND' USING errcode = 'P0002';
    END IF;

    IF l.company_id IS NOT NULL
       AND EXISTS (SELECT 1 FROM public.companies WHERE id = l.company_id AND deleted_at IS NULL) THEN
        RETURN l.company_id;
    END IF;

    SELECT c.id INTO v_company_id
      FROM public.companies c
     WHERE lower(c.email) = lower(l.email)
       AND c.metadata->>'source' = 'website_registration'
       AND c.deleted_at IS NULL
     ORDER BY c.created_at
     LIMIT 1;

    IF v_company_id IS NULL THEN
        SELECT id INTO v_country_id FROM public.countries
         WHERE lower(name) = lower(l.country) OR upper(iso2) = upper(l.country) OR upper(iso3) = upper(l.country)
         LIMIT 1;
        SELECT id INTO v_city_id FROM public.cities
         WHERE lower(name) = lower(l.city) AND (v_country_id IS NULL OR country_id = v_country_id)
         LIMIT 1;

        -- companies.slug is UNIQUE and its insert trigger does not de-dupe.
        v_base := coalesce(nullif(public.slugify(l.company), ''), 'company');
        v_slug := v_base;
        WHILE EXISTS (SELECT 1 FROM public.companies WHERE slug = v_slug) LOOP
            v_n := v_n + 1;
            v_slug := v_base || '-' || v_n;
        END LOOP;

        INSERT INTO public.companies (
            name, slug, email, phone, mobile, website,
            country_id, city_id, address, metadata
        )
        VALUES (
            l.company, v_slug, l.email, l.phone, l.mobile_number, l.website,
            v_country_id, v_city_id,
            nullif(concat_ws(', ', l.office_no, l.building_name, l.street, l.locality,
                             'P.O. Box ' || l.po_box, l.city, l.country), ''),
            jsonb_strip_nulls(jsonb_build_object(
                'source',             'website_registration',
                'website_lead_id',    l.id,
                'contact_name',       btrim(l.first_name || ' ' || l.last_name),
                'business_activity',  l.business_activity,
                'brands_represented', l.brands_represented
            ))
        )
        RETURNING id INTO v_company_id;
    END IF;

    UPDATE public.website_leads SET company_id = v_company_id WHERE id = l.id;
    RETURN v_company_id;
END;
$$;

REVOKE ALL ON FUNCTION public.website_lead_ensure_company(uuid) FROM public, anon, authenticated;


-- ── INTERNAL: website_find_or_create_category ────────────────
-- Resolves a category name typed on the form ("Other (not listed)").
-- Duplicates are detected on the normalised name — public.slugify(), i.e.
-- lowercase with every run of non-alphanumerics collapsed to '-' — matched
-- against both the slug and the slugified name of every non-deleted category,
-- active or not, at any level. So "Fire  Fighting", "fire-fighting" and
-- "FIRE FIGHTING!" all resolve to one row. A new category is created at the
-- top level, active (so the next visitor can pick it), and tagged in its
-- description so masters can find and re-file it.
-- Not callable by clients (no grants).
CREATE OR REPLACE FUNCTION public.website_find_or_create_category(p_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_name text := regexp_replace(btrim(coalesce(p_name, '')), '\s+', ' ', 'g');
    v_key  text := public.slugify(p_name);
    v_id   uuid;
    v_slug text;
    v_n    int := 1;
BEGIN
    IF char_length(v_name) NOT BETWEEN 2 AND 80 OR v_key = '' THEN
        RAISE EXCEPTION 'INVALID_PRODUCT: category name must be 2–80 characters';
    END IF;

    FOR attempt IN 1..3 LOOP
        SELECT id INTO v_id
          FROM public.categories
         WHERE deleted_at IS NULL
           AND (slug = v_key OR public.slugify(name) = v_key)
         ORDER BY is_active DESC, level, created_at
         LIMIT 1;
        IF v_id IS NOT NULL THEN
            RETURN v_id;
        END IF;

        -- slug is globally unique; a soft-deleted category may still hold it.
        v_slug := v_key;
        WHILE EXISTS (SELECT 1 FROM public.categories WHERE slug = v_slug) LOOP
            v_n := v_n + 1;
            v_slug := v_key || '-' || v_n;
        END LOOP;

        BEGIN
            INSERT INTO public.categories (name, slug, description, is_active)
            VALUES (v_name, v_slug, 'Added from a souqroute.com registration.', true)
            RETURNING id INTO v_id;
            RETURN v_id;
        EXCEPTION WHEN unique_violation THEN
            -- Someone created it concurrently: loop and pick theirs up.
            v_id := NULL;
        END;
    END LOOP;

    RAISE EXCEPTION 'INVALID_PRODUCT: could not save the category, please try again';
END;
$$;

REVOKE ALL ON FUNCTION public.website_find_or_create_category(text) FROM public, anon, authenticated;


-- ── RPC: submit_website_lead ─────────────────────────────────
-- The ONLY way the public form writes. Inserts the lead and, if a product was
-- given, the panel company + PENDING_REVIEW product + images — all in one
-- transaction, so a rejected submission leaves nothing half-created.
-- status and created_at always come from the column defaults.
--
--   p_lead    jsonb  snake_case lead fields (see table above)
--   p_product jsonb  REQUIRED: { name, description, search_keywords[],
--                    image_primary_url, image_secondary_url, and EITHER
--                    category_id (panel categories.id) OR new_category_name }
--
-- Images are uploaded by the form to the public `product_images` bucket
-- (anon can't write to the panel's company-scoped `product-images` bucket,
-- and no company exists yet at upload time). product_images.storage_path
-- records 'product_images/<path>' so it is obvious which bucket holds it.
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
    v_lead_id      uuid;
    v_company_id   uuid;
    v_product_id   uuid;
    v_product_name text;
    v_category_id  uuid;
    v_keywords     text[];
    v_image_1      text;
    v_image_2      text;
    v_image        text;
    v_sort         int := 0;
    -- Only accept images uploaded to this project's product_images bucket.
    c_image_marker constant text := '/storage/v1/object/public/product_images/';
BEGIN
    IF p_lead IS NULL OR jsonb_typeof(p_lead) <> 'object' THEN
        RAISE EXCEPTION 'INVALID_LEAD: lead payload is required';
    END IF;

    IF p_product IS NULL OR jsonb_typeof(p_product) <> 'object' THEN
        RAISE EXCEPTION 'INVALID_PRODUCT: product details are required';
    END IF;

    -- Validate the product before writing anything.
    IF p_product IS NOT NULL THEN
        v_product_name := nullif(btrim(p_product->>'name'), '');
        IF v_product_name IS NULL OR char_length(v_product_name) > 200 THEN
            RAISE EXCEPTION 'INVALID_PRODUCT: product name is required (max 200 characters)';
        END IF;

        IF char_length(coalesce(p_product->>'description', '')) > 2000 THEN
            RAISE EXCEPTION 'INVALID_PRODUCT: description is too long (max 2000 characters)';
        END IF;

        IF nullif(btrim(p_product->>'new_category_name'), '') IS NOT NULL THEN
            -- Resolved (found or created) after validation, below.
            v_category_id := NULL;
        ELSE
            BEGIN
                v_category_id := nullif(p_product->>'category_id', '')::uuid;
            EXCEPTION WHEN invalid_text_representation THEN
                v_category_id := NULL;
            END;
            IF v_category_id IS NULL OR NOT EXISTS (
                SELECT 1 FROM public.categories
                 WHERE id = v_category_id AND is_active AND deleted_at IS NULL
            ) THEN
                RAISE EXCEPTION 'INVALID_PRODUCT: please choose a product category';
            END IF;
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
    END IF;

    INSERT INTO public.website_leads (
        first_name, last_name, company, business_activity, phone, email,
        city, country, brands_represented, mobile_number, website, office_no,
        building_name, street, locality, po_box, message
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
        nullif(btrim(p_lead->>'message'), '')
    )
    RETURNING id INTO v_lead_id;

    IF p_product IS NOT NULL THEN
        IF v_category_id IS NULL THEN
            v_category_id := public.website_find_or_create_category(p_product->>'new_category_name');
        END IF;

        v_company_id := public.website_lead_ensure_company(v_lead_id);

        -- products_before_insert only lets masters / company members insert
        -- and enforces product_limit. This function is the gatekeeper here,
        -- so bypass those guards for this one insert (transaction-local).
        PERFORM set_config('app.skip_guards', 'on', true);
        INSERT INTO public.products (
            company_id, category_id, name, description, status, submitted_at, metadata
        )
        VALUES (
            v_company_id, v_category_id, v_product_name,
            nullif(btrim(p_product->>'description'), ''),
            'PENDING_REVIEW', now(),
            jsonb_build_object(
                'source',          'website_registration',
                'website_lead_id', v_lead_id,
                'search_keywords', to_jsonb(v_keywords)
            )
        )
        RETURNING id INTO v_product_id;
        PERFORM set_config('app.skip_guards', 'off', true);

        FOREACH v_image IN ARRAY array_remove(ARRAY[v_image_1, v_image_2], NULL) LOOP
            INSERT INTO public.product_images (product_id, storage_path, url, sort_order, is_primary)
            VALUES (
                v_product_id,
                'product_images/' || split_part(substring(v_image FROM position(c_image_marker IN v_image) + char_length(c_image_marker)), '?', 1),
                v_image,
                v_sort,
                v_sort = 0
            );
            v_sort := v_sort + 1;
        END LOOP;

        UPDATE public.website_leads SET panel_product_id = v_product_id WHERE id = v_lead_id;
    END IF;

    PERFORM public.notify_masters(
        'WEBSITE_REGISTRATION',
        'New website registration',
        btrim(p_lead->>'company')
            || CASE WHEN v_product_id IS NOT NULL THEN ' registered and submitted "' || v_product_name || '".'
                    ELSE ' registered on souqroute.com.' END,
        'website_leads',
        v_lead_id
    );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_website_lead(jsonb, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_website_lead(jsonb, jsonb) TO anon, authenticated;


-- ── RPC: create_company_from_website_lead (panel masters) ────
-- The panel's "Create company" button on a registration that came in without
-- a product. Returns the (possibly pre-existing) company id.
CREATE OR REPLACE FUNCTION public.create_company_from_website_lead(p_lead_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_master_user() THEN
        RAISE EXCEPTION 'FORBIDDEN: only master users can create companies' USING errcode = '42501';
    END IF;
    RETURN public.website_lead_ensure_company(p_lead_id);
END;
$$;

REVOKE ALL ON FUNCTION public.create_company_from_website_lead(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.create_company_from_website_lead(uuid) TO authenticated;


-- ── VERIFY ───────────────────────────────────────────────────
--   SELECT count(*) FROM public.website_leads;
--   SELECT * FROM public.website_admins;
-- As anon, both `GET` and `POST /rest/v1/website_leads` must be refused
-- (permission denied, 42501). Only `POST /rest/v1/rpc/submit_website_lead` works.
