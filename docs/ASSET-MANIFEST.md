# Asset Manifest

Every image on the site is one of three kinds. The kind is always clear to visitors: generated artwork carries
a "Fig." caption or is purely decorative, and client imagery is labelled as the client's project.

## 1. Authentic client imagery — `src/assets/images/projects/`

Project presentation images published by the agency on its own case-studies page
(`thexdigital.com/wp-content/uploads/2025/06/*`) and homepage (`thehawaiiagency.com/wp-content/uploads/2024/03/*`).
They are used as-is (flattened and renamed). `astro:assets` optimizes them to AVIF/WebP at build time.

| File | Project |
| --- | --- |
| `im-in-hawaii.jpg`, `im-in-hawaii-app-screens.jpg` | Im in hawaii (iminhawaii.com) |
| `hawaii-gallery.jpg` | HAWAII.GALLERY |
| `als-upholstery.jpg` … `mars-hot-chicken.jpg` (24 files) | one per case study listed on /case-studies/ |

## 2. Generative artwork — `src/assets/images/art/`, `src/assets/art/`

No image-generation model was available in the build environment, so the site's original artwork is
**procedurally generated** by `scripts/generate-art.mjs` (`npm run art`). The script is deterministic, so running it
again reproduces the same files. Nothing here depicts a real client project.

| File | Used on | Description |
| --- | --- | --- |
| `hero-ridgeline.webp` | Home hero | Layered, fluted Koʻolau-style ridgelines in blue haze over a glinting sea (Fig. 01) |
| `ridgeline-wide.webp` | About (Fig. 03), OG image base | Wide windward ridgeline panorama |
| `studio-ridgeline.webp` | Founder section (Fig. 02) | Cooler upcountry-morning variant |
| `tide-lines.webp` | Hosting teaser panel | Navy field of drifting tide lines |
| `service-*.webp` (11) | Service pages, panorama, mega menu | "Blueprint" series: topographic contours, registration marks and a motif per service |
| `service-mobile-search.webp` | Article cover | Phone with search results and signal arcs |
| `contours-oahu.svg`, `contours-summit.svg`, `contours-band.svg` | Section backgrounds | Vector topographic lines, drawn on scroll |
| `public/og/default.jpg` | Social sharing | Ridgeline + wordmark set in Google Sans (converted to outlines) |
| `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | Browser/app icons | "Tide lines" mark |

## 3. Brand reference — `public/brand/`

`the-hawaii-agency-logo-2023.png` and `the-hawaii-agency-favicon-2024.png` are the original gold logo files,
kept for reference. The redesign uses a typographic wordmark (see `src/components/ui/Wordmark.astro`).
**Please confirm** the new mark, or supply vector logo files to swap in.

## Optional: photography prompts (for a future image-model or photo shoot)

If you later want photographic or AI-generated imagery, these prompts match the current art direction. Replace the
file with the same name in `src/assets/images/art/` and the site will pick it up.

- **hero-ridgeline** — "Early-morning view of the fluted Koʻolau mountains on Oʻahu, soft blue atmospheric haze,
  pale sky taking up the upper half, calm ocean in the foreground, muted powder-blue palette, editorial
  landscape photography, no people, no text, portrait 4:5."
- **studio-ridgeline** — "Upcountry Maui at dawn, layered hills fading into mist, cool blue-gray tones,
  minimal, fine-art print feel, portrait 4:5, no text."
- **ridgeline-wide** — "Panoramic windward coastline with steep green ridges softened by blue haze, desaturated
  toward powder blue, wide 16:9, no people, no text."
- **service-web-design** — "Overhead shot of a minimalist desk with a laptop showing an abstract website
  wireframe (no readable text or logos), soft daylight, pale blue and white palette, 4:3."
- **service-app-developer** — "Three smartphones on a pale blue surface showing abstract app interfaces
  (no logos or readable text), soft shadows, 4:3."
- **Founder portrait** — use a real photograph of Davey Duarte. It should not be AI-generated.
