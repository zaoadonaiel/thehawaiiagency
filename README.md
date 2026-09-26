# The Hawaii Agency — website

The redesigned website for **[The Hawaii Agency](https://thehawaiiagency.com)**, built with
[Astro 7](https://astro.build). It is a static, multi-page site. Content is structured in content collections,
typography is Google Sans (self-hosted through Astro's Fonts API), and the motion system is progressive:
GSAP + ScrollTrigger + Lenis, loaded only when the visitor allows motion.

- Content inventory, page map and **items flagged for review**: [`docs/CONTENT-INVENTORY.md`](docs/CONTENT-INVENTORY.md)
- Image sources and the generative art pipeline: [`docs/ASSET-MANIFEST.md`](docs/ASSET-MANIFEST.md)

## Requirements

- Node.js **22.12+** (see `engines` in Astro)
- npm 9.6+

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build to `dist/` (pages, optimized images, sitemap, `_redirects`) |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Type-check `.astro` / `.ts` files |
| `npm run art` | Regenerate the artwork, OG image and favicons (`scripts/generate-art.mjs`) |

## Contact form setup

The enquiry form has the same fields as the old site (name, email, phone, "What service do you need?"). The old form
posted to WordPress, which no longer exists, so point it at any form backend that accepts a standard POST and
replies with JSON:

```bash
cp .env.example .env
# then set, for example:
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
# or, for Web3Forms:
PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
PUBLIC_FORM_ACCESS_KEY=your-public-access-key
```

Set the same variables in your host's environment settings, then rebuild.

- **With an endpoint:** the form submits with `fetch`, validates accessibly, shows loading, success and error states,
  and only reports success on a 2xx response. It includes a honeypot field.
- **Without an endpoint:** the form never pretends to send. It opens the visitor's email app with a pre-filled
  message to `PUBLIC_CONTACT_EMAIL` (default `info@thehawaiiagency.com`).
- No secrets are shipped. Only `PUBLIC_*` values that are designed to be public are used.

Booking links go to the agency's existing Calendly event types. Hosting "Get started" buttons and the $499 website
offer go to the existing Stripe payment links. All of these are set in `src/data/site.ts` and `src/data/hosting.ts`.

## Deployment — Cloudflare (from GitHub)

The site is fully static, so no adapter is needed. `_redirects` is generated into `dist/` at build time, and
`public/_headers` and `.node-version` are included. All three were verified locally with
`wrangler pages dev`: 568 redirect rules and 3 header rules parse cleanly.

### Option A — Cloudflare Pages (recommended)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick this repo.
2. Build settings:
   | Setting | Value |
   | --- | --- |
   | Framework preset | **Astro** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave empty)* |
3. **Environment variables** (Production *and* Preview):
   - `NODE_VERSION` = `22` (`.node-version` already pins this; the variable is a belt-and-braces setting)
   - `PUBLIC_FORM_ENDPOINT` = your form endpoint (see *Contact form setup*)
   - `PUBLIC_FORM_ACCESS_KEY` = only if you use Web3Forms
4. **Save and Deploy.** Every push to `main` redeploys production, and every other branch or PR gets a preview URL.
5. **Custom domain:** project → **Custom domains** → add `thehawaiiagency.com` and `www.thehawaiiagency.com`.
   If the domain's DNS is already on Cloudflare, the records are created for you. Otherwise, move the nameservers
   to Cloudflare first. Then add a redirect so `www` goes to the apex domain (or the other way round). The canonical
   URL used across the site is `https://thehawaiiagency.com`.

### Option B — Cloudflare Workers (static assets)

**Workers & Pages** → **Create** → **Import a repository**. Cloudflare reads `wrangler.jsonc` (assets from
`./dist`, `404.html` for not-found pages, automatic trailing slashes). Set build command `npm run build` and deploy
command `npx wrangler deploy`, and add the same environment variables as build variables. `_redirects` and
`_headers` work the same way.

### What happens to the old WordPress URLs

- The old location pages, `/case1/`, the category, tag and author archives, and the builder URLs return **301** to
  their new pages (from `_redirects`).
- `/about` → `/about/` (the trailing slash is added automatically). Unknown URLs get the custom `404.html`.
- After switching DNS, submit `https://thehawaiiagency.com/sitemap-index.xml` in Google Search Console.

### Other hosts

Netlify reads the same `_redirects` file. On any other static host, the generated redirect pages
(meta refresh + canonical) still work.

### URL preservation & redirects

Every important URL from the WordPress site is kept (`/web-design/`, `/seo/`, `/case-studies/`, `/contact/`,
`/hippa-compliance/`, `/google-searches-from-mobile-devices/` …). The ~246 near-duplicate location pages
(`/web-design-{place}-hi/`, `/app-developer-{place}-hi/`), `/case1/`, the category, tag and author archives, and the
builder-internal URLs 301 to their closest page. The map lives in `src/data/redirects.ts`.

## Project structure

```
├── astro.config.mjs          # site, fonts (Google Sans), sitemap, redirects, _redirects writer
├── docs/                     # content inventory, page map, flags, asset manifest
├── scripts/generate-art.mjs  # deterministic generative artwork
├── public/                   # favicons, OG image, original brand files
└── src/
    ├── assets/
    │   ├── art/              # vector contour SVGs (inlined, drawn on scroll)
    │   └── images/{art,projects}
    ├── components/
    │   ├── layout/           # Header (mega menu + mobile menu), Footer
    │   ├── sections/home/    # Hero, ServiceMarquee, Statement, ServicesPanorama, FeaturedWork, Founder, Principles, HostingTeaser, ReviewsRiver
    │   ├── sections/service/ # HostingPlans, SocialPlans
    │   ├── sections/shared/  # PageHero, EnquirySection, ContactForm, MeetingOptions, FaqList, ProjectCard
    │   ├── seo/SEO.astro     # meta, Open Graph, canonical, JSON-LD
    │   └── ui/               # Button, Eyebrow, Wordmark, Clock, Breadcrumbs
    ├── content/              # services/*.json, projects/*.json, blog/*.md
    ├── content.config.ts     # collection schemas
    ├── data/                 # site facts, navigation, reviews, FAQs, hosting, social plans, redirects
    ├── layouts/              # BaseLayout, DocumentLayout, ArticleLayout
    ├── pages/                # routes (service pages at /[slug]/, case studies at /case-studies/[slug]/)
    ├── scripts/
    │   ├── core/             # header, clock, form, cursor preview (always loaded, ~3 KB gz)
    │   └── motion/           # GSAP/ScrollTrigger/SplitText/Lenis engine (lazy, ~51 KB gz)
    └── styles/               # variables, typography, utilities, animations, global
```

## Editing content

- **Business details** (phone, email, address, socials, booking links, offer): `src/data/site.ts`
- **Services**: one JSON file per service in `src/content/services/`. The file name is the URL (`seo.json` → `/seo/`).
- **Case studies**: one JSON file per project in `src/content/projects/`. Add an image to
  `src/assets/images/projects/` and reference it relatively.
- **Articles**: Markdown in `src/content/blog/`. For a new article, add a page under `src/pages/` like
  `google-searches-from-mobile-devices.astro`, or switch the journal to a `/blog/[slug]/` route.
- **Reviews**: `src/data/reviews.ts`. They are verbatim Google reviews, so please keep them verbatim.

## Motion & accessibility

- Motion is opt-in via data attributes (`data-split`, `data-reveal`, `data-clip`, `data-parallax`, `data-draw`,
  `data-scrub-words`, `data-count`, `data-horizontal`, `data-magnetic`). See `src/scripts/motion/index.ts`.
- Visitors with `prefers-reduced-motion` get no smooth scroll, no reveals and no pinning. The content is simply there.
- Without JavaScript, or if the motion bundle fails, all content remains visible: hidden states apply only under
  `html.motion`, which removes itself after 3.5 s if the engine doesn't start.
- Page transitions use native cross-document View Transitions. Back/forward and direct links behave normally.
- Also included: skip link, visible focus styles, a focus-trapped mobile menu dialog, native `<details>` FAQs,
  labelled form fields with live error messages, one `h1` per page, and descriptive alt text (or empty alt for
  decorative art).
