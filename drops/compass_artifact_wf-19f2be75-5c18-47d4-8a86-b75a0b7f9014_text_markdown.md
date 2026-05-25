# Groundwork Solutions: GHL custom HTML/CSS build standards

This is the working reference for building groundworknorcal.com inside the GoHighLevel **standard** Funnels & Websites builder (not Sites 2.0 / Labs). It covers what to paste between the native GHL menu and the native GHL contact form, what to put in tracking code, and what to skip. Read sections 1, 2, 12, and 10 first; the rest is lookup.

Conventions used:
- **DO** = recommended pattern
- **DON'T** = known problem in GHL
- All custom classes are prefixed `gws-` (Groundwork Solutions). Never use bare `.btn`, `.card`, `.row`, `.col`, `.container`, `.hero` because GHL already defines them.

---

## 1. GHL custom HTML/CSS constraints and rules

### 1.1 Where GHL lets you inject code (five places)

| # | Location | UI path | Use it for |
|---|---|---|---|
| 1 | **Custom HTML/Code element** (in canvas) | Page editor → + Add Element → Custom Code/HTML | Per-section markup, page-specific blocks |
| 2 | **Page Custom CSS** | Page → Settings (gear) → Custom CSS | CSS for one page; wrap in `<style>...</style>` |
| 3 | **Page Custom JS** | Page → Settings → Custom JS | Per-page scripts (you won't use this) |
| 4 | **Site-wide Header Tracking Code** | Sites → Websites → (your site) → Settings → Tracking Code → Head | Google Fonts `<link>`, `<link rel=preload>`, GA4/GTM, JSON-LD |
| 5 | **Site-wide Body/Footer Tracking Code** | Same panel → Body | Anything that should run after DOM ready |

Plus the dedicated SEO panel: page editor → top-bar SEO icon → **SEO Meta Data**. This panel has native fields for Title, Description, Custom Meta Tags, Social Media Preview (writes Open Graph), Canonical Links, and a **Schema Markup Generator** (added 2025, JSON view supported).

### 1.2 What GHL strips, breaks, or sanitizes

**`<script>` inside `<div>` silently fails.** Per official help article 48001159729: cut the script out of the wrapping div and place it as a sibling. This is the #1 cause of "my code isn't running."

**HTML security validator** rejects code containing `expression(`, `javascript:` URLs, and other classic XSS patterns. Failures appear as a "validation error" toast on save.

**`<form action=...>` will render but is not wired to GHL's CRM.** To capture leads you must use the native Form element. You're already doing this.

**Allowed without issue:** `<style>`, `<link>`, `<iframe>`, `<picture>`, `<source>`, `<svg>`, `<noscript>`, all standard semantic HTML5 tags.

**Head tracking code is injected client-side after hydration**, not server-rendered. Raw "View Source" will not show it. Google and Bing run JS so they see it; some social-card scrapers may not. This is the single biggest "why isn't my schema showing" cause: always validate with Google's Rich Results Test (which runs JS), not raw-HTML schema validators.

### 1.3 GHL's native classes that conflict with yours

GHL's builder generates classes that will collide if you use the same names: `c-section`, `c-row`, `c-column`, `c-wrapper`, `c-html`, `c-custom-code`. Auto-IDs like `#section-XXXXXXX`, `#row-XXXXXXX` are unique per element and safe to target with custom CSS. Form embed iframes live inside `iframe[src*="leadconnectorhq"]` and `.lc-form` containers.

GHL's built-in stylesheets have **high specificity** and inject inline `style` attributes from the right-panel controls. External CSS without higher specificity will lose. Two paths to win:

1. **Specificity ladder**: scope every selector under your wrapper class, e.g. `.gws-scope .gws-card.gws-card--featured`.
2. **!important as last resort** when fighting inline styles GHL injected on an element you can't reach.

### 1.4 Scoping strategy for the user's exact use case

Every Custom HTML block on every page wraps its content in `<div class="gws-scope">`. Every CSS rule is prefixed `.gws-scope`. This guarantees:
- No bleed into the GHL native menu above
- No bleed into the GHL native form below
- Predictable cascade with cascade layers (section 9)

**DON'T** style bare tags (`p`, `h2`, `a`, `button`) globally. They will hit the menu and form.

**DON'T** style `.c-section`, `.c-row`, `.c-column` globally. Target the auto-ID instead.

### 1.5 CSS variables across multiple custom HTML blocks on the same page

They share scope. All Custom HTML blocks render into the same DOM. A `:root` variable defined in any `<style>` block is available to every other block on that page. Best practice: define design tokens **once** in **Page Custom CSS** (Settings → Custom CSS) or for the whole site in Header Tracking Code, then reference `var(--gws-...)` everywhere else.

### 1.6 Fonts inside GHL

Most reliable order of preference:

1. **Google Fonts via `<link>` in Header Tracking Code** (fastest, most predictable):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

2. **`@import` inside a `<style>` block** works but blocks render slightly. Always include `&display=swap`.

3. **Self-hosted woff2** via `@font-face` in Page Custom CSS. Host on GHL Media Library or external CDN with absolute HTTPS URL.

4. **Native Custom Font upload** under sub-account settings (Agency Labs flag may be required).

Always include `display=swap` to avoid FOIT (flash of invisible text), which kills LCP.

### 1.7 Known GHL bugs and quirks (May 2026)

The mobile editor stores **independent values** for padding, margin, and alignment. Editing those in mobile view does not propagate to or from desktop. Only font-size has phase-1 inheritance. **Tablet renders the desktop view**, no separate tablet edit. Build desktop first, then visit mobile view to fix breakages, OR duplicate sections and toggle visibility (Element Settings → Advanced → Visibility → desktop/mobile icons) to make mobile-only and desktop-only twins.

`position: sticky` works only on the published URL, not in the builder canvas. Custom code injected via tracking is not visible in the builder canvas, only on the live page. Cloudflare/CDN cache holds new publishes for 5 to 15 minutes; test in incognito and hard-refresh.

**Cloning a page does not copy its tracking code.** After a clone, paste tracking code back manually.

Saving is not publishing. Click **Save and Publish** explicitly.

Parallax and fixed background images do not display on mobile (official article 48000980314). Use a regular `<img>` for hero LCP, not a CSS background.

Stock GHL pages typically score **20 to 45 on mobile PageSpeed** out of the box because of hydration JS, default fonts, and tracking. Realistic ceiling with the optimizations in this doc is 70 to 85 mobile, 90 to 99 desktop. Don't promise 95 mobile.

---

## 2. Speed and performance

### 2.1 Core Web Vitals 2026 targets

Google measures the 75th percentile of real-user data per URL.

| Metric | Good | Needs work | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5 s | 2.6 to 4.0 s | > 4.0 s |
| INP (Interaction to Next Paint, replaced FID March 2024) | ≤ 200 ms | 201 to 500 ms | > 500 ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.11 to 0.25 | > 0.25 |

INP is essentially free for an HTML/CSS-only build because nothing waits on a JS handler. Avoid heavy embeds (chat widgets, third-party trackers) and you'll pass INP without effort.

### 2.2 Critical CSS strategy without a build pipeline

Inline critical above-the-fold CSS in `<style>` inside the Custom HTML block (or in Page Custom CSS, which renders inline at the top of `<body>`). Target **under 14 KB uncompressed** for the inline portion so it ships in the first TCP packet.

For below-the-fold styles, you have two realistic options inside GHL:
1. Keep all CSS in Page Custom CSS (one block, page-scoped). Acceptable up to ~50 KB minified.
2. Split rare/large styles into the next Custom HTML block deeper in the page so they parse later.

Tools to generate critical CSS without a build step: criticalcss.com, corewebvitals.io/tools/critical-css-generator, sitelocity. Run after design freeze, paste into Page Custom CSS.

### 2.3 Render-blocking minimization (no JS)

- Inline critical CSS.
- Use one font family at most, with `font-display: swap`, or use a system stack and skip web fonts entirely.
- Avoid `@import` inside CSS (chains loading). Use `<link>` in Header Tracking Code.
- Limit `preconnect` to two to four origins (Google Fonts, ImageKit, GTM if present). More than that contends bandwidth.

### 2.4 Avoiding CLS (the easy win)

Every `<img>` gets explicit `width` and `height` attributes (browsers infer aspect-ratio from these). Every `<picture>` source includes intrinsic dimensions. Hero sections reserve space with `aspect-ratio: 16/9; object-fit: cover;` on the image. Web fonts use `swap`, not `block`.

### 2.5 Above-the-fold optimization checklist

The hero `<img>` is the LCP element. It must have `fetchpriority="high"`, `decoding="async"`, must NOT have `loading="lazy"`, and ideally has a `<link rel="preload">` companion in Header Tracking Code. Fonts used in the H1 are preloaded. No carousel, no video background. One static image, one CTA.

### 2.6 How to test

PageSpeed Insights (pagespeed.web.dev) is the primary tool because it combines Lighthouse lab data with real-user CrUX field data. Use Chrome DevTools Lighthouse for diagnostics. WebPageTest for waterfall analysis. Search Console → Core Web Vitals report for actual ranking-relevant CrUX numbers. Web Vitals Chrome Extension for live metrics during dev.

Lab and field data can differ by an order of magnitude. **Optimize for field, diagnose with lab.**

---

## 3. Image optimization for real photos

### 3.1 Format choice in 2026

| Format | Browser support | Vs JPEG |
|---|---|---|
| JPEG | 100% | baseline |
| WebP | ~97% | 25 to 34% smaller |
| AVIF | ~93 to 95% | 30 to 50% smaller than JPEG, 20 to 30% smaller than WebP |

Use AVIF for hero and gallery photos where bytes matter. WebP as middle fallback. JPEG as final fallback. SVG for the logo. PNG only for screenshots needing pixel-perfect text or transparency on legacy browsers.

### 3.2 Dimension and file-size targets

| Use | Dimensions | Target (AVIF/WebP) |
|---|---|---|
| Full-bleed desktop hero | 1920×1080 (up to 2400×1350) | 150 to 250 KB |
| Mobile hero (vertical crop) | 800×1200 | 80 to 120 KB |
| Section/feature image | 1200×800 | 60 to 120 KB |
| Service-card thumbnail | 600×400 | 25 to 60 KB |
| Before/after gallery photo | 1200×800 | 60 to 100 KB |
| Team headshot | 600×600 | 30 to 60 KB |
| Logo | SVG, or 400×100 PNG | < 20 KB |
| Background full-width | 1920×1080 | < 200 KB |
| Blog featured | 1200×630 | < 100 KB |

Total page weight under 1.5 MB. Combined above-the-fold images under 300 KB.

### 3.3 Compression workflow

For one-off heroes use **Squoosh** (squoosh.app, browser-local, best quality). For batches use **TinyPNG** (no AVIF), **ShortPixel** (highest compression, AVIF support), or **ImageOptim** (Mac, lossless). Recommended quality settings:
- JPEG: 75 to 82
- WebP: 75 to 80
- AVIF: 50 to 63 (its scale is non-linear; 50 to 60 visually equals JPEG ~80)

Always resize to display size before encoding. Don't upload 4000 px when you display 1200 px.

### 3.4 Responsive images: the canonical pattern

```html
<picture>
  <source media="(max-width: 600px)" type="image/avif"
          srcset="hero-mobile-800.avif">
  <source media="(max-width: 600px)" type="image/webp"
          srcset="hero-mobile-800.webp">
  <source type="image/avif"
          srcset="hero-1200.avif 1200w, hero-1920.avif 1920w"
          sizes="100vw">
  <source type="image/webp"
          srcset="hero-1200.webp 1200w, hero-1920.webp 1920w"
          sizes="100vw">
  <img src="hero-1200.jpg"
       alt="Sierra Foothills Excavation grading a residential pad in Auburn, CA"
       width="1920" height="1080"
       fetchpriority="high" decoding="async">
</picture>
```

For non-hero content images:

```html
<img
  src="excavation-1200.jpg"
  srcset="excavation-480.jpg 480w,
          excavation-800.jpg 800w,
          excavation-1200.jpg 1200w,
          excavation-1920.jpg 1920w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1024px) 80vw,
         1200px"
  alt="Trenching for water service line, Placer County"
  width="1200" height="800"
  loading="lazy" decoding="async">
```

### 3.5 Loading attribute decisions

- `loading="eager"` (default): hero/LCP image and anything above the fold.
- `loading="lazy"`: everything below the fold.
- `fetchpriority="high"`: the **single** LCP image only. More than one cancels the benefit.
- `decoding="async"`: every image. Frees the main thread.

**Critical mistake:** `loading="lazy"` on the LCP image. Guarantees an LCP regression.

### 3.6 Image CDN choice

For groundworknorcal.com the recommendation is **ImageKit free tier** (20 GB/mo, AVIF auto-format, URL transforms) for hero and gallery, GHL native upload for one-off blog content. URL-based delivery means no SDK, just paste the CDN URL into a GHL image element or your custom HTML.

ImageKit URL pattern: `https://ik.imagekit.io/yourid/hero.jpg?tr=w-1920,h-1080,q-80,f-auto`

If you stage from Unsplash during build: every Unsplash URL accepts query params. Recommended hero pattern:
```
https://images.unsplash.com/photo-XXXXX?ixid=KEEP_THIS&auto=format,compress&fit=crop&w=1920&h=1080&q=80
```
Always retain the `ixid=` parameter (Unsplash API requirement). Replace stock images with real job-site photos before launch.

### 3.7 Hero image preload (in Header Tracking Code)

```html
<link rel="preload" as="image"
      imagesrcset="https://ik.imagekit.io/.../hero-800.avif 800w,
                   https://ik.imagekit.io/.../hero-1200.avif 1200w,
                   https://ik.imagekit.io/.../hero-1920.avif 1920w"
      imagesizes="100vw"
      type="image/avif"
      fetchpriority="high">
```

Caveat: GHL injects head tracking client-side, not server-side. Preload still helps once parsed, but the gain is smaller than on a server-rendered site.

### 3.8 Alt text rules

- Describe content/function. Skip "image of," "picture of."
- 8 to 15 words. Longer descriptions go in `<figcaption>` or `aria-describedby`.
- Functional images (inside a link/button): describe the destination, not the picture.
- Decorative images: `alt=""`. Don't add `role="presentation"` on top; `alt=""` alone is correct.
- Filename matters too: `septic-system-excavation-auburn-ca.jpg`, never `IMG_1234.jpg`.

### 3.9 Excavation-industry photo guidance

Order of preference: phone-shot job photos by the crew (use **CompanyCam** for paired before/after), one half-day local photographer session, drone footage, paid stock as last resort. Avoid generic stock that other contractors are also using; bounce rate drops measurably when authentic photos replace stock. The image types that convert best on contractor sites (in order): before/after side-by-sides with location captions, action job-site shots with branded PPE, equipment lineups (CAT 308, skid steer, roller), team photos with the owner's portrait, finished site photos, branded trucks.

---

## 4. Responsive design inside GHL

### 4.1 Mobile-first media queries

Write base styles for the smallest viewport, then add `min-width` queries upward. Recommended breakpoints: 320, 480, 768, 1024, 1280, 1920. Primary cuts at 768, 1024, 1280; the rest are fine-tuning.

```css
/* base = mobile */
.gws-hero { padding: 1rem; }
@media (min-width: 768px) { .gws-hero { padding: 3rem; } }
@media (min-width: 1280px) { .gws-hero { padding: 5rem; } }
```

### 4.2 Working with GHL's native mobile editor

Because GHL stores independent mobile values for padding, margin, and alignment, the safest pattern with custom HTML is to **let your CSS media queries do the responsive work** and leave GHL's mobile editor untouched on sections that contain Custom HTML. Set the section's padding to zero on both desktop and mobile in the right panel, then control everything in your `<style>` block.

Where you cannot avoid a layout difference (e.g., a section that should be a single column on mobile, three columns on desktop), the duplicate-and-toggle pattern is more reliable than the mobile editor: build the desktop variant, duplicate it as a mobile-only variant, set Visibility on each via Element Settings → Advanced → Visibility.

### 4.3 Touch target sizes

WCAG 2.2 AA (criterion 2.5.8) requires 24×24 CSS pixels minimum, with adequate spacing. Apple HIG says 44 pt. Material says 48 dp. **Practical rule for contractor CTAs: 48×48 px minimum.** This satisfies all standards and lifts mobile conversion ~15%.

```css
.gws-btn, .gws-cta a, .gws-scope button {
  min-width: 48px; min-height: 48px; padding: 14px 24px;
}
```

### 4.4 Fluid typography with clamp()

Pattern: `clamp(MIN, PREFERRED, MAX)`. PREFERRED is `(slope)vw + (intercept)rem`. Use rem (not px) so user font preferences are honored.

| Use | clamp() |
|---|---|
| Body | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` |
| H3 | `clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)` |
| H2 | `clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem)` |
| H1 (hero) | `clamp(2.25rem, 1.5rem + 3.75vw, 4rem)` |
| Section padding | `clamp(2rem, 1rem + 5vw, 6rem)` |

Calculator: utopia.fyi.

### 4.5 Container queries vs media queries

Container queries (`@container`) are universally supported in 2026 evergreen browsers. Use them for component-level responsiveness (a service card that becomes two columns when its container exceeds 400 px). Use media queries for page-level layout (sidebar present, top nav collapse). Style queries are partial support; gate with `@supports`.

### 4.6 Common GHL responsive pitfalls

The GHL viewport meta tag is set automatically; do not duplicate it. Avoid CSS background images for hero LCP (preload scanner can't see them, parallax breaks on mobile). Test at 320 px viewport for horizontal-scroll bugs. Text under 16 px on mobile triggers iOS Safari zoom-on-focus. Carousels destroy LCP and INP; use a single static hero.

---

## 5. On-page SEO

### 5.1 Title tags and meta descriptions

Title: 50 to 60 characters / under 580 to 600 pixels. Primary keyword first, brand last after a hyphen separator. Pattern: `Primary Keyword + Location | Value Prop - Brand`. Keep close to the H1 but not identical; Google rewrites titles when title and H1 diverge sharply.

Meta description: 140 to 160 characters, unique per page, primary keyword early, end with a CTA, include a credibility hook ("Licensed CA C-12, 25+ years"). Not a direct ranking factor but drives CTR and is now extracted by AI surfaces.

Set both in GHL: page editor → SEO icon → SEO Meta Data.

### 5.2 Heading hierarchy

One H1 per page. H1 matches user intent and is close to but not identical to the title tag. H2s for major sections, H3s for sub-sections. **Don't skip levels going down** (H2 → H4 is wrong; you may go up freely). AI engines extract content section-by-section using heading structure, so clean hierarchy materially affects citation rate.

### 5.3 URL structure

Lowercase, hyphens (not underscores), short, descriptive, depth ≤ 3 levels. `groundworknorcal.com/services/grading-excavation/`. Avoid stop words, dates, query strings, IDs.

### 5.4 Internal linking

Hub-and-spoke model: a pillar page per service, supporting pages linked from it (city pages, FAQs, project galleries). Important pages ≤ 3 clicks from home. Vary anchor text naturally: exact match, partial match, branded, generic. Cross-link service pages to the relevant city/service-area pages.

### 5.5 Canonical, robots, sitemap

**Canonical**: self-referencing on every indexable page. Set in GHL via SEO Meta Data → Canonical Links (added Q1 2024). Don't duplicate in Header Tracking Code.

**Robots meta**: `index, follow` for normal pages; `noindex, follow` on thank-you and internal utility pages. Sitewide best practice: `<meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1">` to maximize SERP and AI Overview eligibility. Set via SEO Meta Data → Custom Meta Tags.

