# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**SouqRoute** (`souqroute-react`) — a marketing / lead-generation website for a Saudi Arabian
B2B industrial supply-chain marketplace (MEP, construction materials, electrical supplies,
industrial equipment), positioned around Saudi Vision 2030. Production domain:
`https://souqroute.com`.

It is **not** an actual marketplace app: there is no product catalog, no buyer/supplier
accounts, no RFQ engine. The whole site funnels visitors into one multi-step registration
form that writes a row to the Supabase `website_leads` table (optionally with one product
into `catalog_products`), plus a lightweight admin panel around those leads and products. Marketing copy describes RFQ/messaging features as future/aspirational.

## Stack

- React 18 + Vite 5, plain JavaScript (`.jsx`), no TypeScript
- `react-router-dom` v7 — client-side routing (BrowserRouter)
- `react-helmet-async` — per-page SEO meta + JSON-LD
- `react-hot-toast` — all user feedback (no inline alerts/banners)
- `@supabase/supabase-js` — Supabase is the only live backend (leads, products, admin auth).
  `firebase` is still a dependency but nothing in `src/` uses it (legacy, pending removal)
- Plain CSS, one `.css` file per component/page. No Tailwind, no CSS-in-JS, no UI library.
- Deployed to Vercel (`vercel.json` rewrites everything to `/index.html` for SPA routing)

## Commands

```bash
npm run dev      # vite dev server
npm run build    # production build to dist/
npm run lint     # eslint (flat config, eslint.config.js)
npm run preview  # preview the production build
```

There are **no tests** in this project and no test tooling configured.

## Layout

```
index.html            static <head>: favicons, base SEO, Organization JSON-LD
src/
  main.jsx            React root
  App.jsx             HelmetProvider > Router > Toaster > Navbar / Routes / Footer
  index.css           brand tokens (:root vars), font import, base typography/buttons
  App.css             a SECOND copy of the tokens + .container, .btn, .section-header
  styles/animations.css  keyframes + .animate-on-scroll / .fade-in-* / .delay-N00 utilities
  lib/firebase.js     LEGACY Firebase app + Firestore handle — imported by nothing
  hooks/useScrollAnimations.js  IntersectionObserver that adds .animated on scroll
  components/         Navbar, Footer, ScrollToTop, SEO, RegistrationForm, WelcomeModal,
                      ProductManager (admin Products tab)
  lib/supabaseClient.js  two Supabase projects (test/live), getSupabaseClient(env),
                      getSupabaseAdminClient(env), PUBLIC_SUPABASE_ENV
  lib/leads.js        website_leads data access (submit RPC, list, status, delete)
  lib/products.js     product/category/image data access, env-scoped
  pages/              one .jsx + matching .css per route
  data/blogData.js    all 6 blog posts, hardcoded (HTML strings)
public/               images, favicons, robots.txt, sitemap.xml, manifest.json
supabase/product_catalog.sql  product tables + storage bucket; RUN MANUALLY per project
supabase/website_leads.sql    leads table, admin allowlist, submit RPC; RUN MANUALLY per
                      project, AFTER product_catalog.sql
scripts/migrate-leads-to-supabase.mjs  one-off import of old leads (service-role key)
firestore.rules       LEGACY Firestore rules for the old `leads` collection
firebase.json         Firebase CLI config
.firebaserc           pins the default project to `souqroute`
old_static_site/      the pre-React HTML site — dead code, do not edit
*.md (root)           ~20 historical implementation notes (SEO, branding, etc.) — mostly stale
```

## Routes (`src/App.jsx`)

