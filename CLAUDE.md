# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**SouqRoute** (`souqroute-react`) — a marketing / lead-generation website for a Saudi Arabian
B2B industrial supply-chain marketplace (MEP, construction materials, electrical supplies,
industrial equipment), positioned around Saudi Vision 2030. Production domain:
`https://souqroute.com`.

It is **not** an actual marketplace app: there is no product catalog, no buyer/supplier
accounts, no RFQ engine. The whole site funnels visitors into one multi-step registration
form that writes a document to the Firestore `leads` collection, plus a lightweight admin
panel scaffolded around those leads. Marketing copy describes RFQ/messaging features as future/aspirational.

## Stack

- React 18 + Vite 5, plain JavaScript (`.jsx`), no TypeScript
- `react-router-dom` v7 — client-side routing (BrowserRouter)
- `react-helmet-async` — per-page SEO meta + JSON-LD
- `react-hot-toast` — all user feedback (no inline alerts/banners)
- `firebase` (v12, modular SDK) — Firestore is the only backend
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
  lib/firebase.js     single shared Firebase app + Firestore handle
  hooks/useScrollAnimations.js  IntersectionObserver that adds .animated on scroll
  components/         Navbar, Footer, ScrollToTop, SEO, RegistrationForm, WelcomeModal
  pages/              one .jsx + matching .css per route
  data/blogData.js    all 6 blog posts, hardcoded (HTML strings)
public/               images, favicons, robots.txt, sitemap.xml, manifest.json
firestore.rules       Firestore security rules (deployed; source of truth)
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
| `/souquerootadmin` | `Admin` | lead dashboard (note the deliberate misspelling) |

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

## Firebase / Firestore

Project **`souqroute`** (number `947834668542`), web app `SouqRoute Web`. Config lives in
`.env` as `VITE_FIREBASE_*` vars and is assembled in `src/lib/firebase.js`, which exports
`db` and `LEADS_COLLECTION`. Firebase web config is public by design — security is enforced
entirely by `firestore.rules`, not by hiding these values.

One collection is used: **`leads`**.

### Document shape

Required: `first_name`, `last_name`, `company`, `business_activity`, `phone`, `email`,
`city`, `country`. Optional: `brands_represented`, `mobile_number`, `website`, `office_no`,
`building_name`, `street`, `locality`, `po_box`, `message`. Server-controlled: `status`
(must be `'new'` on create) and `created_at` (must be `serverTimestamp()`).

Field names are **snake_case** in Firestore while the form state is camelCase — the mapping
is explicit in `RegistrationForm.jsx`. Adding a field means updating three places: the form
state, that mapping, and the `hasAll`/`hasOnly` lists in `firestore.rules`. A field missing
from `firestore.rules` will make the whole write fail with `permission-denied`.

### Migrated data

38 leads were imported from the old Supabase table on 2026-09-02. They use document IDs of
the form `legacy-<old supabase id>` (e.g. `legacy-9`); new form submissions get Firestore
auto-IDs. All string values were trimmed on the way in, and the Supabase-only `id`, `role`
and `category` columns were dropped (`role`/`category` were null for every row).

Caveat: the rules require `created_at == request.time`, so every migrated lead has a
`created_at` of the import date rather than its true submission date (which ranged from
2026-01-26 to 2026-08-31). The original export, with real timestamps, is kept in the
gitignored `leads-backup.json`. Restoring the true dates needs a write that bypasses rules —
i.e. the Admin SDK with a service-account key.

### Security rules

`firestore.rules` is deliberately **create-only from the browser**:

- `allow create` — anyone can submit the public registration form, but the payload is
  validated (required fields, string types, length caps, email regex, `status == 'new'`,
  `created_at == request.time`).
- `allow read` / `allow delete` — admins only (see `isAdmin()` UID allowlist).
- `allow update` — admins only, and narrowed further: the diff may touch **only** `status`,
  and only to one of the five pipeline values. So an admin can move a lead through the
  pipeline but cannot rewrite a lead's name, email or phone.
- Everything outside `/leads` is closed.