**XML sitemap**: GHL auto-generates at `/sitemap.xml`. Verify it lists only canonical, indexable URLs. Submit in Search Console and Bing Webmaster.

**robots.txt**: see section 6 (full template). GHL serves a default; you'll need to override at the domain level if you want the AI-bot allowlist.

### 5.6 Open Graph and Twitter Card

GHL's SEO Meta Data → Social Media Preview writes `og:title`, `og:description`, `og:image` natively. Add the rest via Custom Meta Tags or Header Tracking Code.

```html
<meta property="og:title" content="Excavation & Site Prep in Auburn, CA | Groundwork Solutions">
<meta property="og:description" content="Licensed Northern California excavation contractor. Grading, trenching, septic, demolition. CSLB #123456.">
<meta property="og:url" content="https://groundworknorcal.com/">
<meta property="og:image" content="https://groundworknorcal.com/og-image.jpg">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Groundwork Solutions">
<meta property="og:locale" content="en_US">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Excavation & Site Prep in Auburn, CA | Groundwork Solutions">
<meta name="twitter:description" content="Licensed Northern California excavation contractor. Grading, trenching, septic, demolition.">
<meta name="twitter:image" content="https://groundworknorcal.com/og-image.jpg">
```

OG image: 1200×630, under 8 MB, JPG/PNG/WebP.