| Path | Page | Notes |
|---|---|---|
| `/` | `Home` | hero, stats, About + `RegistrationForm`, categories, Vision 2030, contact. Also renders `WelcomeModal` |
| `/about` | `About` | |
| `/services` | `Services` | |
| `/solutions` | `Solutions` | |
| `/vision-2030` | `Vision2030` | |
| `/blog` | `Blog` | grid from `blogData.js` |
| `/blog/:slug` | `BlogDetail` | unknown slug → `<Navigate to="/blog" replace />` |
| `/supplier-in-saudi-arabia` | `SuppliersSaudiArabia` | SEO landing page |
| `/supplies-companies-saudi-arabia` | `SuppliesCompaniesSaudi` | SEO landing page |
| `/wholesaler-supplier-saudi-arabia` | `WholesalerSupplierSaudi` | SEO landing page |
| `/souquerootadmin` | `Admin` | Dashboard / Leads / Products / Create Account (note the deliberate misspelling) |

There is **no 404 route** — unmatched paths render only Navbar + Footer.

Adding a route means touching: `App.jsx`, `Navbar.jsx` and/or `Footer.jsx` links, and
`public/sitemap.xml`.

## Brand & styling conventions

Official brand palette (defined as CSS vars in both `index.css` and `App.css`):

- `--color-black: #000000`, `--color-white: #FFFFFF`
- `--color-gray: #ADADAD`, `--color-red: #E21323` (the single accent / all CTAs)
- Font: **Parkinsans** (Google Fonts, imported at the top of `index.css`)

`App.css` also keeps legacy aliases (`--primary-blue`, `--accent-orange`, `--success-green`…)
that are all remapped to the brand black/red — an artifact of a blue→black/red rebrand.
Don't introduce new colors; use the brand vars. The token block is duplicated in `index.css`
and `App.css` — change both if you change tokens.

Conventions to follow when editing or adding pages:

- One CSS file per page/component, imported at the top of the JSX file. Class names are
  page-scoped by prefix (`.home-page`, `.blog-detail-page`, …) — there are no CSS modules.
- Every page calls `useScrollAnimations()` and imports `../styles/animations.css`, then marks
  elements with `className="animate-on-scroll fade-in-up delay-200"` etc.
- Shared page-hero markup pattern: `<section className="page-hero">` with `.hero-image`,
  `.hero-overlay`, `.hero-content`, `.container`, `.hero-text`.
- All feedback goes through `toast.*` from `react-hot-toast`. Toast styling is configured
  once, globally, in `App.jsx` — don't restyle toasts per call site.
- Images live in `/public/images/` and are referenced by absolute path (`/images/foo.png`).

## SEO

SEO is a first-class concern here (many of the root `*.md` files exist for it). Two
mechanisms coexist:

1. `src/components/SEO.jsx` — a `<Helmet>` wrapper with title/description/keywords/OG/Twitter,
   canonical, geo tags and Organization JSON-LD. Used by `Blog` and `BlogDetail`.
2. The three supplier landing pages inline their own `<Helmet>` with page-specific
   `WebPage`/`ItemList`/`FAQPage` JSON-LD instead of using `SEO.jsx`.

`About`, `Services`, `Solutions`, `Vision2030` and `Home` currently have **no** Helmet at all
and fall back to the static `index.html` head — worth using `<SEO />` if you touch them.

`public/sitemap.xml` is hand-maintained; keep it in sync when routes or blog posts change.
Note the site is a client-rendered SPA, so meta tags are only present after JS runs.

## Leads (Supabase `website_leads`)

Leads moved from Firestore to Supabase on 2026-10-13. Schema, RLS and the submit RPC are in
**`supabase/website_leads.sql`** — run it manually per project, after `product_catalog.sql`.

**The table is `website_leads`, not `leads`.** The `souqroute_panel` superadmin app shares
both Supabase projects and already owns `public.leads` (marketplace leads, different shape)
and `legacy_website_leads` (the pre-Firestore table). Never touch those.

### Which project the form writes to

`PUBLIC_SUPABASE_ENV` in `supabaseClient.js`: **live** in production builds, **test** under
`npm run dev`, overridable with `VITE_LEADS_SUPABASE_ENV`. The admin panel instead follows its
header Database picker.

### Row shape

