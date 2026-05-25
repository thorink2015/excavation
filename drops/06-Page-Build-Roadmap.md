# Groundwork Solutions: Page Build Roadmap

The order to build the site, what depends on what, and what to do at each step. Follow this and nothing gets built twice or in the wrong order.

---

## Phase 0: Global setup (before any page)

Lock these once at the site level. Every page inherits them.

- [ ] **GHL Site Settings:** title separator, default OG image, favicon set
- [ ] **Global Header (Custom Code in site-wide head):**
  - Font preconnect + Google Fonts link (Big Shoulders Display + Public Sans)
  - Global CSS variables (`--gw-paper`, `--gw-ink`, etc. from Brandbook section 3)
  - Organization JSON-LD (sitewide schema, see SEO doc section 5.1)
- [ ] **GHL Native Menu** configured per Menu and Footer Standards section 2
- [ ] **Top utility bar** added to global header per Menu and Footer Standards section 1
- [ ] **Global Footer** section built once, reused on every page (Menu and Footer Standards section 3)
- [ ] **Default OG image** uploaded to GHL Media (1200x630, brand colors, logo lockup)
- [ ] **Favicon set** uploaded (32x32, 192x192, 512x512, apple-touch-icon)
- [ ] **llms.txt** uploaded to root

Do not skip this phase. The footer and menu live in the global section so we don't paste them into every page.

---

## Phase 1: Anchor pages (build in this order)

These set the voice and visual standards. Build them first, in this order, because every page after copies their patterns.

| Order | Page | Why this order |
|---|---|---|
| 1 | Home (`/`) | Sets the visual tone, hero pattern, trust strip, CTA blocks |
| 2 | Contact (`/contact`) | Form pattern needed for every other page's bottom CTA |
| 3 | About (`/about`) | Owner story unlocks trust references on every other page |
| 4 | Services overview (`/services`) | Card pattern for service grid |
| 5 | Who We Work With overview (`/who-we-work-with`) | Card pattern for industry grid |

After Phase 1, the design system is locked. Phases 2 and 3 reuse those patterns.

---

## Phase 2: Service detail pages (8 pages, one template)

All 8 use the same template. Build the first one carefully, then the next 7 are 5-minute swaps of copy and links.

Recommended order (by traffic priority):

1. `/services/excavation`
2. `/services/utility-trenching`
3. `/services/pool-excavation`
4. `/services/rough-grading`
5. `/services/demolition`
6. `/services/site-clearing`
7. `/services/concrete-removal`
8. `/services/asphalt-removal`

Each page needs:
- Cross-links to mapped industries (URL Map section 2.1)
- Cross-links to related services (URL Map section 2.3)
- Service schema JSON-LD (SEO doc section 5.3)
- 2 to 3 FAQ items with FAQPage schema

---

## Phase 3: Industry detail pages (7 pages, one template)

Same template approach. Build by audience priority:

1. `/who-we-work-with/general-contractors`
2. `/who-we-work-with/pool-builders`
3. `/who-we-work-with/site-civil-contractors`
4. `/who-we-work-with/utility-contractors`
5. `/who-we-work-with/landscape-hardscape-contractors`
6. `/who-we-work-with/property-developers`
7. `/who-we-work-with/homeowners`

Each page needs:
- Cross-links to mapped services (URL Map section 2.2)
- WebPage schema (SEO doc section 5.5)
- 2 to 3 FAQ items with FAQPage schema

---

## Phase 4: Legal pages

Boilerplate, low effort:

- `/privacy`
- `/terms`

Use a generator (Termly, Iubenda) and adjust to match brand voice lightly. No icons or imagery needed.

---

## Phase 5: Launch tasks (in order)