### 5.7 Image SEO

Filenames: `septic-excavation-placer-county-ca.jpg`. Alt text: 8 to 15 words, descriptive, keyword used naturally. Captions matter for AI extraction. Surrounding text matters too.

### 5.8 Schema markup for local contractors (JSON-LD)

JSON-LD is Google's strongly preferred format in 2026. Place via GHL's SEO → Schema Markup Generator (JSON view) per page, OR fall back to Header Tracking Code as `<script type="application/ld+json">`.

Best types for an excavation contractor: **GeneralContractor** (subtype of `HomeAndConstructionBusiness` → `LocalBusiness`), **Organization**, **WebSite**, **Service** (one per service page), **BreadcrumbList** (every page beyond home), **FAQPage** (real FAQ content only, see 6.6), **AggregateRating + Review** (first-party only), **Person** (owner bio for E-E-A-T).

Note: Google retired seven schema types in January 2026 (Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing, Practice Problems). HowTo rich results were deprecated September 2023. Don't bother with HowTo or Speakable for a contractor.

Full template in section 12.6.

### 5.9 Service area business handling

You don't need a customer-facing storefront. Use `LocalBusiness` / `GeneralContractor` (do not downgrade to `Organization`). Use a real verifiable address (home or office is fine), and on Google Business Profile hide the address and define service areas. Schema-side, use `areaServed` (array of City/AdministrativeArea) plus a `GeoCircle` `serviceArea` with `geoRadius` in meters.

### 5.10 Local SEO citations

Top NAP citation sources for a NorCal excavation contractor in 2026:
1. Google Business Profile, Apple Business Connect, Bing Places, Yelp
2. BBB, Facebook, Angi, HomeAdvisor, Houzz, Thumbtack
3. Foursquare, Data Axle/Localeze (data aggregators)
4. CSLB public license lookup (cslb.ca.gov) - link to your record from the site
5. AGC of California, ConstructionConnect, BuildZoom, Porch
6. Local: Auburn/Roseville/Sacramento Chambers, Sacramento Bee directory

NAP must match exactly across all of them. Use one canonical primary local number on the website; reserve tracking numbers for paid campaigns.

### 5.11 E-E-A-T signals for a local contractor

Trust is weighted heaviest for local services and AI engines use the same signals when deciding whom to cite.

**Display in footer on every page**: CSLB license number and class ("CA Lic. #123456 - Class A General Engineering" or "C-12 Earthwork & Paving"), DIR registration number, bonding info ($25,000 CSLB bond), workers' comp compliance statement (CA SB 216 requires workers' comp on file with CSLB by Jan 1, 2026 even with no employees - display this proactively), insurance carrier name with "certificate on request" language.

**Throughout the site**: founded date, owner bio, equipment list with specific make/model, OSHA-30 + SWPPP/QSP certifications, BBB accreditation, manufacturer affiliations.

**Reviews**: pull live Google reviews via approved widgets, mark up first-party reviews on the page with `Review` schema. Never mark up third-party reviews you don't display.

### 5.12 Service area landing pages

One page per priority city: `/grading-excavation-auburn-ca/`, `/site-prep-roseville-ca/`. Each must have unique content: local soil conditions, county permitting (Placer County DPW, Nevada County Building Dept.), local landmarks, neighborhoods served, local testimonials. Heading pattern:
- H1: `[Service] in [City], CA | [Brand]`
- H2s: `Our [Service] Process in [City]`, `Why [City] Property Owners Choose Us`, `[County] Permitting & Compliance`, `Recent [City] Projects`, `Frequently Asked Questions`

Avoid thin near-duplicate pages. Google demotes them aggressively.

---

## 6. Answer Engine Optimization for 2026

### 6.1 What AEO is

Optimization so AI search engines (ChatGPT, Perplexity, Google AI Overviews/AI Mode, Claude, Gemini, Copilot) cite or quote your content when generating answers. Sometimes called GEO (Generative Engine Optimization); the terms are interchangeable in 2026. Sixty percent of US/EU searches now end without a click. Gartner forecasts 25% of organic search traffic shifts to AI by end of 2026.

### 6.2 Content structure AI engines prefer