Required: `first_name`, `last_name`, `company`, `business_activity`, `phone`, `email`,
`city`, `country`. Optional: `brands_represented`, `mobile_number`, `website`, `office_no`,
`building_name`, `street`, `locality`, `po_box`, `message`, `product_id` (→ `catalog_products`).
Server-controlled: `status` (default `'new'`, one of new/contacted/qualified/converted/rejected),
`created_at`, `updated_at`. `legacy_ref` is set only on imported rows.

Columns are **snake_case** while form state is camelCase — the mapping is explicit in
`RegistrationForm.jsx`. CHECK constraints carry the length caps and email pattern (copied from
the old `firestore.rules`); the form's `maxLength` attributes mirror them. Adding a field means
updating: form state, the mapping, the table, and the `submit_website_lead` function.

### Access model

- **anon** has no table privileges at all. The public form calls the
  **`submit_website_lead(p_lead, p_product)`** RPC (`security definer`), which inserts the
  optional `catalog_products` row and the lead **in one transaction** and ignores any
  client-supplied `status`/`created_at`. Product images must already be uploaded to the
  `product_images` bucket; the RPC rejects other URLs.
- **authenticated** users can SELECT / DELETE, and UPDATE **only the `status` column**, and
  only if `is_website_admin()` — i.e. their uid is in **`website_admins`**. Sign-ups are open
  on both projects, so a session alone is never enough.

### Optional product (registration step 4)

Step 4 of the form is "Product (optional)". If the visitor ticks the opt-in, they give a name
(required), category (from `catalog_categories`), description, keywords and up to two images.
Images upload via `uploadProductImage` first, then the RPC creates the product and links it
via `website_leads.product_id`. The Leads table in the admin shows it in a Product column.

### Auth & the admin panel

`/souquerootadmin` signs in with **Supabase email/password** against the project chosen in
the Database picker (on the login screen and in the header). `getSupabaseAdminClient(env)` is
a separate, session-persisting client per env (`storageKey: souqroute-admin-<env>`), so the
admin can be signed in to test and live independently, and the session-less
`getSupabaseClient(env)` used for Create Account's `signUp` can never replace it. The old
hardcoded `Admin` / `Admin!123` gate and the `souqroute_admin_auth` flag are gone.

The **whole panel** is gated on `is_website_admin()`: a non-allowlisted account is signed
straight back out at login, and a restored non-admin session sees a "Not an admin" screen.

Granting admin access, per project: create the user (Authentication → Users → Add user,
auto-confirm), then
`INSERT INTO website_admins (user_id, email) SELECT id, email FROM auth.users WHERE email = '…';`

### Migrated data

`scripts/migrate-leads-to-supabase.mjs` imports the 38 original leads from the gitignored
`leads-backup.json` with their **real** submission dates (`legacy_ref = 'supabase-v1:<id>'`),
plus — with `--firestore <service-account.json>` and a temporary `npm i --no-save
firebase-admin` — every non-`legacy-*` Firestore doc (`'firestore:<docId>'`). Upserts on
`legacy_ref`, so it is safe to re-run; `--dry-run` prints counts; `--env` defaults to live.
Needs `SUPABASE_SERVICE_ROLE_KEY` on the command line — never in `.env`, never `VITE_`.

### Legacy Firebase

Firestore project `souqroute` still holds the old `leads` collection. Nothing in `src/` reads
or writes it. Once the import is verified: set `allow create: if false` in `firestore.rules`
and deploy (`firebase deploy --only firestore:rules --project souqroute`), then delete
`src/lib/firebase.js` and `npm uninstall firebase`.

## Products

The **Products** tab (`src/components/ProductManager.jsx`) adds and manages a product catalog
in Supabase. Data access is in `src/lib/products.js`; every function takes the env id as its
first argument, so no call can be ambiguous about which project it writes to.

Schema is **`supabase/product_catalog.sql`** — it is NOT applied automatically. Run it once
per Supabase project (SQL Editor → paste → Run) or every call fails with "relation does not
exist"; `ProductManager` detects that error and says which file to run.

| Table | Purpose |
|---|---|
| `catalog_categories` | dropdown source; the tab's "+ Add" button inserts here |
| `catalog_products` | name, description, `category_id`, two image URLs, `search_keywords[]`, `hashtags[]` |