- [ ] Run Lighthouse on Home, one Service, one Industry. Mobile must hit 85+ Performance, 95+ Accessibility, 95+ SEO
- [ ] Generate `sitemap.xml` per URL Map section 8
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up 301 redirects per URL Map section 9
- [ ] Test all forms (submission, success message, email notification)
- [ ] Test phone click-to-call on real iPhone and Android
- [ ] Test menu on real mobile devices
- [ ] Connect Google Business Profile (separate workflow)
- [ ] Add Google Analytics 4 tag in site-wide tracking
- [ ] Add Microsoft Clarity tag in site-wide tracking
- [ ] Add Meta Pixel if running paid social
- [ ] Final accessibility audit (WAVE, axe DevTools)
- [ ] Final visual audit on mobile, tablet, desktop

---

## Build prompt pattern (for each page)

Every page request follows this template:

> Build the [PAGE NAME] page using:
> - Website copy: groundwork-website-copy.md, [SECTION NAME]
> - URL Map sections [X] for cross-links
> - Brandbook for colors, type, spacing
> - Menu and Footer Standards (footer comes from global, so output without footer)
> - Icon Set Spec for inline SVGs
> - Content Style Guide voice rules
> - SEO Meta and Schema Templates section [X]
>
> Output the page in [one part / two parts: page then footer].
> Form section: leave a placeholder div with the comment "GHL native form goes here."

Full filled-in prompts for each page type are in `08-Page-Prompt-Templates.md`.

---

## Dependencies map (what blocks what)

```
Logo delivery ──┬──> Header build ─────┬──> Phase 1 pages
                ├──> Footer build ─────┤
                └──> OG image ─────────┘

Brand domain set ──> Email address ──> Footer + Contact page

CSLB license # ─────> Footer + Contact + About

Phase 1 done ───────> Phase 2 + 3 pages

All pages live ────> Sitemap ──> Submit to GSC
```

What you need confirmed before homepage build:
- Logo file (SVG)
- Brand email address (for footer and contact)
- CSLB license number (or `[VERIFY]` placeholder)

What can be left as placeholder for now and updated later:
- Real testimonials (use the placeholder in website copy)
- Portfolio photos (use Unsplash compressed during launch)
- Social profile URLs (hide icons until profiles are live)

---

## Build cadence target

| Phase | Time per page | Total time |
|---|---|---|
| Phase 0: Global setup | 2 to 3 hours | 2 to 3 hours |
| Phase 1: Anchor pages (5) | 60 to 90 min each | 5 to 7 hours |
| Phase 2: Service detail (8) | 25 to 40 min each | 4 to 6 hours |
| Phase 3: Industry detail (7) | 25 to 40 min each | 3 to 5 hours |
| Phase 4: Legal (2) | 30 min total | 30 min |
| Phase 5: Launch tasks | varies | 3 to 5 hours |

Total: roughly 18 to 25 hours of focused build time end to end.

---

## Status tracker (update as you go)

Copy this list and check off as pages are built and published.

**Phase 0:**
- [ ] Global header (fonts, CSS variables, Organization JSON-LD)
- [ ] Top utility bar
- [ ] GHL native menu
- [ ] Global footer
- [ ] Default OG image
- [ ] Favicon set
- [ ] llms.txt

**Phase 1:**
- [ ] Home
- [ ] Contact
- [ ] About
- [ ] Services overview
- [ ] Who We Work With overview

**Phase 2:**
- [ ] Excavation
- [ ] Utility Trenching
- [ ] Pool Excavation
- [ ] Rough Grading
- [ ] Demolition
- [ ] Site Clearing
- [ ] Concrete Removal
- [ ] Asphalt Removal

**Phase 3:**
- [ ] General Contractors
- [ ] Pool Builders
- [ ] Site & Civil
- [ ] Utility Contractors
- [ ] Landscape & Hardscape
- [ ] Developers & PMs
- [ ] Homeowners

**Phase 4:**
- [ ] Privacy
- [ ] Terms

**Phase 5:**
- [ ] Lighthouse pass
- [ ] Sitemap submitted
- [ ] Redirects live
- [ ] Forms tested
- [ ] Mobile tested
- [ ] GBP connected
- [ ] Analytics live