Read leads in the [Firebase console](https://console.firebase.google.com/project/souqroute/firestore),
or from a trusted server with the Admin SDK (which bypasses rules).

Deploy rule changes with:

```bash
firebase deploy --only firestore:rules --project souqroute
```

### Auth & the admin panel

`/souquerootadmin` uses a **hardcoded client-side gate** (`Admin` / `Admin!123`) with a
`localStorage['souqroute_admin_auth']` flag — deliberate, chosen over Firebase Auth for now.
It is presentation only: the check runs in the browser, is readable in the JS bundle, and
gives the page no database identity.

Consequence: because `isAdmin()` in `firestore.rules` gates reads on a Firebase Auth UID,
the Leads tab cannot list leads and shows a "read-protected" panel pointing at the console.
Lead data is safe from outsiders; it is simply not visible in the app. Read submissions in
the [Firebase console](https://console.firebase.google.com/project/souqroute/firestore).

The **Create Account** tab uses Firebase Auth directly: `createUserWithEmailAndPassword`
followed by `sendEmailVerification`, then `signOut` — because creating a user also signs the
browser in as that new user, and the panel must not be left holding their session. A second
form sends a password-reset email (`sendPasswordResetEmail`); Firebase has no client API to
re-send a verification mail to an arbitrary address, so reset replaces the old Supabase
"resend confirmation" box.

Accounts created here are only Firebase Auth users — they grant no access to the admin panel,
which is gated by the hardcoded password above.

Firebase Auth (Email/Password) **is** enabled on the project and an admin user already
exists — `info@souqroute.com`, UID `ECcx2ZCx6NSASHdTdKpUx118aY53`, already allowlisted in
`isAdmin()`. `src/lib/firebase.js` still exports `auth`. So switching the panel over later
means only rewriting `handleLogin` to use `signInWithEmailAndPassword`; the rules and the
account need no changes.

Note if you ever swap in Firebase Auth: sign-up is open to anyone holding the public API
key, so `request.auth != null` is NOT a sufficient rule — keep the UID allowlist.

### Security rules

`firestore.rules` is deliberately **create-only from the browser**:

- `allow create` — anyone can submit the public registration form, but the payload is
  validated (required fields, string types, length caps, email regex, `status == 'new'`,
  `created_at == request.time`).
- `allow read` / `allow delete` — admins only (see `isAdmin()` UID allowlist).
- `allow update` — admins only, and narrowed further: the diff may touch **only** `status`,
  and only to one of the five pipeline values. So an admin can move a lead through the
  pipeline but cannot rewrite a lead's name, email or phone.
- Everything outside `/leads` is closed.

Read leads in the [Firebase console](https://console.firebase.google.com/project/souqroute/firestore),
or from a trusted server with the Admin SDK (which bypasses rules).

Deploy rule changes with:

```bash
firebase deploy --only firestore:rules --project souqroute
```

### Auth & the admin panel

Firebase Auth (Email/Password) backs `/souquerootadmin`. `Admin.jsx` uses
`signInWithEmailAndPassword`, `onAuthStateChanged` (Firebase persists the session itself —
there is no localStorage flag any more) and `signOut`. The old hardcoded
`Admin` / `Admin!123` gate is gone.

**Email/Password sign-up is open to anyone holding the public API key**, so
`request.auth != null` is NOT a sufficient rule — a stranger could register and read every
lead. Access is gated on an explicit UID allowlist in the `isAdmin()` function in
`firestore.rules`. Granting someone admin access means adding their UID there and
redeploying; creating the Auth user alone does nothing.

Current admin: `info@souqroute.com` (`ECcx2ZCx6NSASHdTdKpUx118aY53`).

A signed-in non-admin sees a "this account is not an admin" panel instead of the table.

`RegistrationForm.jsx` still writes a backup copy of every submission to
`localStorage['souqroute_leads']` before the Firestore write.

## Known issues — be aware before "fixing"

- **`.env` is committed to git.** For Firebase this is tolerable (the web config is public
  by design and ships in the JS bundle) and it keeps the Vercel build working. The old
  **Supabase URL + anon key remain in git history** — that Supabase project should be
  deleted or its keys rotated.
- `/souquerootadmin` is not covered by the `Disallow: /admin` rule in `robots.txt`.
- Anyone can create a Firebase Auth account against the public API key. That is harmless
  while `isAdmin()` gates every read, but it does mean the Auth user list may accumulate
  junk accounts. Restrict sign-ups in the Identity Platform settings if that becomes a
  problem.
- `BlogDetail` renders post content with `dangerouslySetInnerHTML`. Safe today because posts
  are hardcoded in `blogData.js`; it stops being safe if content ever becomes user-supplied.
- `WelcomeModal` fires on every home-page visit (by design, per its comment) and scrolls to
  `#about`, which is the registration section.
- Navbar/Footer "Get Started", "Contact Us" and the service links are `#hash` anchors that
  only resolve on the home page; from other routes they do nothing.
- `README.md` is still the stock Vite template.
- `SUPABASE_SETUP.md`, `SUPABASE_QUERIES.md` and `SUPABASE_ADMIN_SETUP.md` describe the
  **removed** Supabase backend. They are stale — `firestore.rules` is the source of truth.
- The root `*.md` files are historical status reports written during development. Treat them
  as background, not as current spec — verify against the code.