**The `catalog_` prefix is load-bearing.** Both Supabase projects already host the superadmin
panel's supplier catalog in `products` / `master_products` (`company_id`, `master_product_id`,
`product_description`), and that app reads and writes those tables in several components.
This catalog must never rename, drop or alter them. Queries embed the category with an
explicit alias — `.select('*, category:catalog_categories(id, name)')` — so the JS-side key
is `product.category`, independent of the table name.

Storage bucket **`product_images`** (public read) holds both uploads; the form caps files at
5MB and deleting a product best-effort removes its images.

Search works off a `search_text` column that a **BEFORE INSERT OR UPDATE trigger** keeps in
sync — a lowercase blob of name + description + keywords + hashtags. One `ilike` therefore
matches partially across all four. Never write `search_text` from the client; the trigger
owns it. Adding a searchable field means updating `catalog_products_build_search_text()`.

Hashtags are stored **without** the leading `#` (`parseHashtagList` strips it) so a search for
`electrical` matches `#electrical`.

`ProductManager.describeError` maps PostgREST error **codes** (not message text) to specific
fixes: `PGRST205`/`42P01` means the tables were never created, `PGRST200` means the two tables
aren't linked, `42703` means they exist with the wrong shape, `42501` means RLS refused the
write. Matching on codes keeps "table missing" and "relationship missing" from collapsing into
one misleading message.

Accounts created in the Create Account tab are plain Supabase Auth users — they get no
access to the admin panel unless they are also added to `website_admins`.

## Known issues — be aware before "fixing"

- **`.env` is committed to git.** For Firebase this is tolerable (the web config is public
  by design and ships in the JS bundle) and it keeps the Vercel build working. The old
  **Supabase URL + anon key remain in git history** — that Supabase project should be
  deleted or its keys rotated.
- `/souquerootadmin` is not covered by the `Disallow: /admin` rule in `robots.txt`.
- Sign-ups are open on both Supabase projects (the Create Account tab relies on it). That is
  harmless while `website_admins` gates the panel and every lead read, but the Auth user list
  may accumulate junk accounts.
- `BlogDetail` renders post content with `dangerouslySetInnerHTML`. Safe today because posts
  are hardcoded in `blogData.js`; it stops being safe if content ever becomes user-supplied.
- `WelcomeModal` fires on every home-page visit (by design, per its comment) and scrolls to
  `#about`, which is the registration section.
- Navbar/Footer "Get Started", "Contact Us" and the service links are `#hash` anchors that
  only resolve on the home page; from other routes they do nothing.
- `README.md` is still the stock Vite template.
- `SUPABASE_SETUP.md`, `SUPABASE_QUERIES.md` and `SUPABASE_ADMIN_SETUP.md` describe the
  original (pre-Firestore) Supabase `leads` table, which no longer exists under that name —
  `supabase/website_leads.sql` is the source of truth for lead storage now.
- Neither Supabase project (`gmgrsuynufoycvnqaltj`, `akwycltnkqcrwezqldbt`) appears in the
  Supabase account connected via MCP — they live under a different login. Both were verified
  reachable over the auth REST API on 2026-09-10, so this is an access-visibility gap, not a
  missing project.
- Both Supabase anon keys are committed in `.env` and are in git history. Same reasoning as
  the Firebase config (anon keys are public by design and ship in the bundle), but the
  **live** project's key is now in the client bundle too — its row-level security is the only
  thing protecting production data.
- **The product tables and the `product_images` bucket are still writable by `anon`.** This
  was a deliberate call (2026-09-10) when the panel had no database identity. The panel now
  has a real Supabase login, so this can be tightened: point `ProductManager` / `products.js`
  at `getSupabaseAdminClient` and change the catalog policies to `TO authenticated USING
  (is_website_admin())`. Keep the bucket's INSERT open to anon (or move uploads behind the
  RPC) — the public registration form uploads product images anonymously.
- The root `*.md` files are historical status reports written during development. Treat them
  as background, not as current spec — verify against the code.