- Direct-answer paragraph at the top of each page (40 to 60 words)
- Definition box pattern: bold the term, define in 1 to 2 sentences immediately
- Q&A throughout, with questions phrased as users actually say them, used as H2/H3
- Short paragraphs (2 to 3 sentences max)
- Bullet/numbered lists for processes and comparisons (AI extracts these directly)
- Tables for comparisons, pricing factors, spec sheets
- Topic sentence at the start of each paragraph
- Definitive statements with concrete numbers and citations: "Septic system excavation in Placer County typically takes 2 to 4 days and requires a Tier 1 permit per Placer County EHD §8.45."
- TL;DR / Key Takeaways box at the top of long content

### 6.3 AI bot ecosystem (May 2026)

| Company | Bots | Purpose |
|---|---|---|
| OpenAI | GPTBot (training), OAI-SearchBot (index), ChatGPT-User (live fetch) | ChatGPT |
| Anthropic | ClaudeBot (training), Claude-SearchBot (index), Claude-User (live fetch) | Claude |
| Perplexity | PerplexityBot, Perplexity-User | Perplexity |
| Google | Googlebot, Google-Extended (Gemini opt-out token), GoogleOther | Search + Gemini |
| Microsoft | Bingbot | Bing + Copilot |
| Apple | Applebot, Applebot-Extended | Search + Apple Intelligence |
| Meta | meta-externalagent | Meta AI |
| Common Crawl | CCBot | Open-source models |
| Amazon | Amazonbot | Alexa/Q |
| DuckDuckGo | DuckAssistBot | DuckAssist |

**Recommendation for groundworknorcal.com: allow everything.** Local services brand has nothing to protect from training and everything to gain from being baked into model knowledge over time. AI citations now drive ~35% trust lift per industry data. Robots.txt template in section 12.10.

### 6.4 Schema specifically helpful for AEO

| Type | 2026 status | AEO value | Use? |
|---|---|---|---|
| LocalBusiness/GeneralContractor | Fully supported | High - anchors entity | Yes |
| Organization | Fully supported | High - sameAs builds knowledge graph | Yes |
| Service | Fully supported | High | Yes, per service |
| FAQPage | Rich-result restricted to gov/health since 2023; markup still valid | **Very high** for AI citation (~22% lift, 3.2x AI Overview eligibility) | Yes, on real FAQ content only |
| HowTo | Rich results deprecated Sept 2023 | Minimal | Skip |
| Speakable | 7 years in beta, news/US-English/Google-Home only | Minor | Skip |
| Article | Fully supported | Medium | On blog posts |
| BreadcrumbList | Fully supported | Medium | Yes |
| Review/AggregateRating | First-party only after March 2026 update | High for trust | Yes |
| WebSite/WebPage | Fully supported | Low to medium | Yes (WebSite at minimum) |
| Person | Fully supported | Medium for E-E-A-T | Owner bio |

March 2026 Google core update narrowed rich-result eligibility for FAQ/Review/HowTo on non-primary content. Don't sprinkle FAQ schema on non-FAQ pages.

### 6.5 Brand mention strategy for AI engines

