# Content Inventory & Page Map

Audit of **https://thehawaiiagency.com/** (WordPress / Avada + Yoast), performed 2026‑09‑26.
Sources: `robots.txt`, `sitemap_index.xml` and its sub-sitemaps (post, page, category, post_tag,
fusion_tb_category, element_category, slide-page, author), header/footer navigation and
internal links on every core page.

The live site is the source of truth for every fact used in the redesign. Items that could not be
verified, or that look like copy left over from sister sites, are listed under
[Flags for review](#flags-for-review). They were **not** invented or "fixed" silently.

---

## 1. URL discovery summary

| Source | URLs | Notes |
| --- | --- | --- |
| page-sitemap.xml | 268 | ~20 unique pages + ~246 programmatic location pages |
| post-sitemap.xml | 1 | `/google-searches-from-mobile-devices/` |
| category-sitemap.xml | 2 | `/category/latest-articles/`, `/category/uncategorized/` |
| post_tag-sitemap.xml | 3 | tag archives |
| fusion_tb_category / element_category / slide-page | 7 | Avada builder internals (not content) |
| author-sitemap.xml | 1 | `/author/admin/` |
| Internal links not in sitemap | 9 | `/ui-ix`, `/best-google-ads-agency-in-hawaii/`, `/branding-agency-in-hawaii/`, `/custom-software-development-in-hawaii/`, `/ecommerce-solutions/`, `/pbx-phone-systems-in-hawaii/`, `/search-engine-optimization/`, `/ui-ux-design-in-hawaii/`, `/services` anchors |

### Location pages (skipped, consolidated)
- `/web-design-{location}-hi/` (≈182 pages) — sampled Honolulu, Aiea, Big Island, Kauai, Hilo and others.
  They repeat `/web-design/` word for word, apart from the location name in the H1, title and one sentence
  (and some use the phone number (888) 250‑4307). **Consolidated into `/web-design/`** with 301 redirects.
- `/app-developer-{location}-hi/` (≈64 pages) — they repeat `/app-developer/` with only the location name
  changed. **Consolidated into `/app-developer/`** with 301 redirects.
- `/web-design-2/` — a copy of `/web-design/`. Redirected.
- `/web-design-test1-hi/`, `/app-developer-test-hi/` — test pages. Redirected.
- A few location pages (e.g. `/web-design-makiki-hi/`, `/web-design-lanikai-beach-hi/`) returned
  almost empty templates. They add no unique content. Redirected.

The full redirect list is generated from `src/data/redirects.ts`.

---

## 2. Page map

| Old URL | Old title (SEO) | Decision | New URL |
| --- | --- | --- | --- |
| `/` | Best Web Design Hawaii \| Web Designer Near Me | **Retained**, redesigned | `/` |
| `/services/` | Services \| The Hawaii Agency | **Retained** (service index + full FAQ) | `/services/` |
| `/web-design/` | Web Design | **Retained** | `/web-design/` |
| `/app-developer/` | Best App Developer in Hawaii \| App Developer Near Me | **Retained** | `/app-developer/` |
| `/google-ads/` | Google Ads | **Retained** | `/google-ads/` |
| `/seo/` | SEO | **Retained** | `/seo/` |
| `/branding/` | Best Branding Hawaii \| Branding Agency Near Me | **Retained** | `/branding/` |
| `/ecommerce/` | Ecommerce | **Retained** | `/ecommerce/` |
| `/software/` | Software | **Retained** | `/software/` |
| `/ui-ux/` | UI UX | **Retained** | `/ui-ux/` |
| `/phone-systems/` | Phone Systems | **Retained** | `/phone-systems/` |
| `/website-hosting/` | Hosting Plans - Award-Winning Hosting in Houston | **Retained**, title corrected | `/website-hosting/` |
| `/social-media-marketing/` | Social Media Marketing \| The Hawaii Agency | **Retained** | `/social-media-marketing/` |
| `/case-studies/` | Case Studies \| The Hawaii Agency | **Retained**; one detail page added per project | `/case-studies/`, `/case-studies/{slug}/` |
| `/case1/` | case1 | Copy of `/case-studies/`. **Redirected** | `/case-studies/` |
| `/reviews/` | Reviews \| The Hawaii Agency | **Retained** | `/reviews/` |
| `/lets-meet/` | Lets Meet \| The Hawaii Agency | **Retained** | `/lets-meet/` |
| `/contact/` | Contact \| The Hawaii Agency | **Retained** | `/contact/` |
| `/hippa-compliance/` | HIPPA Compliance | **Retained** (URL kept, spelling fixed in copy) | `/hippa-compliance/` |
| `/terms-and-privacy/` | Terms and Privacy | **Retained** | `/terms-and-privacy/` |
| `/google-searches-from-mobile-devices/` | Google Searches From Mobile Devices | **Retained** (article) | same |
| `/category/latest-articles/`, `/category/uncategorized/`, `/tag/*` | archives | **Consolidated** | `/blog/` |
| `/author/admin/` | author archive | **Redirected** | `/about/` |
| — | — | **New**: Studio page combining founder bio, values and "why choose us" from the homepage | `/about/` |
| — | — | **New**: Journal index for the article | `/blog/` |
| `/fusion_tb_category/*`, `/element_category/*`, `/slide-page/*` | builder internals | **Redirected** | `/` |

---

## 3. Business facts (verified)

| Fact | Value | Where found |
| --- | --- | --- |
| Name | The Hawaii Agency | everywhere |
| Legal | "The Hawaii Agency is a TRADE NAME of A Davey Company, LLC" | footer |
| Founder | Davey Duarte — founder, creative director, full-stack developer, server security expert, online marketer | homepage |
| Experience | "over 2 decades of branding experience and 14 years of web design and development experience" | homepage |
| Languages | "100% Fluent in English, Spanish & Portuguese" | homepage |
| Primary phone | (808) 280‑1970 (`tel:8082801970`) | header, footer, contact |
| Email | info@thehawaiiagency.com | terms & privacy |
| Address | 200 N Vineyard Blvd. Ste. A325 #5756, Honolulu, HI 96817 | footer |
| Google rating | "5 Star Agency Based on 26 reviews" / "5‑Star Rated Agency on Google" | homepage |
| Google profile | https://g.co/kgs/YFiAZPX | footer |
| Social | facebook.com/thehawaiiagency, instagram.com/thehawaiiagency, YouTube channel UCU1BoWE8mJWu3IAwiorSnYg | footer |
| Offer | "Startups & Established Businesses… Get A New Website For $499 — Claim Offer Now" → Stripe `6oE8yXg4A47DcOQ9BG` | top bar |
| Booking | Calendly: `daveyduarte/20-minute-meeting` (Free Consultation, 20 min), `daveyduarte/1-hour-existing-client` (Projects in development, 1 hr), `daveyduarte/hour-new-client` (Work Meeting, $100/hr) | /lets-meet/ |
| Contact form | Fields: Full Name, Email, Phone, "What service do you need?" (Avada form posting to WordPress) | /contact/, every service page |

## 4. Content per page (summary — full copy lives in `src/content` and `src/data`)

- **Home**: hero ("Hawaii's Premier Web Design Agency. Empowering Hawaii with cutting-edge design and technology."),
  Google reviews widget (10 reviews), 9 service headings, "Hawaii Web Design" intro, "Custom Web Design & Hosting",
  "Tailored and Cost-Effective Solutions", "Why Choose The Hawaii Agency", Usability, Affordable, Benefits of Hosting,
  Meet Davey Duarte + video (Presto Player id 10064, not publicly retrievable), languages, Award-winning hosting
  (VPSBenchmarks, Fully Managed, Server Optimization), Featured projects (Im in hawaii, HAWAII.GALLERY), hosting
  pricing (CX11, CX21, CX31, STORAGEX, AX), Priority Service / Satisfaction Guaranteed ("Until we're pau") /
  Screen Sharing / Quick Turnaround, footer.
- **Services** (`/services/`): 11 service groups with 36 FAQ entries (App Development, Website Design & Coding,
  Software Development, Website & App Hosting, SEO, Advertising & PPC, Ecommerce, Server Security,
  Branding & Logo Design, Photography, Videography).
- **Service pages** (10 + social): hero tagline, intro, benefits, "features & options", "complete services", free-consultation CTA.
  Software lists 10 industries. Phone Systems covers 3CX cloud PBX. Hosting has pricing plus 9 benefit blocks.
  Social has 4 plans (Kīlauea $1,250, Nā Pali $900, Diamond Head $500, Haleakalā $250).
- **Case studies**: 24 projects, each with domain, location, description and "Case Results". Two more featured
  projects on the homepage (Im in hawaii, HAWAII.GALLERY) = 26 projects in total, each now with its own page.
- **Reviews**: Trustindex Google widget (the same 10 reviews shown on the homepage).
- **Let's Meet**: 3 meeting types (above).
- **HIPAA**: What is HIPAA; "Meet your new HIPAA compliant agency" (4 paragraphs).
- **Terms & Privacy**: full legal text (effective August 14, 2018).
- **Article**: "Google Searches From Mobile Devices" (April 19, 2023, category Latest Articles).

## 5. Images found

| Image | Page(s) | Used in redesign |
| --- | --- | --- |
| `The-Hawaii-Agency-Logo-2023.png`, `The-Hawaii-Agency-Fav.png` | global | Kept in `public/brand/` for reference. The new site uses a typographic wordmark in Google Sans. |
| 24 × project screenshots (`thexdigital.com/wp-content/uploads/2025/06/*.jpg`) | /case-studies/ | **Yes** — authentic project imagery, optimized through `astro:assets` |
| `iminhi-app-development.png`, `iminhawaii-app-1.png` | home, /app-developer/, /branding/ | **Yes** (Im in hawaii case study) |
| `hawaii.gallery.png` | home | **Yes** (HAWAII.GALLERY case study) |
| `IDS-Maui-Website-Design.png` | several service pages | No. No project data exists for "IDS Maui" (alt text wrongly said "Web Design Yorba Linda"). |
| `Blazin-Steaks-Hawaii-Mililani-Town-1.png` | /seo/ | No. No project data exists. |
| `Hosting-Awards-2024-1.png` | footer | No. The badges name **Contabo** (hosting provider), so the award is described in text only, as on the original. |
| Trustindex avatars (googleusercontent) | reviews | No. Third-party hotlinks; initials are used instead. |
| Pexels photo (mobile search) | article | No. Replaced by original artwork. |
| Hosting QR codes / Austin X Digital images | /website-hosting/ | No. They belong to a sister brand. |

---

## Flags for review

These items were found on the live site and need a decision from the business owner. None of them were
published as-is where they would be misleading.

1. **Sister-brand names in copy.** `/services/` says "Houston X Digital" (×5) and "Austin X Digital" (×1).
   The article says "Austin X Digital". `/terms-and-privacy/` names "www.houstonxdigital.com". Form disclaimers say
   "The X Digital". `/case-studies/` StockWatchIndex copy says "a valued client of The X Digital".
   → Replaced with "The Hawaii Agency" or a neutral wording. **Please confirm.**
2. **Template leftovers.** The homepage says "Let us enhance the safety and accessibility of your bathroom today."
   Its progress bars read "85% Product Quality Index" and "92% Energy Generation". → Removed.
3. **Phone numbers.** Header/footer/contact use **(808) 280‑1970**. Service pages list **(808) 437‑5445**.
   `/google-ads/` and location pages list **(888) 250‑4307**. → The site uses (808) 280‑1970 everywhere.
   Set any tracking numbers in `src/data/site.ts`.
4. **Duplicate case-study copy.** "commercialcapitalpartner.com.com" (double `.com`) reuses Dependable Overhead Door's
   description word for word. → Shown with its image, location and result only, with the domain corrected to
   `commercialcapitalpartner.com`. **A real description is needed.**
5. **Hosting price tables conflict.** `/website-hosting/` shows two tables with different specs for the same prices
   (e.g. $30: "2 vCPU / 8 GB RAM" vs "6 vCPU / 24 GB RAM"). There is also a separate $170 vs $190 dedicated plan.
   `/services/` says "up to 32GBS of RAM for only $29/month". → The first table was used, because it is the one on the
   homepage and it carries the Stripe "Get Started" links. The conflicting sentence was omitted.
6. **Hosting awards.** The badges are Contabo's (VPSBenchmarks 3rd place Jan 2024, 2nd July 2023; HostAdvice 2023).
   The original copy says "Our VDS M ranked 3rd…". The text is kept, but no badges are shown.
7. **"Orange County"** appears in the HIPAA copy ("compliance with HIPAA in Orange County and abroad").
   The terms page sidebar describes Davey as founder of "Orange County X Digital". → Location removed from the
   HIPAA sentence; the sidebar was not carried over.
8. **Hosting page SEO title** said "Award-Winning Hosting in Houston". → Changed to Hawaii.
9. **Founder video** (Presto Player id 10064) could not be retrieved publicly. There is no founder photograph,
   so no portrait was generated. Add a real photo at `src/assets/images/about/davey-duarte.jpg` if wanted.
10. **"Florida office based in Tampa"** (Mars Hot Chicken case study) is kept as published. Please verify.
11. **Outdated statements** kept in meaning but de-dated: "the best and latest tech app platforms of 2021",
    "Hackers and Malware attacks are not very rare in 2021".
12. **Services page Q&A** "Can you fix my SEO?" appears twice (under SEO and under Advertising). It is shown once.