AI engines weight third-party signals heavily. ~21% of Google AI Overview citations come from Reddit; some studies report ~48% of ChatGPT citations come from Wikipedia. Build a Wikipedia-ready entity foundation: consistent business name, founder bio, sameAs links across all platforms. Earn mentions in "best contractors in Sacramento" listicles via digital PR. Maintain identical factual claims (year founded, license #, services) across web, GBP, BBB, schema. AI engines look for **consensus across sources** before citing.

### 6.6 llms.txt - what it is and whether to bother

A plain-text Markdown file at `/llms.txt` that points LLMs to your most important content. Proposed by Jeremy Howard (Answer.AI) in September 2024. Hosted spec at llmstxt.org. Adoption status May 2026:
- Supporters: Anthropic, Cursor, Mintlify, Vercel, Stripe, Cloudflare, Astro
- Skeptics: Google has explicitly said Search does not use llms.txt (Mueller, July 2025 and January 2026); OpenAI and Meta haven't endorsed
- Adoption: ~10% of surveyed domains; ALLMO.ai's analysis of 94k+ AI-cited URLs found no measurable AI-citation lift from having one

**Verdict for a 10-page contractor site**: low priority but a 30-minute task with no downside. Ship a minimal version. Template in section 12.7.

### 6.7 Tracking AEO performance

Manual prompt testing in ChatGPT, Perplexity, and Gemini once a month is genuinely enough for a contractor budget. Track 20 to 30 prompts (e.g., "best excavation contractor in Auburn CA," "site prep contractor Placer County," "septic excavation near Grass Valley"); log whether you appear, are cited, or competitors appear. Step up to Otterly.AI ($49 to 99/mo) only if growth becomes a priority. Higher tiers: AthenaHQ (~$295/mo), Profound ($499+/mo), Scrunch AI ($300 to 500/mo).

---

## 7. Accessibility (WCAG 2.2 AA minimum)

### 7.1 Standard status in 2026

WCAG 2.2 (Oct 2023) is the current standard and is now ISO/IEC 40500:2025. WCAG 3.0 is still a Working Draft (March 2026), expected as a Recommendation 2028 to 2029. **Target WCAG 2.2 AA.** ADA Title II compliance deadline (referencing 2.1 AA) was April 24, 2026 for large entities; small businesses face less direct enforcement but the same legal exposure.

### 7.2 New AA criteria in WCAG 2.2 (vs 2.1)

Six AA-level new criteria apply:
- **2.4.11 Focus Not Obscured (Min)** - sticky headers/cookie banners must not fully hide focus
- **2.5.7 Dragging Movements** - any drag must have a single-pointer alternative
- **2.5.8 Target Size (Min)** - 24×24 CSS px minimum, or sufficient spacing
- **3.2.6 Consistent Help** - if help links appear on multiple pages, same relative order
- **3.3.7 Redundant Entry** - don't make users enter the same info twice in one process
- **3.3.8 Accessible Authentication (Min)** - no cognitive function tests for login

### 7.3 Color contrast and the clay accent #B85838

Calculated against the WCAG 2 relative-luminance formula:

| Pair | Ratio | AA normal | AA large | UI/non-text | AAA |
|---|---|---|---|---|---|
| #B85838 on #FFFFFF | 4.68:1 | Pass (tight) | Pass | Pass | Fail |
| #B85838 on #000000 | 4.49:1 | **Fail** | Pass | Pass | Fail |

The on-white pass is a hair above 4.5:1. **DO NOT use #B85838 as small body text** - it just barely passes AA and fails AAA. Use it for headings (large text), button fills, icons, decorative borders.

For small text on white, use a darkened variant. Token set:

```css
--gws-clay-500: #B85838;   /* baseline brand, large text only on white */
--gws-clay-600: #A04A2D;   /* ~6.1:1 on white, comfortable AA */
--gws-clay-700: #8B3E22;   /* ~7.4:1 on white, AAA body text */
--gws-clay-800: #6E2F1A;   /* ~10:1 on white, AAA headings */
--gws-clay-300: #E08868;   /* lighter, for dark backgrounds */
```

### 7.4 Semantic HTML5

Use `<header>`, `<nav>`, `<main>` (one per page), `<section>` (with a heading), `<article>` (self-contained, syndicatable), `<footer>`, `<aside>`. Article vs section: if it could stand alone (RSS, repost, separate URL) it's an article; if it's just a chapter of the surrounding doc, it's a section.

Don't double up landmark roles - HTML5 elements already imply them.

### 7.5 ARIA, sparingly

First Rule of ARIA: don't use ARIA. Native HTML first. WebAIM Million data shows pages with ARIA average 41% more detected errors than pages without.

Common patterns you'll actually need:
- `aria-label="Close"` for icon buttons with no visible text
- `aria-current="page"` on the current nav link
- `aria-expanded="false"` on accordion triggers (toggled true/false; pair with `aria-controls`)

### 7.6 Focus and keyboard

```css
.gws-scope :where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 3px solid var(--gws-color-focus, #1565D8);
  outline-offset: 2px;
  border-radius: var(--gws-radius-sm, 4px);
  box-shadow:
    0 0 0 5px var(--gws-color-surface, #FFFFFF),
    0 0 0 8px var(--gws-color-focus, #1565D8);
}
.gws-scope :focus:not(:focus-visible) { outline: none; }
```

Skip link at the top of `<main>`:

```html
<a class="gws-skip-link" href="#main">Skip to main content</a>
<main id="main" tabindex="-1">...</main>
```

```css
.gws-skip-link {
  position: absolute; top: -40px; left: 0;
  padding: .75rem 1rem; background: #000; color: #fff;
  z-index: 9999; text-decoration: underline;
}
.gws-skip-link:focus { top: 0; }
```

Avoid positive `tabindex` values. Use only `tabindex="0"` (make focusable) and `tabindex="-1"` (programmatically focusable).

### 7.7 Visually-hidden utility

```css
.gws-visually-hidden:not(:focus):not(:active) {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px; width: 1px; margin: -1px;
  overflow: hidden; padding: 0;
  position: absolute; white-space: nowrap; border: 0;
}
```

### 7.8 Heading hierarchy

One H1 per page. No skipped levels going down. Visual styling is independent of document structure. Headings form the screen-reader TOC.

### 7.9 Form context

The contact form is GHL native, so most accessibility responsibility is GHL's. Your job: provide a clear heading above it, descriptive text explaining what happens when they submit, and a visible error region if you've added any custom labels. Don't apply CSS that sets `pointer-events: none` on `.form-builder`, `.lc-form`, or any input wrapper.

---

## 8. GHL build architecture

### 8.1 Funnels vs Websites vs Membership

For groundworknorcal.com use a single **Website** (Sites → Websites → New Website). Reasons: native nav menu with mega-menu, subpage paths (`/services/grading`), single Settings panel for tracking + custom CSS + favicon, domain-level 404, simpler 301 management.

Use a **Funnel** only for paid-traffic landing pages where you want split testing. Connect via subdomain or path.

Skip Membership for this build.

### 8.2 Recommended page structure

```
Website (root)
├── Home (/)
├── About (/about)
├── Services (/services)
│   ├── Grading & Pad Prep (/services/grading)
│   ├── Trenching (/services/trenching)
│   ├── Septic (/services/septic)
│   ├── Demolition (/services/demolition)
│   ├── Driveways (/services/driveways)
│   └── Erosion Control (/services/erosion-control)
├── Industries (/industries)
│   ├── Residential (/industries/residential)
│   ├── Commercial (/industries/commercial)
│   └── Public Works (/industries/public-works)
├── Service Areas (/service-areas)
│   └── /service-areas/[city]
├── Projects (/projects)
├── Contact (/contact)
├── Privacy (/privacy)
├── Terms (/terms)
└── 404 (set as default in domain settings)
```

### 8.3 Reusable section templates

GHL has three save scopes (help article 155000005513):
- **Universal Section**: syncs across the whole sub-account. Use for header, footer, primary CTA band.
- **Global Section**: syncs within one funnel/website. Use for site-specific nav.
- **Template Section**: independent copies, edits do NOT propagate. Use for service-page layouts you'll customize.

**Once saved, the type cannot be changed.** Saved sections have no version history. Edit destructively at your own risk.

### 8.4 Header and footer

Use GHL's native Navigation Menu element inside a Universal Section for the header (supports mega-menu, mobile hamburger, proper `<a>` links). Don't replace nav with custom HTML; you lose the visual editor and break the GHL update path.

Footer: Universal Section with a Custom HTML block. Includes NAP, CSLB license #, DIR #, social `sameAs` links, secondary nav, copyright.

### 8.5 Site-wide vs page-specific CSS

| Scope | Where | Notes |
|---|---|---|
| Site-wide | Settings → Tracking Code → Head, paste `<style>...</style>` | Every page |
| Page-specific | Page Settings → Custom CSS | One page; loads after site-wide |
| Element-specific | Inline in a Custom Code block | Scope with a unique class |

Define design tokens once in site-wide head. Define page-specific overrides in page Custom CSS.

### 8.6 301 redirects (help article 48001202713)

Sub-account Settings → URL Redirects → Add a Redirect. Source path → destination path, 301 Permanent, REGEX supported. Limited to domains attached to the sub-account. For www → non-www across the whole host, use Cloudflare Page Rule "Forwarding URL → 301" at the DNS layer; GHL doesn't have a one-click toggle.

### 8.7 404 page (help article 48001239647)

Build the 404 like any normal page in the website. Then Settings → Domains → Manage beside the domain → 3-dot menu → Edit → Set default 404/Error Page dropdown → pick the page → Save. Per-domain (multi-domain accounts can have different 404s).

### 8.8 Version control without git

GHL has no staging or git. Workarounds:
- Clone the website (3 dots → Clone) before any major change. Naming: `Site - Live`, `Site - Backup 2026-05-02`. (Help article 48001076117.)
- Funnel/Website Share Link generates a portable URL that imports into another sub-account. Forms, surveys, and lead-capture configs are NOT carried.
- Save all custom CSS/JS in an **external file** (Notion, GitHub, plain .txt). The GHL field has no version history.
- Page-level Use Existing/Import is available when adding new steps/pages.
- Weekly cycle: clone the website, export contacts CSV, store in cloud storage with date stamp.

### 8.9 What lives where, by code type

| Code type | Where to put it |
|---|---|
| Open Graph basics | SEO Meta Data → Social Media Preview |
| Custom Twitter Card / og:locale / og:type | SEO → Custom Meta Tags |
| JSON-LD schema | SEO → Schema Markup Generator (JSON view), preferred; or Header Tracking Code |
| Canonical | SEO Meta Data → Canonical Links field |
| robots meta per page | SEO → Custom Meta Tags |
| Site-wide CSS variables and reset | Header Tracking Code as `<style>...</style>` |
| Page-specific CSS | Page Settings → Custom CSS |
| Section markup | Custom HTML/Code element in canvas, wrapped in `.gws-scope` |
| `<link rel=preload>` for hero/font | Header Tracking Code |
| Google Fonts `<link>` | Header Tracking Code |
| GA4 / GTM / Meta Pixel | Header Tracking Code |
| Google Search Console verification | Custom Meta Tag (preferred) or Header Tracking |
| llms.txt | Hosted at root: `groundworknorcal.com/llms.txt` (you may need a redirect at the DNS/hosting layer; GHL doesn't natively serve arbitrary files) |
| robots.txt overrides | If GHL's default isn't sufficient, host via Cloudflare Workers or move robots.txt management upstream |

---

## 9. CSS methodology and code standards

### 9.1 Cascade Layers (the secret weapon for GHL)

`@layer` is universally supported in 2026. Layers are evaluated **before** specificity, so a rule in a higher-priority layer wins regardless of selector specificity in a lower one. This eliminates most reasons to reach for `!important`.

```css
@layer reset, ghl-defaults, tokens, base, components, utilities;
```

Anything in `utilities` beats `components`, regardless of how specific the selector. Use this to override GHL defaults cleanly without `!important`.

### 9.2 Class naming: `gws-` prefix + BEM

Use `gws-` prefix on every class. Use BEM-style modifier syntax for variants:
- Block: `gws-card`
- Element: `gws-card__title`
- Modifier: `gws-card--featured`

Avoid single-word generic names (`btn`, `card`, `nav`, `hero`, `wrapper`). Avoid `u-`, `is-`, `has-` prefixes (potential GHL collisions).

### 9.3 CSS custom properties (design tokens)

Define once in site-wide head. Reference everywhere. Universal browser support since 2017; no fallbacks needed.

Full token block in section 12.1.

### 9.4 Modern CSS features safe in 2026

- `@layer` - universal, ~96%+ global
- `:has()` - universal in evergreens
- `:where()` - zero specificity, use in resets
- `:is()` - takes max specificity of arguments
- Container queries (size) - universal
- Subgrid - universal since Chrome 117 (Sept 2023)
- `aspect-ratio` - universal
- `clamp()`, `min()`, `max()` - universal
- `@property` - Baseline Newly Available since July 2024 (Chrome/Edge 85+, Firefox 128+, Safari 16.4+); use with graceful degradation
- `@scope` - good in evergreens; gate with `@supports` for older legacy targets
- `@container style()` - partial; gate with `@supports`

### 9.5 Scoped CSS reset

Don't apply a global reset. The platform has its own base styles, and a global `*` reset will wreck the GHL menu and form. Apply only inside `.gws-scope`. Use `:where()` for zero specificity. Place inside `@layer reset`. Full code in section 12.2.

### 9.6 When `!important` is justified

Three cases:
1. Utility classes that should always win (`.gws-is-hidden { display: none !important; }`)
2. Overriding inline styles GHL injected on elements you can't reach
3. Print stylesheet overrides

Cascade Layers handle most of the rest.

### 9.7 Print stylesheet (still useful for invoices/proposals)

```css
@media print {
  nav, .gws-skip-link, .gws-toolbar, video, iframe, button.gws-share { display: none; }
  *, *::before, *::after {
    background: transparent !important; color: #000 !important;
    box-shadow: none !important; text-shadow: none !important;
  }
  body { font: 11pt/1.4 Georgia, "Times New Roman", serif; }
  a[href]::after { content: " (" attr(href) ")"; font-size: 90%; }
  h2, h3 { break-after: avoid; }
  img, table, figure { break-inside: avoid; }
  @page { margin: 18mm 16mm; }
}
```

### 9.8 Dark mode

Skip for this build. Note `<color-scheme: light dark>` exists if a stakeholder asks later.

### 9.9 Typography settings

Body line-height 1.5 to 1.6 (WCAG 1.4.12 requires support for ≥1.5). Headings 1.1 to 1.25. Body max-width 60ch to 75ch (sweet spot 66ch). Modular scale: Perfect Fourth (1.333) recommended for marketing sites.

Self-hosted fonts: `font-display: swap` for body and headings. Avoid `block` (causes FOIT, hurts LCP). Use `optional` for icon fonts if you ship any.

---

## 10. Pre-publish checklist

Run this for every page before clicking Publish.

### 10.1 Code quality

Wrapped in `<div class="gws-scope">`? All custom classes prefixed `gws-`? No bare `p`, `h2`, `a` selectors? `<script>` tags (if any) sit at the root of the Custom Code element, not inside a div? Nothing uses `position: fixed` for hero (parallax breaks on mobile)? No competing `<form>` tag wraps the GHL form? No CSS sets `pointer-events: none` on `.form-builder` or `.lc-form`?

### 10.2 Speed

Hero `<img>` has `width`, `height`, `fetchpriority="high"`, `decoding="async"`, NO `loading="lazy"`? Hero in `<picture>` with AVIF + WebP + JPEG sources? Hero file under 250 KB AVIF? All other images `loading="lazy" decoding="async"` with width/height? `srcset` + `sizes` on every content image? One Google Fonts `<link>` only, with `display=swap`? `preconnect` to image CDN? Inline critical CSS under 14 KB? Total page weight under 1.5 MB? No video background? No carousel for hero? PageSpeed Insights mobile score ≥ 70 (realistic GHL ceiling), LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1?

### 10.3 SEO

Title 50 to 60 characters, primary keyword first, brand last? Meta description 140 to 160 characters with CTA? One H1 matching user intent? H2/H3 hierarchy without skipped levels? URL slug lowercase with hyphens? Canonical set in SEO Meta Data? OG image 1200×630 set? Internal links to relevant service/city pages? All images have descriptive filenames and 8 to 15 word alt text? JSON-LD validated in Rich Results Test on the live URL?

### 10.4 AEO

Direct-answer paragraph (40 to 60 words) at the top? Q&A structure with question H2/H3s? Short paragraphs (2 to 3 sentences)? Bullet/numbered lists for processes? Tables for comparisons? Definitive statements with concrete numbers? FAQPage schema on real FAQ content (and only there)? robots.txt allows AI bots? Brand name and address consistent with GBP, BBB, schema?

### 10.5 Accessibility

#B85838 used only for large text or non-text? Body text uses `--gws-clay-700` or darker on white? Focus state visible with 3:1 contrast? Skip link at top of `<main>`? Touch targets ≥ 48×48 px? One `<main>`, semantic `<header>/<nav>/<footer>`? Decorative images `alt=""`, content images descriptive alt? No `aria-hidden` on focusable elements? Headings hierarchy clean? Tested with keyboard tab through?

### 10.6 Mobile

Tested at 320 px viewport (no horizontal scroll)? Body text ≥ 16 px on mobile? CTAs ≥ 48×48 px on mobile? Mobile hero uses vertical crop via `<picture media>`? Mobile-first breakpoints at 768/1024/1280? Visited GHL mobile editor and confirmed all sections render correctly?

### 10.7 Cross-browser

Chrome, Safari, Firefox, mobile Safari iOS, Chrome Android - all render correctly? Edge OK?

### 10.8 GHL-specific

Page **Saved AND Published** (not just saved)? Hard-refreshed in incognito to bypass Cloudflare cache? Live URL renders identically to builder preview (sticky/parallax checked on live)? Tracking code present in DOM (right-click → Inspect, search for your tag)? After clone (if applicable), tracking code re-pasted? Schema validates in Rich Results Test using the live URL (not pasted code)?

---

## 11. Common mistakes and antipatterns

**Wrapping a `<script>` inside a `<div>`** in a Custom Code block. GHL silently breaks it. Move scripts to root level or to Header Tracking.

**Styling bare tags** (`p { ... }`, `a { ... }`) in your custom CSS. Bleeds into the GHL menu and form. Always scope under `.gws-scope`.

**Using single-word class names** (`.btn`, `.card`, `.hero`). Will collide with GHL's defaults. Always prefix `gws-`.

**Reaching for `!important` first**. Try cascade layers and increased specificity first. Reserve `!important` for inline-style overrides on GHL-controlled elements.

**`loading="lazy"` on the LCP image**. Guarantees an LCP regression. Hero is always eager + `fetchpriority="high"`.

**CSS background image for the hero**. Preload scanner can't see it; parallax breaks on mobile (official GHL bug). Use `<img>` inside `<picture>`.

**Carousel for the hero**. Destroys LCP and INP. Single static hero with one CTA.

**Multiple H1s on a page** because the visual designer wanted big text twice. Use one H1; style other large text with classes.

**Same content on every service-area page** (city name swapped). Google demotes thin doorway pages. Each city page needs unique local content.

**FAQ schema on non-FAQ pages**. March 2026 update flagged this as ineligible/wasted markup.

**Marking up reviews you don't display on the page**. Violates Google's policy; can trigger manual action.

**Trusting the builder canvas for sticky/parallax**. They only work on the published URL. Always test live.

**Editing mobile values in the GHL right panel without realizing they don't propagate from desktop**. Build desktop, then visit mobile view explicitly. Or duplicate sections with Visibility toggles.

**Cloning a page and forgetting tracking code**. It does not copy. Re-paste after every clone.

**Saving and assuming it's published**. Click Publish.

**Not hard-refreshing in incognito after publish**. Cloudflare caches for 5 to 15 minutes; you'll see stale content and panic.

**Pasting raw HTML form to capture leads**. Won't write to the GHL CRM. Use the native Form element.

**Using `display: none` for the visually-hidden pattern**. Removes from accessibility tree. Use the `clip-path: inset(50%)` pattern.

**Skipping `width` and `height` on images**. Causes CLS. Always set both even when CSS overrides.

**`@import` inside CSS for Google Fonts**. Chains loading. Use `<link>` in Header Tracking Code.

**More than one `fetchpriority="high"` per page**. Cancels the benefit. Only the LCP image gets it.

**Schema that doesn't match the visible page content**. Google flags as misleading; AI engines ignore. Schema must reflect what's on the page.

---

## 12. Examples and templates

### 12.1 Site-wide CSS variables (paste in Header Tracking Code as `<style>`)

```html
<style>
@layer reset, ghl-defaults, tokens, base, components, utilities;

@layer tokens {
  .gws-scope, :root {
    /* Brand colors */
    --gws-clay-300: #E08868;
    --gws-clay-500: #B85838;       /* baseline brand, large text only on white */
    --gws-clay-600: #A04A2D;       /* AA on white */
    --gws-clay-700: #8B3E22;       /* AAA body on white */
    --gws-clay-800: #6E2F1A;       /* AAA headings on white */
    --gws-ink-900: #1A1A1A;
    --gws-ink-700: #404040;
    --gws-ink-500: #6B6B6B;
    --gws-surface: #FFFFFF;
    --gws-surface-alt: #F5F2EE;
    --gws-focus: #1565D8;

    /* Spacing scale */
    --gws-space-1: 0.25rem;
    --gws-space-2: 0.5rem;
    --gws-space-3: 0.75rem;
    --gws-space-4: 1rem;
    --gws-space-6: 1.5rem;
    --gws-space-8: 2.5rem;
    --gws-space-12: 4rem;

    /* Type scale (Perfect Fourth, fluid) */
    --gws-font-100: clamp(0.875rem, 0.83rem + 0.22vw, 1rem);
    --gws-font-200: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
    --gws-font-300: clamp(1.125rem, 1.05rem + 0.4vw, 1.333rem);
    --gws-font-400: clamp(1.333rem, 1.2rem + 0.7vw, 1.777rem);
    --gws-font-500: clamp(1.5rem, 1.3rem + 1vw, 2.369rem);
    --gws-font-600: clamp(2rem, 1.6rem + 2vw, 3.157rem);
    --gws-font-700: clamp(2.25rem, 1.5rem + 3.75vw, 4rem);

    --gws-leading-tight: 1.2;
    --gws-leading-normal: 1.6;

    --gws-radius-sm: 4px;
    --gws-radius-md: 8px;
    --gws-radius-lg: 16px;
    --gws-shadow-1: 0 1px 2px rgb(0 0 0 / .08);
    --gws-shadow-2: 0 6px 16px rgb(0 0 0 / .12);

    --gws-ease: cubic-bezier(.2,.7,.2,1);
    --gws-dur: 200ms;

    --gws-content-max: min(90%, 1200px);
  }
}
</style>
```

### 12.2 Scoped reset/normalize (paste in same `<style>` block)

```css
@layer reset {
  .gws-scope :where(*, *::before, *::after) { box-sizing: border-box; }
  .gws-scope :where(html) { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
  .gws-scope :where(body, h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd) { margin: 0; }
  .gws-scope :where(h1, h2, h3, h4, h5, h6) {
    font-size: inherit; font-weight: inherit;
    text-wrap: balance; overflow-wrap: break-word;
  }
  .gws-scope :where(p, li, dd) {
    text-wrap: pretty; overflow-wrap: break-word; max-width: 70ch;
  }
  .gws-scope :where(ul[role="list"], ol[role="list"]) { list-style: none; padding: 0; }
  .gws-scope :where(img, picture, video, canvas, svg) {
    display: block; max-width: 100%; height: auto;
  }
  .gws-scope :where(input, button, textarea, select) { font: inherit; color: inherit; }
  .gws-scope :where(a) {
    color: inherit;
    text-decoration-thickness: max(.08em, 1px);
    text-underline-offset: .15em;
  }
  @media (prefers-reduced-motion: reduce) {
    .gws-scope :where(*, *::before, *::after) {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

### 12.3 Typography setup

```css
@layer base {
  .gws-scope {
    font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    font-size: var(--gws-font-200);
    line-height: var(--gws-leading-normal);
    color: var(--gws-ink-900);
    background: var(--gws-surface);
  }
  .gws-scope h1 { font-size: var(--gws-font-700); line-height: var(--gws-leading-tight); font-weight: 700; }
  .gws-scope h2 { font-size: var(--gws-font-600); line-height: var(--gws-leading-tight); font-weight: 700; }
  .gws-scope h3 { font-size: var(--gws-font-500); line-height: var(--gws-leading-tight); font-weight: 600; }
  .gws-scope h4 { font-size: var(--gws-font-400); line-height: 1.3; font-weight: 600; }
  .gws-scope p { font-size: var(--gws-font-200); }
  .gws-scope .gws-lede { font-size: var(--gws-font-300); color: var(--gws-ink-700); }
}
```

### 12.4 Accessibility-friendly button component

```html
<button type="button" class="gws-btn gws-btn--primary">
  <svg class="gws-btn__icon" aria-hidden="true" focusable="false" width="16" height="16">...</svg>
  <span class="gws-btn__label">Get a quote</span>
</button>
```

```css
@layer components {
  .gws-btn {
    min-block-size: 48px; min-inline-size: 48px;
    padding-inline: var(--gws-space-6);
    padding-block: var(--gws-space-3);
    display: inline-flex; align-items: center; gap: var(--gws-space-2);
    font: inherit; font-weight: 600; line-height: 1.2;
    text-decoration: none; cursor: pointer; user-select: none;
    border: 1.5px solid transparent;
    border-radius: var(--gws-radius-md);
    background: transparent; color: inherit;
    transition: background-color var(--gws-dur) var(--gws-ease),
                color var(--gws-dur) var(--gws-ease),
                border-color var(--gws-dur) var(--gws-ease);
  }
  .gws-btn--primary {
    background: var(--gws-clay-700);
    color: var(--gws-surface);
    border-color: var(--gws-clay-700);
  }
  .gws-btn--primary:hover {
    background: var(--gws-clay-800);
    border-color: var(--gws-clay-800);
  }
  .gws-btn--primary:active { transform: translateY(1px); }
  .gws-btn[aria-disabled="true"], .gws-btn:disabled { cursor: not-allowed; opacity: 0.6; }
  @media (prefers-reduced-motion: reduce) { .gws-btn { transition: none; } }
}

@layer utilities {
  .gws-scope :where(a, button, input, select, textarea, [tabindex]):focus-visible {
    outline: 3px solid var(--gws-focus);
    outline-offset: 2px;
    border-radius: var(--gws-radius-sm);
    box-shadow: 0 0 0 5px var(--gws-surface), 0 0 0 8px var(--gws-focus);
  }
  .gws-scope :focus:not(:focus-visible) { outline: none; }
  .gws-visually-hidden:not(:focus):not(:active) {
    clip: rect(0 0 0 0); clip-path: inset(50%);
    height: 1px; width: 1px; margin: -1px;
    overflow: hidden; padding: 0;
    position: absolute; white-space: nowrap; border: 0;
  }
}
```

### 12.5 Responsive image pattern with srcset

```html
<picture class="gws-hero__media">
  <source media="(max-width: 600px)" type="image/avif"
          srcset="https://ik.imagekit.io/gws/hero-mobile-800.avif">
  <source media="(max-width: 600px)" type="image/webp"
          srcset="https://ik.imagekit.io/gws/hero-mobile-800.webp">
  <source type="image/avif"
          srcset="https://ik.imagekit.io/gws/hero-1200.avif 1200w,
                  https://ik.imagekit.io/gws/hero-1920.avif 1920w"
          sizes="100vw">
  <source type="image/webp"
          srcset="https://ik.imagekit.io/gws/hero-1200.webp 1200w,
                  https://ik.imagekit.io/gws/hero-1920.webp 1920w"
          sizes="100vw">
  <img src="https://ik.imagekit.io/gws/hero-1200.jpg"
       alt="Groundwork Solutions crew grading a residential pad in Auburn, CA"
       width="1920" height="1080"
       fetchpriority="high" decoding="async">
</picture>
```

```css
.gws-hero__media img { aspect-ratio: 16/9; width: 100%; object-fit: cover; }
```

Companion preload (Header Tracking Code):

```html
<link rel="preload" as="image"
      imagesrcset="https://ik.imagekit.io/gws/hero-1200.avif 1200w,
                   https://ik.imagekit.io/gws/hero-1920.avif 1920w"
      imagesizes="100vw"
      type="image/avif"
      fetchpriority="high">
```

### 12.6 Schema markup template (LocalBusiness/GeneralContractor + WebSite)

Paste in SEO → Schema Markup Generator (JSON view), or as `<script type="application/ld+json">` in Header Tracking Code. Replace placeholders.

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GeneralContractor",
      "@id": "https://groundworknorcal.com/#business",
      "name": "Groundwork Solutions",
      "url": "https://groundworknorcal.com/",
      "logo": "https://groundworknorcal.com/logo.png",
      "image": [
        "https://groundworknorcal.com/photos/site-prep-1.jpg",
        "https://groundworknorcal.com/photos/grading-2.jpg"
      ],
      "description": "Licensed Northern California excavation and site preparation contractor. Grading, trenching, septic, demolition, and pad preparation across Placer, Nevada, El Dorado, and Sacramento counties.",
      "telephone": "+1-530-555-0123",
      "email": "[email protected]",
      "priceRange": "$$-$$$",
      "currenciesAccepted": "USD",
      "paymentAccepted": "Cash, Check, Credit Card, ACH",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1234 Industrial Way",
        "addressLocality": "Auburn",
        "addressRegion": "CA",
        "postalCode": "95603",
        "addressCountry": "US"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 38.8966, "longitude": -121.0769 },
      "hasMap": "https://maps.google.com/?cid=YOUR_CID",
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "07:00", "closes": "17:00"
      }],
      "areaServed": [
        { "@type": "City", "name": "Auburn", "sameAs": "https://en.wikipedia.org/wiki/Auburn,_California" },
        { "@type": "City", "name": "Grass Valley", "sameAs": "https://en.wikipedia.org/wiki/Grass_Valley,_California" },
        { "@type": "City", "name": "Roseville", "sameAs": "https://en.wikipedia.org/wiki/Roseville,_California" },
        { "@type": "City", "name": "Sacramento", "sameAs": "https://en.wikipedia.org/wiki/Sacramento,_California" },
        { "@type": "AdministrativeArea", "name": "Placer County" },
        { "@type": "AdministrativeArea", "name": "Nevada County" },
        { "@type": "AdministrativeArea", "name": "El Dorado County" }
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 38.8966, "longitude": -121.0769 },
        "geoRadius": "80000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Excavation & Site Prep Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Site Grading & Pad Preparation" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Trenching & Underground Utilities" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Septic System Excavation & Installation" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Demolition & Site Clearing" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driveway & Road Construction" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Erosion Control & SWPPP" }}
        ]
      },
      "identifier": [
        { "@type": "PropertyValue", "propertyID": "CSLB License", "value": "CA C-12 #123456" },
        { "@type": "PropertyValue", "propertyID": "DIR Registration", "value": "1000123456" }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "87",
        "bestRating": "5"
      },
      "sameAs": [
        "https://www.facebook.com/groundworknorcal",
        "https://www.instagram.com/groundworknorcal",
        "https://www.linkedin.com/company/groundworknorcal",
        "https://www.bbb.org/us/ca/auburn/profile/excavating-contractors/groundwork-solutions",
        "https://www.yelp.com/biz/groundwork-solutions-auburn"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://groundworknorcal.com/#website",
      "url": "https://groundworknorcal.com/",
      "name": "Groundwork Solutions",
      "publisher": { "@id": "https://groundworknorcal.com/#business" },
      "inLanguage": "en-US"
    }
  ]
}
</script>
```

For service detail pages, add a separate `Service` block with `provider: { "@id": "https://groundworknorcal.com/#business" }` and an `areaServed` narrowed to that service's primary city.

For blog posts, add `Article` schema. For pages with breadcrumbs, add `BreadcrumbList`. For pages with real Q&A content, add `FAQPage`.

### 12.7 llms.txt template

Hosted at `groundworknorcal.com/llms.txt`. Markdown, plain text.

```markdown
# Groundwork Solutions

> Licensed Northern California excavation and site preparation contractor based in Auburn, CA, serving Placer, Nevada, El Dorado, and Sacramento counties. CSLB License #123456 (Class A General Engineering, C-12 Earthwork). Specializing in residential and commercial site grading, trenching, septic excavation, demolition, and erosion control.

We are a family-owned excavation contractor. Our service area covers the Sierra foothills and Sacramento metro. Pricing varies by project; typical residential pad prep ranges $4,500 to $18,000. We carry $2M general liability and California workers' comp. All claims on this site can be verified via the CSLB public lookup.

## About
- [About Groundwork Solutions](https://groundworknorcal.com/about): Company history, ownership, equipment list, certifications
- [Service Area](https://groundworknorcal.com/service-areas): Counties and cities we serve
- [License, Insurance, Bonding](https://groundworknorcal.com/credentials): CSLB, DIR, insurance carriers, bond amount

## Services
- [Site Grading and Pad Preparation](https://groundworknorcal.com/services/grading): Residential and commercial pad prep, engineered fill, compaction, finish grading
- [Trenching and Underground Utilities](https://groundworknorcal.com/services/trenching): Water, sewer, electrical, gas line trenching
- [Septic System Excavation](https://groundworknorcal.com/services/septic): New install, replacement, repair across Placer/Nevada County
- [Demolition and Site Clearing](https://groundworknorcal.com/services/demolition): Structure demo, tree/stump removal, prep
- [Driveway and Private Road Construction](https://groundworknorcal.com/services/driveways): Aggregate base, paving prep, culvert installation
- [Erosion Control and SWPPP](https://groundworknorcal.com/services/erosion-control): QSP-certified SWPPP for construction sites

## Service Areas
- [Excavation in Auburn, CA](https://groundworknorcal.com/service-areas/auburn)
- [Excavation in Roseville, CA](https://groundworknorcal.com/service-areas/roseville)
- [Excavation in Grass Valley, CA](https://groundworknorcal.com/service-areas/grass-valley)
- [Excavation in Sacramento, CA](https://groundworknorcal.com/service-areas/sacramento)

## Pricing and Process
- [Excavation Cost Guide for Northern California](https://groundworknorcal.com/pricing): Typical price ranges and California factors
- [Our Process](https://groundworknorcal.com/process): Site visit, plan review, written bid, scheduling

## FAQ
- [Excavation FAQ](https://groundworknorcal.com/faq): Permits, timelines, equipment, NorCal concerns

## Optional
- [Project Gallery](https://groundworknorcal.com/projects)
- [Blog](https://groundworknorcal.com/blog)
- [Contact](https://groundworknorcal.com/contact)
```

### 12.8 Open Graph meta tag template

For SEO → Custom Meta Tags (or pasted in Header Tracking Code if the page-level SEO panel is exhausted):

```html
<meta property="og:title" content="Excavation & Site Prep in Auburn, CA | Groundwork Solutions">
<meta property="og:description" content="Licensed Northern California excavation contractor. Grading, trenching, septic, demolition. CSLB #123456. Free quotes across Placer and Sacramento counties.">
<meta property="og:url" content="https://groundworknorcal.com/">
<meta property="og:image" content="https://groundworknorcal.com/og-default.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Groundwork Solutions">
<meta property="og:locale" content="en_US">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Excavation & Site Prep in Auburn, CA | Groundwork Solutions">
<meta name="twitter:description" content="Licensed Northern California excavation contractor.">
<meta name="twitter:image" content="https://groundworknorcal.com/og-default.jpg">
```

### 12.9 Page skeleton (paste into Custom HTML/Code element between native menu and native form)

```html
<div class="gws-scope">
  <section class="gws-hero">
    <div class="gws-hero__inner">
      <h1>Site Preparation in Auburn, CA</h1>
      <p class="gws-lede">Licensed excavation and grading across Placer, Nevada, El Dorado, and Sacramento counties since 1998. Free quotes. CSLB #123456.</p>
      <a href="#contact" class="gws-btn gws-btn--primary">Get a quote</a>
    </div>
    <picture class="gws-hero__media">
      <!-- sources from 12.5 -->
    </picture>
  </section>

  <section class="gws-services" aria-labelledby="services-heading">
    <h2 id="services-heading">Services</h2>
    <ul class="gws-services__grid" role="list">
      <li class="gws-card">
        <h3>Grading and Pad Prep</h3>
        <p>Engineered fill, compaction, finish grading for residential and commercial.</p>
        <a href="/services/grading" class="gws-btn">Learn more</a>
      </li>
      <!-- repeat -->
    </ul>
  </section>

  <section class="gws-trust" aria-labelledby="trust-heading">
    <h2 id="trust-heading">Why owners hire us</h2>
    <p>Direct-answer paragraph 40 to 60 words for AI extraction. Concrete numbers, specific certifications, real outcomes.</p>
  </section>

  <!-- GHL native contact form section follows below as a separate GHL section -->
</div>
```

### 12.10 robots.txt template

If GHL's default isn't sufficient, host via Cloudflare Workers or upstream. Strategic recommendation: allow everything for maximum AI visibility.

```
# robots.txt for Groundwork Solutions
# Last updated: May 2026

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: CCBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: *
Allow: /
Disallow: /cart/
Disallow: /checkout/
Disallow: /thank-you/
Disallow: /*?*

Sitemap: https://groundworknorcal.com/sitemap.xml
```

---

## Conclusion

The build pattern that works for groundworknorcal.com on every page is small and repeatable: a single Custom HTML/Code element wrapped in `<div class="gws-scope">` between the GHL native menu and the GHL native form, with all CSS scoped under `.gws-scope`, design tokens defined once in site-wide Header Tracking Code, and cascade layers handling specificity so you almost never need `!important`. Real photos via ImageKit (free 20 GB) deliver AVIF automatically; the LCP hero gets `fetchpriority="high"` and a preload companion. JSON-LD goes in the SEO Schema Markup Generator. FAQ schema goes only on real FAQ pages. Allow every AI bot in robots.txt because the contractor has more to gain from being cited than to lose from being trained on.

The practical PageSpeed ceiling on GHL is ~70 to 85 mobile, 90 to 99 desktop. Aim there, not at 100. Always click **Save and Publish** (not just save), then hard-refresh in incognito to defeat Cloudflare cache. After every page clone, re-paste tracking code. Keep all custom CSS in an external file because GHL has no version history.

Three rules cover 80% of the wins: scope everything under `.gws-scope`, set `width` and `height` on every image, and use `<picture>` with AVIF for any photo above the fold.