# Groundwork Solutions - GHL Website Build Standards (Master Reference)

This document is the foundation rule set for building groundworknorcal.com inside the standard GoHighLevel page builder. Every page on the site (home, about, services overview, 8 service detail pages, who we work with, 7 industry pages, contact, plus footer) follows the rules below. Custom HTML and CSS only. No JavaScript. The contact form is GHL native at the bottom of every page. The menu is GHL native at the top. Everything between is custom.

Read once end to end. After that, jump to the section you need.

---

## 1. GHL Custom HTML and CSS constraints

### 1.1 What GHL allows, strips, or breaks

The standard page builder runs every Custom Code element through a sanitizer and wraps it in `<div class="c-custom-code">`. Plan around that wrapper. Confirmed behaviors:

- **`<script>` tags inside a `<div>`** fail validation. GHL's KB says cut the script out of the div and place it after. For an HTML+CSS-only build this does not affect us, but it confirms the sanitizer is active.
- **JSON-LD `<script type="application/ld+json">` pasted into a body Custom Code element is unreliable.** Community reports show it gets stripped or ignored. Put schema in the page-level Header Tracking Code or use GHL's native Schema Markup Generator (Settings > Schema Markup, supports 140+ types).
- **`<style>` tags inside a Custom Code element work in most cases** but are not officially guaranteed to survive every save. Treat them as a fallback. Put production CSS in **Page Settings > Custom CSS** instead.
- **`<link rel="stylesheet">` tags belong in the page or site-level Header Tracking Code**, not inside body Custom Code. Header tracking is the supported home for `<link>`, `<meta>`, and `<style>` in `<head>`.
- **Semantic HTML5** (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) is not on any block list. Use it freely. It still ends up wrapped in the GHL `c-custom-code` div.
- **`<form>` elements you build yourself will render but will not submit through GHL's pipeline.** Use the GHL native Form element for the contact form.
- **`<iframe>` works** (officially documented for calendar and form embeds).
- **Sticky positioning works in preview but often fails on live**. Avoid `position: sticky` for hero CTAs. Use scroll-anchored sections instead.

### 1.2 Where to place code

| Location | What goes here |
|---|---|
| **Custom Code element** in page body | Visible HTML markup for each section. One element per major section is fine. |
| **Page Settings > Custom CSS** | All page-specific CSS. Plain CSS only, no `<style>` tags. Loads in `<head>`. |
| **Page Settings > Tracking Code > Header** | JSON-LD schema, Open Graph, Twitter card meta, canonical overrides, Google Fonts `<link>`, sitewide `<style>` if needed. |
| **Page Settings > Tracking Code > Footer (Body)** | Deferred snippets only. We will not use this much. |
| **Site Settings > Custom Code** | Sitewide Google Fonts link, sitewide CSS variables, sitewide schema for Organization/LocalBusiness. |
| **Domain Settings > XML Sitemap and Robots.txt** | Sitemap selection per page, robots.txt edits. |

Do not paste public-site CSS into Settings > Company > Branding. That field styles the CRM dashboard, not the website.

### 1.3 CSS conflicts and scoping

GHL injects its own classes. Known prefixes and class names you must not collide with:

- `c-custom-code`, `c-section`, `c-row`, `c-column`, `c-wrapper`
- `hl-`, `ghl-` prefixes (forms, surveys, calendars)
- `lc-` prefixes (LeadConnector elements)
- Generic Bootstrap-derived names that may also be present: `.row`, `.container`, `.section`, `.card`, `.btn`, `.header`, `.nav`, `.footer`

**Scoping rule for this build:** every custom class is prefixed `gw-`. Every CSS selector is scoped under a section namespace. Bare element selectors (`h1`, `a`, `p`) in page-level Custom CSS are forbidden because they leak to the GHL menu and form.

DO:
```css
.gw-hero { padding: 80px 0; }
.gw-hero h1 { font-size: clamp(2rem, 5vw, 4rem); }
```

DON'T:
```css
h1 { font-size: 4rem; } /* leaks into GHL menu and form labels */
.section { padding: 80px; } /* collides with GHL */
```

You will need `!important` occasionally for `font-family`, `color`, and `background` because GHL's defaults sometimes outrank scoped selectors. Use it only when you confirm a conflict in DevTools.

You cannot reach inside the GHL form iframe with CSS. Style around it, not into it.

### 1.4 Fonts in GHL

`@import` works but is render blocking and adds CLS. Use a `<link>` tag in the site-level Header Tracking Code instead. GHL also supports native font upload at Sites > Typography > Custom Font. For Groundwork, use Google Fonts via `<link>` for simplicity.

### 1.5 Funnels vs Websites

Use **Website**, not Funnel, for Groundwork. Funnels duplicate header and footer per step and do not support shared global nav. Websites support nested URL paths, shared header/footer, and the blog module if needed later.

Tracking code is not copied when you duplicate a page. Always re-paste page-level header tracking after a duplicate.

### 1.6 Known quirks to plan around

- Page-level Custom CSS occasionally needs a re-edit and save before it loads in the builder preview.
- Brand Board color changes do not propagate to existing pages. We will manage colors with CSS variables instead.
- 301 redirects with multi-level paths sometimes fail; test each one.
- Image Optimization toggle defaults to q_80 r_1200 and produces visibly soft heroes. Override per image with `q_100/r_2000` or pre-compress and disable optimization.
- Mobile and desktop layout settings are independent for everything except font size. Plan separate sections for layouts that diverge significantly. Custom CSS media queries are how we will handle most cases.
- Custom 404 pages are not officially supported. Acceptable workaround: a `/404` page plus a redirect rule, or handle at Cloudflare if added later.

---

## 2. Speed and performance

### 2.1 2026 Core Web Vitals targets

| Metric | Good | Our target |
|---|---|---|
| LCP | ≤ 2.5s | ≤ 2.0s mobile |
| INP | ≤ 200ms | ≤ 100ms (HTML+CSS only makes this trivial) |
| CLS | ≤ 0.1 | ≤ 0.05 |

Google measures the 75th percentile of real users. Mobile-first indexing has been complete since October 2023. Mobile is the only ranking surface that matters.

### 2.2 Realistic GHL speed scores

GHL's official benchmark is 80+ mobile, 95+ desktop. Independent testing routinely shows 30 to 60 mobile on stock GHL pages because of the React runtime. Realistic targets for Groundwork with disciplined HTML+CSS:

- **Desktop PSI: 90 to 100**
- **Mobile PSI: 75 to 90**
- LCP under 2.5s mobile is achievable. INP and CLS will pass easily because we ship no custom JS.

### 2.3 Strategy

- **Critical CSS is small and lives in Page Settings > Custom CSS.** This loads in the document head. Our entire page CSS budget is ~15 to 25KB uncompressed.
- **No `@import` in CSS.** Fonts load via `<link rel="preconnect">` plus `<link rel="stylesheet">` in the header tracking code.
- **Preload the LCP image.** Every hero gets a `<link rel="preload" as="image" fetchpriority="high">` in page header tracking, with `imagesrcset` matching the `<img>`.
- **Enable GHL's "Optimize JavaScript" setting** at the site level. It defers non-essential scripts.
- **Disable "Image Optimization" at the site level** if GHL's q_80 default visibly degrades hero photos. Then either pre-compress or use Unsplash hot-links with explicit quality params.
- **No CSS frameworks.** No Bootstrap, no Tailwind. Hand-rolled CSS only.
- **Avoid third-party widgets above the fold.** No chat widgets, no review embeds in the hero. Below the fold or footer only.
- **One web font family pair maximum.** Two display weights, two body weights. That is it.

### 2.4 Testing tools

PageSpeed Insights at pagespeed.web.dev is the primary tool. Run mobile and desktop on every published page. Cross-check against WebPageTest for a waterfall. Use Chrome DevTools Performance panel during build. Treat field data (CrUX) as the source of truth after 28 days.

---

## 3. Image optimization for real photos

### 3.1 Format strategy

- **Photos:** AVIF preferred where available, WebP fallback, JPEG legacy fallback. With Unsplash hot-links, `auto=format` handles all three automatically based on the browser's `Accept` header.
- **Logos and icons with transparency:** SVG.
- **Avoid:** PNG for photos, JPEG for line art, animated GIF.

### 3.2 Dimensions and file sizes

| Use | Width | Aspect | Target file |
|---|---|---|---|
| Hero (full bleed) | 1600 to 2400 | 16:9 or 21:9 | < 200KB |
| Section feature | 800 to 1200 | 4:3 or 3:2 | < 100KB |
| Card thumbnail | 400 to 800 | 4:3 or 1:1 | < 50KB |
| Logo | SVG, no raster | n/a | < 10KB |

Never ship an image more than 2x the largest displayed CSS size at max DPR.

### 3.3 Unsplash CDN parameters

Unsplash images live on `images.unsplash.com`, an Imgix CDN. Hot-link directly. Keep the `ixid` parameter intact for attribution tracking.

Optimized URL pattern:
```
https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1600&q=75
```

Key parameters:
- `auto=format` returns AVIF, WebP, or JPEG based on browser support
- `w=` width in pixels
- `q=` quality (75 is the sweet spot for photos)
- `fit=crop` crops to fill the requested dimensions
- `dpr=` device pixel ratio override (rarely needed if using srcset)

For a 1600px hero, generate four widths: 800, 1200, 1600, 2400. Let `srcset` and `sizes` pick.

### 3.4 Responsive image pattern

```html
<picture>
  <img
    src="https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1600&q=75"
    srcset="https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=800&q=75 800w,
            https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1200&q=75 1200w,
            https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1600&q=75 1600w,
            https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=2400&q=75 2400w"
    sizes="100vw"
    width="1600" height="900"
    alt="Mini excavator grading a residential pad in Rocklin, CA."
    loading="eager" fetchpriority="high" decoding="async"
    style="width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;">
</picture>
```

Below-the-fold images use `loading="lazy"` and remove `fetchpriority`.

### 3.5 LCP preload (in page header tracking)

```html
<link rel="preconnect" href="https://images.unsplash.com" crossorigin>
<link rel="preload" as="image"
  href="https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1600&q=75"
  imagesrcset="https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=800&q=75 800w,
               https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1200&q=75 1200w,
               https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1600&q=75 1600w,
               https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=2400&q=75 2400w"
  imagesizes="100vw" fetchpriority="high">
```

The `imagesrcset` and `imagesizes` must match the `<img>` exactly. Mismatch wastes a download.

### 3.6 CLS prevention

Three layered defenses, all applied:
1. `width` and `height` HTML attributes on every `<img>` (use the natural dimensions).
2. CSS `aspect-ratio` on the parent or the image itself.
3. For background images, set `min-height` on the container.

Never lazy-load the LCP image. Sites that lazy-load their hero are 10 percentage points less likely to pass LCP.

### 3.7 Hosting choice for Groundwork

**Hot-link Unsplash directly.** Free, fast Imgix CDN, automatic format negotiation, full URL parameter control. For non-Unsplash assets (logo, eventual real project photos), pre-compress in Squoosh.app to WebP at q=80, upload to GHL, and override the URL to `q_100/r_2000` or disable site-level image optimization.

If real project photography expands later, ImageKit's free tier (25GB bandwidth, unlimited transforms) is the next step.

### 3.8 Alt text rules

- 80 to 140 characters. Front-load important info. End with a period.
- Decorative images get `alt=""`. Never omit the attribute.
- No "image of" or "picture of." Screen readers already announce it.
- Describe what's in the photo and why it matters in context. Natural keywords are fine. No stuffing.

DO: `alt="Crew operating a CAT skid steer to grade a building pad in Loomis, CA."`
DON'T: `alt="excavation Sacramento Roseville Rocklin grading dirt work contractor"`

### 3.9 Photo direction for excavation

Use:
- Equipment in action mid-motion, dust visible
- Tight detail of bucket teeth, tracks, hydraulic rams
- Site context: stakes, trenches, graded pads, finished work
- Crew shots with real PPE, hands on controls, faces secondary
- Northern California cues: golden hills, oaks, granite, vineyard rows

Avoid:
- Suit-and-handshake stock
- Smiling models in clean hi-vis posing with clipboards
- CGI buildings, cartoon mascots, indoor laptop shots
- Group huddles around a tablet (the cliché stock construction shot)

Unsplash searches that work: `excavator dirt`, `skid steer`, `bulldozer dust`, `graded dirt pad`, `trench excavation`, `decomposed granite`, `california foothills`, `construction worker boots`, `surveyor stakes`.

---

## 4. Responsive design inside GHL

### 4.1 GHL mobile editor behavior

In the standard builder, **only font size has independent desktop and mobile values**. Layout, spacing, and structural changes require either separate desktop-only and mobile-only sections OR custom CSS media queries. Because we are writing custom HTML and CSS, we will use media queries inside Page Settings > Custom CSS for almost everything.

Builder-set values can inject inline styles that override your CSS. If a layout breaks on mobile, inspect in DevTools, find the inline style, and either remove it from the GHL panel or override with a more specific scoped class.

### 4.2 Breakpoints (mobile first)

```css
/* base = mobile, no media query */
@media (min-width: 600px)  { /* small tablet */ }
@media (min-width: 900px)  { /* tablet / small desktop */ }
@media (min-width: 1200px) { /* desktop */ }
@media (min-width: 1500px) { /* wide */ }
```

GHL's own mobile breakpoint sits around 768px. Our 600 and 900 breakpoints sandwich that and give us control.

### 4.3 Touch targets

Minimum 48x48 CSS pixels for any tappable element. Buttons get 12 to 16px vertical padding plus generous horizontal padding. Links inside paragraphs do not need a minimum size, but stand-alone tap targets in nav, cards, and CTAs must clear 48px.

### 4.4 Fluid typography

Use `clamp()` for headings and key body sizes. One example:

```css
.gw-h1 { font-size: clamp(2rem, 1.4rem + 3vw, 3.75rem); line-height: 1.05; }
.gw-h2 { font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem); line-height: 1.15; }
.gw-body { font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); line-height: 1.6; }
```

### 4.5 Container queries

Container queries are widely supported in 2026 (~95% globally). Use them where a component needs to adapt to its own container, not the viewport. We default to media queries for layout because they remain simpler and well-supported across older Android browsers.

### 4.6 Mobile menu

Groundwork keeps the GHL native menu. Configure its mobile behavior in the menu element settings. Test the hamburger on real iOS Safari and real Android Chrome. The menu's internal HTML is GHL-generated; do not try to restyle it from page CSS.

### 4.7 Common pitfalls

- 100vw on body causes horizontal scroll on mobile due to scrollbar width. Use 100% on root containers and `overflow-x: hidden` on `body` if needed.
- Fixed pixel widths break on small phones. Use `max-width` plus `width: 100%`.
- `vh` units jump when mobile browser chrome shows or hides. Use `dvh` or set hero heights with `min-height: 100svh`.
- DevTools mobile preview lies. Always test on a real iPhone and a real Android before publishing.

---

## 5. On-page SEO best practices for 2026

### 5.1 Title tags

50 to 60 characters or under ~580 pixels. Front-load primary keyword and city. End with brand. Pattern for Groundwork:

- Home: `Excavation & Site Prep in Rocklin, CA | Groundwork Solutions`
- Service: `Pool Excavation in Greater Sacramento | Groundwork Solutions`
- Industry: `Site Prep for Pool Builders | Groundwork Solutions`

Google rewrites about 60% of titles. Front-loaded keywords plus a clear brand suffix get rewritten less often.

### 5.2 Meta descriptions

150 to 160 characters desktop, 120 on mobile. One per page, unique. Include primary keyword (Google bolds query matches), include a soft CTA (Free estimate, Serving Greater Sacramento). Not a direct ranking factor; influences CTR.

### 5.3 Heading hierarchy

One descriptive H1 per page. H2s as primary section headers. H3s for subsections. Don't skip from H2 to H4. Sentence case. Avoid repeating the title verbatim in H1.

Heading hierarchy is not a confirmed Google ranking factor (Illyes, July 2024) but it is critical for accessibility and for AI passage extraction, which is how AEO works.

### 5.4 URL slugs

Short, lowercase, hyphenated, descriptive. Five words max. No stop words, dates, or session IDs.

Groundwork structure:
```
/                                      home
/about/
/services/
/services/site-preparation/
/services/grading/
/services/trenching/
/services/excavation/
/services/demolition/
/services/land-clearing/
/services/pool-excavation/
/services/utility-installation/
/who-we-work-with/
/who-we-work-with/general-contractors/
/who-we-work-with/pool-builders/
/who-we-work-with/home-builders/
/who-we-work-with/landscape-contractors/
/who-we-work-with/property-developers/
/who-we-work-with/septic-installers/
/who-we-work-with/winery-vineyard/
/contact/
```

### 5.5 Canonical, robots, Open Graph, Twitter

Self-referencing canonical on every page. Place via the GHL canonical setting in page SEO, not custom HTML.

Robots default to `index, follow` (omit unless blocking). Don't block `GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`, `Google-Extended`, or `Applebot-Extended` if you want AI visibility.

Open Graph image: 1200x630, under 1MB, JPEG or WebP. Twitter card: `summary_large_image`, image 1200x675.

```html
<meta property="og:title" content="Excavation & Site Prep in Rocklin, CA | Groundwork Solutions">
<meta property="og:description" content="Excavation, grading, and site preparation across Greater Sacramento, Placer County, and surrounding areas.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://groundworknorcal.com/">
<meta property="og:image" content="https://groundworknorcal.com/og/home-1200x630.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Groundwork Solutions skid steer grading a residential pad.">
<meta property="og:site_name" content="Groundwork Solutions">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Excavation & Site Prep in Rocklin, CA | Groundwork Solutions">
<meta name="twitter:description" content="Excavation, grading, and site prep across Greater Sacramento.">
<meta name="twitter:image" content="https://groundworknorcal.com/og/home-1200x675.jpg">
```

### 5.6 Schema markup (JSON-LD only)

Use `GeneralContractor` (it inherits from `LocalBusiness`). Avoid `ProfessionalService` (effectively deprecated). Place all schema in page-level Header Tracking Code or use GHL's native Schema Markup Generator. JSON-LD only; microdata is legacy.

Templates are in Section 14.

FAQ rich results in Google have been restricted to government and health sites since August 2023 and remain restricted in 2026. We still use FAQPage schema on a dedicated `/faq/` page because Bing and AI engines still parse it. We do not sprinkle FAQ schema on every service page.

HowTo schema was deprecated September 2023; do not use. Speakable is still beta and US-news-focused; skip.

### 5.7 Sitemap and robots.txt

Sitemap at Domain Settings > XML Sitemap. Tick every public page. Re-save after adding any new page. Robots.txt at Domain Settings > Robots.txt. Default file works. Add `Sitemap: https://groundworknorcal.com/sitemap.xml` if not already there. Be careful editing; one wrong line can deindex the site.

### 5.8 Local SEO for a service area business

Groundwork has no public storefront. Setup rules:

- **Google Business Profile:** primary category "Excavating contractor". Secondary: "General contractor", "Demolition contractor". Set up to 20 named service areas (Rocklin, Roseville, Lincoln, Loomis, Granite Bay, Folsom, Auburn, Sacramento). Hide the address. Add 10+ real photos. Post weekly. Note: Sterling Sky's testing shows hidden-address SABs sometimes rank worse than verified-address businesses. If a small office becomes feasible later, verify it.
- **NAP consistency** across every directory. Use one phone (not call tracking) on GBP and citations. If call tracking is added, use DNI on the website only.
- **Citations:** Yelp, BBB, Apple Business Connect, Bing Places, Houzz, Angi, HomeAdvisor, BuildZoom, Thumbtack, Nextdoor, Foursquare, Sacramento Chamber, Rocklin Chamber, AGC of California.
- **E-E-A-T signals** displayed on the site: CSLB license number (Class A or C-12), bond and insurance, AGC membership if applicable, OSHA certifications, real project galleries with location captions, real customer reviews, owner bio with credentials and years of experience.

### 5.9 Service area page strategy

Hub and spoke structure:

1. One strong page per **core service** (the 8 service detail pages).
2. One page per **industry served** (the 7 industry pages).
3. **Optional later:** city pages for the highest-volume markets only (Rocklin, Roseville, Sacramento). Each must be unique with local landmarks, soil notes (decomposed granite in Rocklin/Granite Bay), permit notes (Placer County vs Sacramento County), and real project photos in that city. Doorway pages get penalized.

Cross-link aggressively. Every service page links to the relevant industry pages. Every industry page links to the relevant services. See Section 8.

### 5.10 Keyword strategy

Commercial intent (target on service and city pages):
- excavation contractor Rocklin, site prep contractor Roseville, grading Granite Bay
- pool excavation Sacramento, septic excavation Placer County
- excavation cost Sacramento, site prep cost Rocklin

Informational intent (target on FAQ, blog, pillar pages later):
- how much does excavation cost in Sacramento, what does a site prep contractor do, do I need a permit to excavate in Placer County, difference between grading and excavation

"Near me" optimization is automatic if the schema's `areaServed` lists the cities, GBP service areas match, and on-page content names the cities and neighborhoods.

---

## 6. Answer Engine Optimization (AEO) for 2026

### 6.1 What AEO is

AEO is the discipline of getting your content cited inside AI answers from ChatGPT, Perplexity, Google AI Overviews, Google AI Mode, Gemini, Claude, and Microsoft Copilot. Traditional SEO ranks pages. AEO surfaces passages inside answers, often without a click. For a contractor, the goal is not just clicks; it is being the cited business when someone asks an LLM "who should I hire for excavation in Sacramento?"

### 6.2 How each engine retrieves

- **Google AI Overviews and AI Mode** retrieve from Google's index. About 76% of citations come from top-10 ranking pages. Traditional SEO is the prerequisite.
- **ChatGPT** browses on roughly a third of queries. Heavily cites Reddit, Wikipedia, Forbes. Local-intent queries trigger search ~59% of the time.
- **Perplexity** rewards freshness and authoritative third-party mentions. Top citation sources: YouTube, Wikipedia.
- **Claude** uses Brave search; prefers comprehensive long-form.
- **Copilot** uses Bing index plus Microsoft Graph; leans on Bing Places for local.

Three patterns repeat across all of them: top-10 organic ranking, structured data, and third-party brand mentions.

### 6.3 Content structure that gets cited

**Answer-first.** Every H2 section opens with a 40 to 75 word direct answer, then context follows. Princeton's GEO study showed passage-level optimization lifts AI visibility 30 to 40%. AirOps research: 55% of AI citations come from the top 30% of a page.

**Self-contained passages.** Each H2 must make sense alone. RAG retrieval chunks at the passage level, not the page level.

**Question-format H2s** that match conversational queries:
- "How much does excavation cost in Sacramento?"
- "Do I need a permit to excavate in Placer County?"
- "What's the difference between grading and excavation?"

**Specific facts move the needle.** Princeton GEO data: adding statistics +30%, expert quotes +41%, citations +30% to AI visibility. Tables and bulleted lists get cited 2.5x more than prose. Keyword stuffing reduces citation rate.

**Definition sentences** ("X is Y") are highly extractable. Use one near the top of each service page.

### 6.4 Writing example

```
H2: How much does excavation cost in the Sacramento area?

[40 to 75 word direct answer]
Excavation in the greater Sacramento area typically runs $50 to $200 
per cubic yard. Most residential projects land between $2,400 and $12,000. 
Cost depends on soil type (decomposed granite in Rocklin and Granite Bay 
adds 15 to 20%), depth, site access, and haul-off distance. Equipment plus 
operator runs $150 to $300 per hour.

[Then: details, factors, examples, what affects pricing.]
```

### 6.5 Schema that helps AEO

- `GeneralContractor` with full NAP, areaServed, serviceArea, geo, knowsAbout, sameAs, aggregateRating
- `Service` with areaServed, provider, hasOfferCatalog on each service page
- `Organization` plus `WebSite` on home, linked by @id
- `Person` for owner Edward "Dardi" Ursulescu with jobTitle and worksFor
- `BreadcrumbList` everywhere
- `FAQPage` on a dedicated `/faq/` page only
- `Article` with author Person and dateModified for any blog content added later

Skip: HowTo (deprecated), Speakable (low ROI), FAQPage on every page (Google warns against promotional FAQ schema).

### 6.6 llms.txt

Adoption sits around 10% of domains. Studies from SE Ranking and ALLMO found zero correlation between llms.txt presence and AI citation rates. John Mueller (Google) said no AI system currently uses it. **Skip llms.txt for Groundwork.** It is not harmful, but it is not a lever that moves citations in 2026. Section 14 includes a template if you want to add one anyway.

### 6.7 Brand mentions matter more than backlinks

Ahrefs analyzed 76 million AI Overviews: brand mentions correlate with citations at 0.664; backlinks at 0.218. Mentions matter ~3x more than links for AI visibility. Brands are 6.5x more likely to be cited via third-party sources than their own domain.

For Groundwork:
- Get listed in Sacramento-area "best excavation contractor" roundup posts
- Owner answers on Quora about excavation cost and permits
- Subreddit participation in r/Sacramento, r/RealEstate, r/HomeImprovement
- Local press for big projects (Roseville Press Tribune, Sacramento Bee)
- YouTube channel with site walk-throughs (Ahrefs data: YouTube mentions correlate with AI Overview citations)
- Houzz Pro and BuildZoom profiles
- AGC of California listing

### 6.8 Voice and conversational keywords

Voice search optimization is AEO optimization. Same playbook: answer-first, conversational H2s, FAQ-style content, fast page speed, structured data.

### 6.9 AEO tracking

For a single contractor, $29/mo Otterly.AI is sufficient. Tracks ChatGPT, Perplexity, AIO, AI Mode, Gemini, Copilot. Profound's $99 starter is the next step up. Enterprise tools (AthenaHQ, Scrunch) are overkill.

Track these prompts monthly:
- "best excavation contractor in Rocklin"
- "site prep contractor Sacramento"
- "how much does pool excavation cost in Sacramento"
- "who does grading in Placer County"

### 6.10 Pattern for contractor AEO content

Every service page gets:
1. H1 with service plus area
2. 40 to 75 word direct answer paragraph
3. "What's included" list
4. "How much does it cost" H2 with answer-first paragraph and price ranges
5. "How long does it take" H2
6. "What permits are required" H2 (Placer/Sacramento County specific)
7. Industries served (cross-link to industry pages)
8. Real project photos with location captions
9. CSLB license, bond, insurance, contact CTA

Every industry page gets:
1. H1 with industry plus area
2. Direct answer about why this industry needs site work
3. Services offered for this industry (cross-link to service pages)
4. Common projects and timelines
5. What to expect (process)
6. Real project photos
7. CTA

---

## 7. Branding and font selection

### 7.1 Selected font pairing

**Big Shoulders Display + Public Sans.** Both Google Fonts.

Big Shoulders Display: weights 700 and 800. Display, headers, hero numbers, section labels in ALL CAPS. Drawn from Chicago industrial heritage; reads as job-site signage and equipment lettering. Distinct from every SaaS template.

Public Sans: weights 400 and 600. Body, nav, forms, captions. Descended from Libre Franklin; used by US federal sites. Utility-grade and non-trendy.

Total: 4 font files. Latin subset only.

Three alternates if owner prefers a different feel:
- **Archivo Black + Archivo** (heaviest, blockiest, single-superfamily simplicity, 3 files)
- **Barlow Condensed + Barlow** (drawn from California highway and transit signage, regional fit, 4 files)
- **Roboto Slab + Hanken Grotesk** (slab serif option for "old-school heavy iron" feel)

Avoid: Inter, Roboto, Arial, Space Grotesk, Bebas Neue, Anton-only logos, stencil fonts, Architects Daughter, Permanent Marker, Times New Roman, Georgia.

### 7.2 Font loading

In site-level Header Tracking Code:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800&family=Public+Sans:wght@400;600&display=swap">
```

`display=swap` prevents invisible text. Both preconnects are required (CSS host and font file host). Skip `@import`.

### 7.3 Color palette (validated)

| Role | Hex | Notes |
|---|---|---|
| Paper (background) | #F7F5F0 | Warm off-white. |
| Ink (primary text) | #1C1A17 | 15.93:1 on paper. AAA. |
| Clay (primary accent) | #B85838 | 4.29:1 on paper. **Large/bold text only**, or as solid fill behind white text. |
| Clay Dark (text accent) | #9E4426 | **5.83:1 on paper. Use this for inline links and small accent text.** New addition. |
| Tint (decorative fill) | #F0E4D6 | Section backgrounds, card fills. Decorative only. |
| Slate (secondary accent) | #3D4A52 | Steel blue-gray. ~9.5:1 on paper. AAA. For icons, dividers, dark sections. |
| Success | #3F7A4E | Field green. ~5.4:1 on paper. |
| Warning | #B8731B | Burnt amber. ~4.6:1 on paper. Distinct from clay. |
| Error | #A8281C | Signal red. ~6.1:1 on paper. |

Rules:
- Body text is ink on paper, always.
- Inline accents in body copy use clay-dark (#9E4426), not clay.
- Headings 24px+ regular or 18.66px+ bold can use clay directly on paper.
- Buttons: solid clay fill with white labels (4.68:1, AA). Never put dark ink labels on clay (3.71:1 fails AA normal).
- Slate is the secondary for icon strokes, dividers, footer backgrounds, and any dark section.

### 7.4 Logo and photography direction

Logo: SVG. Sized 32 to 48px tall in nav, 40 to 64px in footer. Provide a paper-on-clay variant if any clay-background sections need it. Never rasterize.

Photography direction is in Section 3.9. Tone: warm-leaning grade, golden hour or overcast, dust visible, real PPE, NorCal foothill light.

### 7.5 Brand voice rules

- Contractor-to-contractor. Direct.
- Plain English. Short sentences (20 words or less).
- Active voice. Contractions fine.
- No em-dashes. No double hyphens.
- No AI-tell phrases: delve, leverage, robust, comprehensive solution, seamless, elevate, unlock, navigate the landscape, in today's fast-paced world.
- Numbers and specifics over adjectives. "We grade pads in 1 to 3 days" beats "We grade pads efficiently."
- Tell the reader what we do, who it's for, what it costs, how long it takes.

### 7.6 Visual consistency

Every page uses the same CSS variable block. Same heading scale. Same button component. Same section padding rhythm. Same image treatment. Build the home page first to lock the visual language, then every other page reuses the same components.

---

## 8. Internal linking and site architecture

### 8.1 Site map

```
Home
├── About
├── Services (overview)
│   ├── Site Preparation
│   ├── Grading
│   ├── Trenching & Utilities
│   ├── Excavation
│   ├── Demolition
│   ├── Land Clearing
│   ├── Pool Excavation
│   └── Septic & Drainage
├── Who We Work With (overview)
│   ├── General Contractors
│   ├── Pool Builders
│   ├── Home Builders
│   ├── Landscape Contractors
│   ├── Property Developers
│   ├── Septic Installers
│   └── Wineries & Vineyards
├── Contact
└── (Footer-only links: Privacy, Terms, Sitemap)
```

(The exact 8 service names and 7 industry names will be confirmed by the user. Slugs follow the kebab-case convention from Section 5.4.)

### 8.2 Primary navigation

Flat menu with two dropdowns:
- Home (link)
- Services (dropdown of 8 service pages, with "All Services" at top)
- Who We Work With (dropdown of 7 industry pages, with "All Industries" at top)
- About (link)
- Contact (link, also a clay button)

Phone number visible in nav on desktop, click-to-call on mobile.

### 8.3 Internal linking strategy

Every important page must be reachable within 3 clicks of home.

**Cross-linking matrix (most important rule for this site):**
- Each **service page** links to the 2 to 4 industry pages where that service is most common. Example: Pool Excavation links to Pool Builders, Home Builders, Landscape Contractors.
- Each **industry page** links to the 3 to 6 services that industry typically buys. Example: Pool Builders links to Pool Excavation, Trenching, Site Preparation, Grading.
- Every service page has a "Related services" block (2 to 3 links to adjacent services).
- Every industry page has a "Services we provide for [industry]" block.

This matrix is the spine of both SEO topical authority and AEO entity associations.

### 8.4 Anchor text

Descriptive and keyword-relevant. Never "click here" or "learn more" alone.

DO: `View our pool excavation services`
DO: `See how we work with pool builders`
DON'T: `Click here`
DON'T: `Read more`

Vary anchor text across pages. Don't repeat the exact same anchor 50 times.

### 8.5 CTA button text

Consistent verbs across the site:
- Primary: `Get a free estimate`
- Secondary: `See our services`, `View [service] details`
- Tertiary: `Call (XXX) XXX-XXXX`

### 8.6 Breadcrumbs

Every page below the top level shows breadcrumbs. HTML pattern plus BreadcrumbList schema in Section 14. Hide on home only.

### 8.7 Footer links

Full site map in the footer. Three columns:
1. Services (all 8)
2. Who we work with (all 7)
3. Company (About, Contact, Service area, License # CSLB-XXXXX)

Plus copyright, NAP, social links.

### 8.8 External links

Open external links in a new tab (`target="_blank" rel="noopener"`). Use `rel="nofollow"` only for paid or untrusted links, not for citations. Link to authoritative external sources (Placer County permitting page, CSLB license lookup) on relevant content pages; this strengthens E-E-A-T.

### 8.9 URL slug conventions (recap)

- Lowercase, hyphenated, descriptive
- 5 words or fewer
- No dates, no IDs, no stop words
- Service pages live at `/services/[slug]/`
- Industry pages live at `/who-we-work-with/[slug]/`
- Trailing slashes consistent across the site

### 8.10 Sitemap.xml inclusion

Every public page in the sitemap. Exclude: thank-you pages, draft pages, any duplicate that exists during a migration. Re-save sitemap after every new page is published.

---

## 9. Accessibility (WCAG 2.2 AA)

### 9.1 Semantic HTML

Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` correctly. One `<main>` per page. Each `<section>` should have a heading. Each landmark should have an accessible name when there are multiples (e.g., `<nav aria-label="Footer">`).

### 9.2 Color contrast (covered in Section 7.3)

Body text 4.5:1. Large text (24px+ regular, 18.66px+ bold) 3:1. UI components and icons 3:1. Verified for the Groundwork palette.

### 9.3 Keyboard navigation

Every interactive element reachable by Tab. Logical focus order. Visible focus styles on every focusable element:

```css
.gw a:focus-visible,
.gw button:focus-visible,
.gw .gw-btn:focus-visible {
  outline: 2px solid var(--gw-clay);
  outline-offset: 3px;
}
```

### 9.4 Skip link

Place at the top of every page (first thing inside `<body>` if possible; in GHL, place in the first Custom Code element):
```html
<a class="gw-skip" href="#main">Skip to main content</a>
```
```css
.gw-skip {
  position: absolute; left: -9999px;
  padding: 12px 16px; background: var(--gw-ink); color: var(--gw-paper);
}
.gw-skip:focus { left: 8px; top: 8px; z-index: 9999; }
```

The target is `<main id="main">` at the top of the custom HTML region.

### 9.5 ARIA

Use sparingly. Native HTML before ARIA. Common needs:
- `aria-label` on icon-only buttons
- `aria-current="page"` on the active nav item (configure in GHL menu settings if available)
- `aria-expanded` and `aria-controls` only when running real JS-driven disclosure (we are not, so most ARIA is unnecessary)

### 9.6 Forms

The contact form is GHL native. Surrounding context (heading above, supporting paragraph, success message location) must be readable and labeled. Do not introduce custom form fields in Custom HTML; they will not submit.

### 9.7 Why accessibility helps SEO and AEO

Semantic landmarks help Google understand page structure. Heading hierarchy is what AI engines use for passage extraction. Alt text serves both screen readers and AI image understanding. Accessibility and AEO are the same discipline applied to different audiences.

---

## 10. GHL build architecture

### 10.1 Site type

Use **Website** (not Funnel, not Membership). Multi-page with shared global header/footer.

### 10.2 Header and footer

**Header: GHL native menu element.** Configure once in the global header section. Reasons: GHL handles the mobile hamburger correctly; rebuilding nav in custom HTML increases mobile failure surface and the GHL native menu is the only part the user explicitly wants to keep.

**Footer: custom HTML.** GHL's footer options are limited. We need a 3-column site-map footer with NAP, license, and social. Build it once in a global footer section using a single Custom Code element plus page-level CSS variables.

### 10.3 Reusable sections

GHL supports "Save Section" so you can reuse a built section across pages. Save:
- Hero pattern
- Trust strip (stat tiles)
- Section header (eyebrow + H2 + supporting paragraph)
- CTA strip (above the contact form)
- Footer (global)

For each saved section, document the variables that change per page (heading text, image, alt text). Treat the saved section as a template, edit per page.

### 10.4 Variables and consistency

CSS variables live in **Site Settings > Custom Code** as a `<style>` block, AND as a copy paste header in every page's Custom CSS as a fallback. This way colors and font stacks are consistent. Variables are in Section 14.1.

### 10.5 Backup and version control

GHL has no git. Mitigation:
1. Maintain a local repository (a folder or actual git repo) of every page's HTML and CSS as `.txt` or `.html` files.
2. File naming: `home.html`, `home.css`, `service-grading.html`, `service-grading.css`, etc.
3. Update the repo before every paste into GHL. Date the commit message.
4. Export GHL pages occasionally via the funnel/website export feature where available.
5. Schema JSON-LD lives in the same repo per page.

### 10.6 Site-wide vs page-specific CSS

- **Site-wide** in Site Settings > Custom Code: CSS variables, font face declarations, accessibility utilities (skip link), button component, typography base.
- **Page-specific** in Page Settings > Custom CSS: hero layout, page-only sections, anything that does not repeat.

### 10.7 Redirects, 404, SEO settings

- 301 redirects: Sites > URL Redirects. Test multi-level paths after creation.
- 404 page: not officially supported. Acceptable to live with the default GHL 404 at launch. Add a Cloudflare layer later if needed.
- Per-page SEO: Page Settings > SEO. Set title, meta description, OG image, canonical.

---

## 11. CSS methodology and code standards

### 11.1 Naming convention

Prefixed BEM-light. Every class starts with `gw-`. Components use double underscore for elements:

```css
.gw-hero { /* block */ }
.gw-hero__title { /* element */ }
.gw-hero__cta { /* element */ }
.gw-hero--dark { /* modifier */ }

.gw-btn { /* component */ }
.gw-btn--primary { /* variant */ }
.gw-btn--ghost { /* variant */ }
```

### 11.2 Variable strategy

Define once in Site Settings. Reference everywhere. Variables in Section 14.1. Never hardcode a hex value inside a component.

### 11.3 Organization inside Custom CSS

Order:
1. Variable declarations (if using page-level fallback)
2. Reset/normalize
3. Typography base
4. Components (buttons, breadcrumbs, cards)
5. Section-specific styles (`.gw-hero`, `.gw-services-grid`, etc.)
6. Utilities
7. Media queries (grouped at the bottom or inside each component)

Use comments to mark each block:
```css
/* ===== GW: Hero ===== */
```

### 11.4 !important rules

Use only when GHL's default reset overrides a property. Document each `!important` with a comment:
```css
.gw-hero__title { color: var(--gw-ink) !important; /* GHL h1 default reset */ }
```

If you have more than 5 `!important`s on a page, the scoping is wrong. Refactor.

### 11.5 Reset

Scoped reset, not global. We do not want to reset GHL's menu or form. Reset only descendants of `.gw`:

```css
.gw, .gw *, .gw *::before, .gw *::after { box-sizing: border-box; }
.gw img, .gw picture, .gw video { max-width: 100%; height: auto; display: block; }
.gw h1, .gw h2, .gw h3, .gw h4, .gw p, .gw ul, .gw ol { margin: 0; }
.gw ul, .gw ol { padding: 0; list-style: none; }
.gw a { color: inherit; text-decoration: none; }
```

### 11.6 Print styles

Optional for v1. If added later, place at the bottom of site-wide CSS:
```css
@media print {
  .gw-no-print, .gw-hero__media, nav, footer { display: none !important; }
  body { background: #fff; color: #000; }
}
```

### 11.7 Specificity ceiling

Maximum specificity per rule: 2 classes plus 1 element (e.g., `.gw-hero .gw-hero__title h1`). Avoid IDs in CSS selectors. Avoid attribute selectors except for forms.

---

## 12. Pre-publish checklist

Run this on every page before clicking Publish.

### 12.1 Code quality
- [ ] All custom classes prefixed `gw-`
- [ ] No bare element selectors in page-level CSS
- [ ] No more than 5 `!important` declarations
- [ ] All HTML wrapped in a single `<div class="gw">` root scope
- [ ] No inline styles except for pixel-level overrides flagged by comment
- [ ] CSS validates (no unclosed braces)

### 12.2 Speed
- [ ] PSI mobile ≥ 75 (target 85+)
- [ ] PSI desktop ≥ 90
- [ ] LCP ≤ 2.5s mobile (target ≤ 2.0s)
- [ ] CLS ≤ 0.05
- [ ] INP ≤ 200ms (target ≤ 100ms)
- [ ] LCP image preloaded with `fetchpriority="high"`
- [ ] No `@import` in CSS
- [ ] All fonts loaded via `<link>` in header tracking
- [ ] Below-fold images use `loading="lazy"`

### 12.3 SEO
- [ ] Title tag 50 to 60 characters with city and brand
- [ ] Meta description 150 to 160 characters with CTA
- [ ] One H1 with primary keyword
- [ ] Logical H2 to H6 hierarchy
- [ ] Self-referencing canonical set
- [ ] OG and Twitter card tags present
- [ ] Image alt text on every content image
- [ ] Decorative images use `alt=""`
- [ ] Internal links to 3 to 6 related pages
- [ ] Page in sitemap.xml

### 12.4 AEO
- [ ] First section opens with a 40 to 75 word direct answer
- [ ] At least 2 question-format H2s
- [ ] Specific numbers, prices, or timeframes in body
- [ ] Service or LocalBusiness schema in header tracking
- [ ] BreadcrumbList schema present (non-home pages)
- [ ] FAQ block on `/faq/` only, with FAQPage schema

### 12.5 Accessibility
- [ ] Color contrast verified (4.5:1 body, 3:1 large)
- [ ] Skip link present and works
- [ ] All interactive elements keyboard reachable
- [ ] Visible focus styles
- [ ] Semantic landmarks (`<main>`, `<nav>`, `<footer>`)
- [ ] All images have alt or `alt=""`

### 12.6 Mobile
- [ ] Tested on real iPhone Safari
- [ ] Tested on real Android Chrome
- [ ] No horizontal scroll
- [ ] Touch targets ≥ 48px
- [ ] Hero readable without zooming
- [ ] Click-to-call works

### 12.7 Cross-browser
- [ ] Chrome desktop and mobile
- [ ] Safari desktop and iOS
- [ ] Firefox desktop
- [ ] Edge desktop

### 12.8 GHL-specific
- [ ] Renders correctly in builder preview
- [ ] Renders correctly on live URL (always re-test live, not just preview)
- [ ] Renders correctly in mobile builder preview
- [ ] No `c-custom-code` style leaks
- [ ] GHL form below the custom HTML still submits
- [ ] GHL menu above the custom HTML still works (no z-index or overflow conflicts)
- [ ] Schema validates in Google Rich Results Test
- [ ] Tracking code re-pasted if page was duplicated

### 12.9 Internal links
- [ ] Every link target loads (no 404s)
- [ ] Anchor text is descriptive (no "click here")
- [ ] Cross-links to related service or industry pages present
- [ ] Breadcrumb links match current URL hierarchy
- [ ] Footer site map up to date

---

## 13. Common mistakes and antipatterns

### 13.1 Inline styles on every element
Bad because it kills cascade, can't be themed, doubles file size, and clashes with GHL's own inline styles. Use classes plus CSS variables.

### 13.2 Generic class names
`.row`, `.container`, `.section`, `.btn`, `.card` collide with GHL and Bootstrap-derived utilities. Always use the `gw-` prefix.

### 13.3 Loading 6+ font weights
Each weight is 15 to 25KB. Six weights blow the font budget and slow LCP. Limit to 4 files total (2 display + 2 body).

### 13.4 Uncompressed images
A 4MB hero is a guaranteed LCP failure. Pre-compress to WebP at q=80, use Unsplash with `q=75&w=1600`, never ship the source file from a phone or DSLR direct.

### 13.5 Missing alt text
Either describe the image or use `alt=""`. Never omit the attribute. Both screen readers and AI image understanding penalize missing alt.

### 13.6 Broken mobile layouts
The number one cause is fixed pixel widths and unscoped horizontal padding. Use `max-width: 100%`, `width: 100%`, `padding: 0 clamp(16px, 4vw, 32px)`. Test on a real phone.

### 13.7 AI-style copy
Showing instead of telling beats the reverse. "We grade pads in 1 to 3 days" is real. "We unlock seamless excavation solutions" is AI slop. Numbers, materials, equipment names, locations, timelines.

### 13.8 Generic stock photos
Smiling models in clean hi-vis read fake to anyone in the trade. Use real equipment, real dust, real boots, real Northern California terrain.

### 13.9 Missing schema
A contractor site without LocalBusiness/GeneralContractor schema is invisible to AI engines. Schema is non-negotiable; every page gets at least breadcrumbs plus the appropriate type.

### 13.10 Heading skip levels
H2 to H4 with no H3 confuses screen readers and AI extractors. Always descend in order.

### 13.11 Bloated CSS
Page CSS over 50KB is a smell. Reuse via variables and components. Delete dead rules. One page rarely needs more than 25KB of custom CSS.

### 13.12 Sticky hero CTAs
GHL sticky positioning works in preview but often fails on live. Avoid `position: sticky` unless tested on the live URL.

### 13.13 JSON-LD in body Custom HTML
Stripped or ignored. Always in header tracking or via the native Schema Markup Generator.

### 13.14 Forgetting to re-paste tracking code after duplicating a page
GHL does not copy tracking code with a page duplicate. Every duplicate needs schema and OG tags re-pasted.

### 13.15 Lazy-loading the LCP image
17% of mobile sites do this. It is the single biggest avoidable LCP failure. Hero images get `loading="eager"` and `fetchpriority="high"`.

---

## 14. Reusable templates and snippets

### 14.1 CSS variables (paste in Site Settings > Custom Code as a `<style>` block, plus duplicate at top of each page's Custom CSS as a fallback)

```css
:root {
  /* Color */
  --gw-paper: #F7F5F0;
  --gw-ink: #1C1A17;
  --gw-clay: #B85838;
  --gw-clay-dark: #9E4426;
  --gw-tint: #F0E4D6;
  --gw-slate: #3D4A52;
  --gw-success: #3F7A4E;
  --gw-warning: #B8731B;
  --gw-error: #A8281C;

  /* Type */
  --gw-font-display: 'Big Shoulders Display', 'Arial Narrow', 'Helvetica Neue Condensed', sans-serif;
  --gw-font-body: 'Public Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;

  /* Scale */
  --gw-h1: clamp(2rem, 1.4rem + 3vw, 3.75rem);
  --gw-h2: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
  --gw-h3: clamp(1.25rem, 1.1rem + 0.7vw, 1.75rem);
  --gw-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --gw-small: 0.875rem;

  /* Space */
  --gw-gutter: clamp(16px, 4vw, 32px);
  --gw-section-y: clamp(48px, 8vw, 96px);
  --gw-radius: 6px;
  --gw-max: 1200px;
}
```

### 14.2 Scoped reset and typography base

```css
.gw, .gw *, .gw *::before, .gw *::after { box-sizing: border-box; }
.gw img, .gw picture, .gw video { max-width: 100%; height: auto; display: block; }
.gw h1, .gw h2, .gw h3, .gw h4, .gw p, .gw ul, .gw ol, .gw figure { margin: 0; }
.gw ul, .gw ol { padding: 0; list-style: none; }
.gw a { color: var(--gw-clay-dark); text-decoration: underline; text-underline-offset: 3px; }
.gw a:hover { color: var(--gw-ink); }

.gw {
  font-family: var(--gw-font-body);
  font-size: var(--gw-body);
  line-height: 1.6;
  color: var(--gw-ink);
  background: var(--gw-paper);
}

.gw h1, .gw h2, .gw .gw-display {
  font-family: var(--gw-font-display);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  line-height: 1.05;
  color: var(--gw-ink);
}
.gw h1 { font-size: var(--gw-h1); }
.gw h2 { font-size: var(--gw-h2); }
.gw h3 { font-family: var(--gw-font-body); font-weight: 600; font-size: var(--gw-h3); line-height: 1.2; }

.gw .gw-eyebrow {
  font-family: var(--gw-font-display);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gw-clay-dark);
}

.gw .gw-container { max-width: var(--gw-max); margin: 0 auto; padding: 0 var(--gw-gutter); }
.gw .gw-section { padding: var(--gw-section-y) 0; }

.gw a:focus-visible, .gw button:focus-visible, .gw .gw-btn:focus-visible {
  outline: 2px solid var(--gw-clay);
  outline-offset: 3px;
}
```

### 14.3 Button component

```css
.gw-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 48px; padding: 12px 24px;
  font-family: var(--gw-font-display); font-weight: 700;
  font-size: 1rem; letter-spacing: 0.06em; text-transform: uppercase;
  border-radius: var(--gw-radius); border: 2px solid transparent;
  text-decoration: none; cursor: pointer;
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
}
.gw-btn--primary { background: var(--gw-clay); color: #fff; border-color: var(--gw-clay); }
.gw-btn--primary:hover { background: var(--gw-clay-dark); border-color: var(--gw-clay-dark); }
.gw-btn--ghost { background: transparent; color: var(--gw-ink); border-color: var(--gw-ink); }
.gw-btn--ghost:hover { background: var(--gw-ink); color: var(--gw-paper); }
.gw-btn--light { background: var(--gw-paper); color: var(--gw-ink); border-color: var(--gw-paper); }
.gw-btn--light:hover { background: var(--gw-tint); border-color: var(--gw-tint); }
```

```html
<a class="gw-btn gw-btn--primary" href="/contact/">Get a free estimate</a>
<a class="gw-btn gw-btn--ghost" href="/services/">See our services</a>
```

### 14.4 Responsive image with aspect ratio and lazy loading

```html
<figure class="gw-figure">
  <img
    src="https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1200&q=75"
    srcset="https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=600&q=75 600w,
            https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1200&q=75 1200w,
            https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1600&q=75 1600w"
    sizes="(min-width: 900px) 50vw, 100vw"
    width="1200" height="800"
    alt="Mini excavator backfilling a foundation in Loomis, CA."
    loading="lazy" decoding="async">
  <figcaption class="gw-figure__cap">Backfill on a residential foundation, Loomis.</figcaption>
</figure>
```

```css
.gw-figure img { width: 100%; height: auto; aspect-ratio: 3 / 2; object-fit: cover; border-radius: var(--gw-radius); }
.gw-figure__cap { font-size: var(--gw-small); color: var(--gw-slate); margin-top: 8px; }
```

### 14.5 Section header pattern (eyebrow + H2 + supporting text)

```html
<header class="gw-section-head">
  <p class="gw-eyebrow">What we do</p>
  <h2>Site work that lets the next trade start clean.</h2>
  <p class="gw-section-head__lede">Excavation, grading, and trenching across Greater Sacramento and Placer County.</p>
</header>
```

```css
.gw-section-head { max-width: 720px; margin: 0 auto var(--gw-gutter); text-align: left; }
.gw-section-head h2 { margin: 8px 0 16px; }
.gw-section-head__lede { color: var(--gw-slate); font-size: 1.125rem; }
```

### 14.6 Stat tile (trust strip)

```html
<ul class="gw-stats">
  <li class="gw-stat"><span class="gw-stat__num">15+</span><span class="gw-stat__label">Years in business</span></li>
  <li class="gw-stat"><span class="gw-stat__num">600+</span><span class="gw-stat__label">Projects completed</span></li>
  <li class="gw-stat"><span class="gw-stat__num">CSLB</span><span class="gw-stat__label">License #XXXXXX</span></li>
  <li class="gw-stat"><span class="gw-stat__num">7</span><span class="gw-stat__label">Counties served</span></li>
</ul>
```

```css
.gw-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (min-width: 700px) { .gw-stats { grid-template-columns: repeat(4, 1fr); } }
.gw-stat { background: var(--gw-tint); padding: 24px; border-radius: var(--gw-radius); text-align: center; }
.gw-stat__num { display: block; font-family: var(--gw-font-display); font-weight: 800; font-size: clamp(2rem, 1.5rem + 2vw, 3rem); color: var(--gw-clay-dark); line-height: 1; }
.gw-stat__label { display: block; margin-top: 8px; font-size: var(--gw-small); color: var(--gw-ink); text-transform: uppercase; letter-spacing: 0.08em; }
```

### 14.7 CTA strip (place above the GHL contact form)

```html
<section class="gw-cta-strip">
  <div class="gw-container gw-cta-strip__inner">
    <div>
      <p class="gw-eyebrow">Next step</p>
      <h2>Tell us about your site.</h2>
      <p>Send the address and a few photos. We'll come walk it.</p>
    </div>
    <div class="gw-cta-strip__actions">
      <a class="gw-btn gw-btn--primary" href="tel:+19165550100">Call (916) 555-0100</a>
      <a class="gw-btn gw-btn--ghost" href="#estimate">Use the form</a>
    </div>
  </div>
</section>
```

```css
.gw-cta-strip { background: var(--gw-ink); color: var(--gw-paper); padding: var(--gw-section-y) 0; }
.gw-cta-strip h2, .gw-cta-strip .gw-eyebrow { color: var(--gw-paper); }
.gw-cta-strip .gw-eyebrow { color: var(--gw-clay); }
.gw-cta-strip__inner { display: grid; gap: 24px; align-items: center; }
@media (min-width: 800px) { .gw-cta-strip__inner { grid-template-columns: 1fr auto; } }
.gw-cta-strip__actions { display: flex; flex-wrap: wrap; gap: 12px; }
.gw-cta-strip .gw-btn--ghost { color: var(--gw-paper); border-color: var(--gw-paper); }
.gw-cta-strip .gw-btn--ghost:hover { background: var(--gw-paper); color: var(--gw-ink); }
```

### 14.8 Breadcrumbs (HTML + schema)

HTML in the page body (top of `<main>`):
```html
<nav class="gw-breadcrumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services/">Services</a></li>
    <li aria-current="page">Pool Excavation</li>
  </ol>
</nav>
```

```css
.gw-breadcrumbs ol { display: flex; flex-wrap: wrap; gap: 8px; font-size: var(--gw-small); color: var(--gw-slate); }
.gw-breadcrumbs li + li::before { content: "/"; margin-right: 8px; color: var(--gw-slate); }
.gw-breadcrumbs a { color: var(--gw-slate); }
.gw-breadcrumbs a:hover { color: var(--gw-clay-dark); }
```

JSON-LD in page header tracking:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Home","item":"https://groundworknorcal.com/"},
    {"@type":"ListItem","position":2,"name":"Services","item":"https://groundworknorcal.com/services/"},
    {"@type":"ListItem","position":3,"name":"Pool Excavation","item":"https://groundworknorcal.com/services/pool-excavation/"}
  ]
}
</script>
```

### 14.9 LocalBusiness (GeneralContractor) schema (sitewide, in Site Settings > Custom Code)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": "https://groundworknorcal.com/#business",
  "name": "Groundwork Solutions",
  "alternateName": "Groundwork Solutions LLC",
  "image": "https://groundworknorcal.com/og/logo.png",
  "logo": "https://groundworknorcal.com/og/logo.png",
  "url": "https://groundworknorcal.com/",
  "telephone": "+1-916-555-0100",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rocklin",
    "addressRegion": "CA",
    "postalCode": "95677",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 38.7907,
    "longitude": -121.2358
  },
  "areaServed": [
    {"@type":"City","name":"Rocklin"},
    {"@type":"City","name":"Roseville"},
    {"@type":"City","name":"Lincoln"},
    {"@type":"City","name":"Loomis"},
    {"@type":"City","name":"Granite Bay"},
    {"@type":"City","name":"Folsom"},
    {"@type":"City","name":"Auburn"},
    {"@type":"City","name":"Sacramento"}
  ],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {"@type":"GeoCoordinates","latitude":38.7907,"longitude":-121.2358},
    "geoRadius": "60000"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "07:00",
    "closes": "17:00"
  }],
  "founder": {"@type":"Person","name":"Edward Ursulescu","alternateName":"Dardi Ursulescu","jobTitle":"Owner"},
  "knowsAbout": ["Site preparation","Grading","Trenching","Excavation","Demolition","Land clearing","Pool excavation","Septic excavation","Utility installation"],
  "sameAs": [
    "https://www.facebook.com/groundworknorcal",
    "https://www.instagram.com/groundworknorcal"
  ]
}
</script>
```

### 14.10 Service schema (per service page, in page header tracking)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Pool Excavation",
  "name": "Pool Excavation in Greater Sacramento, CA",
  "description": "Excavation, dirt haul-off, and rough grading for in-ground swimming pools across Greater Sacramento and Placer County.",
  "provider": {"@id":"https://groundworknorcal.com/#business"},
  "areaServed": [
    {"@type":"City","name":"Rocklin"},
    {"@type":"City","name":"Roseville"},
    {"@type":"City","name":"Granite Bay"},
    {"@type":"City","name":"Folsom"},
    {"@type":"City","name":"Sacramento"}
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Pool Excavation Services",
    "itemListElement": [
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Pool dig and shape"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Spoil haul-off"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Rough grade and backfill"}},
      {"@type":"Offer","itemOffered":{"@type":"Service","name":"Access protection"}}
    ]
  }
}
</script>
```

### 14.11 FAQPage schema (only on `/faq/`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does excavation cost in the Sacramento area?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Excavation in the Sacramento area typically runs $50 to $200 per cubic yard. Most residential projects land between $2,400 and $12,000. Cost depends on soil type, depth, access, and haul-off distance."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need a permit to excavate in Placer County?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most excavation deeper than five feet, work in the public right-of-way, or grading over 50 cubic yards requires a permit through Placer County Community Development. We pull or coordinate the permit on every job that needs one."
      }
    }
  ]
}
</script>
```

### 14.12 Open Graph and Twitter Card (per page header tracking)

```html
<meta property="og:title" content="Pool Excavation in Greater Sacramento | Groundwork Solutions">
<meta property="og:description" content="Pool digs, haul-off, and rough grade across Sacramento, Placer County, and Northern California.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://groundworknorcal.com/services/pool-excavation/">
<meta property="og:image" content="https://groundworknorcal.com/og/pool-excavation-1200x630.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Excavator shaping a residential pool dig in Granite Bay, CA.">
<meta property="og:site_name" content="Groundwork Solutions">
<meta property="og:locale" content="en_US">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Pool Excavation in Greater Sacramento | Groundwork Solutions">
<meta name="twitter:description" content="Pool digs, haul-off, and rough grade across Sacramento and Placer County.">
<meta name="twitter:image" content="https://groundworknorcal.com/og/pool-excavation-1200x675.jpg">
<meta name="twitter:image:alt" content="Excavator shaping a residential pool dig.">
```

### 14.13 llms.txt template (optional, place at /llms.txt; low expected ROI per Section 6.6)

```
# Groundwork Solutions
> Excavation, grading, trenching, and site preparation across Greater Sacramento, Placer County, and Northern California. Owner: Edward "Dardi" Ursulescu. Based in Rocklin, CA. CSLB licensed.

## Services
- [Site Preparation](https://groundworknorcal.com/services/site-preparation/): Pad prep, soil work, and site readiness for the next trade.
- [Grading](https://groundworknorcal.com/services/grading/): Rough and finish grading for residential and commercial sites.
- [Trenching & Utilities](https://groundworknorcal.com/services/trenching/): Trench digging for water, sewer, electric, and gas lines.
- [Excavation](https://groundworknorcal.com/services/excavation/): Foundation, basement, and bulk excavation.
- [Demolition](https://groundworknorcal.com/services/demolition/): Structure removal and haul-off.
- [Land Clearing](https://groundworknorcal.com/services/land-clearing/): Brush, tree, and stump removal.
- [Pool Excavation](https://groundworknorcal.com/services/pool-excavation/): Pool digs, haul-off, and rough grade.
- [Septic & Drainage](https://groundworknorcal.com/services/septic-drainage/): Septic excavation and surface drainage work.

## Industries
- [General Contractors](https://groundworknorcal.com/who-we-work-with/general-contractors/)
- [Pool Builders](https://groundworknorcal.com/who-we-work-with/pool-builders/)
- [Home Builders](https://groundworknorcal.com/who-we-work-with/home-builders/)
- [Landscape Contractors](https://groundworknorcal.com/who-we-work-with/landscape-contractors/)
- [Property Developers](https://groundworknorcal.com/who-we-work-with/property-developers/)
- [Septic Installers](https://groundworknorcal.com/who-we-work-with/septic-installers/)
- [Wineries & Vineyards](https://groundworknorcal.com/who-we-work-with/winery-vineyard/)

## Contact
- [Contact](https://groundworknorcal.com/contact/)
- Phone: (916) 555-0100
- Service area: Rocklin, Roseville, Lincoln, Loomis, Granite Bay, Folsom, Auburn, Sacramento
```

### 14.14 Page header tracking template (per page)

```html
<!-- Title and meta -->
<meta name="description" content="[150 to 160 char meta]">
<link rel="canonical" href="https://groundworknorcal.com/[slug]/">

<!-- Open Graph and Twitter (from 14.12) -->
[paste 14.12 with page-specific values]

<!-- Hero image preconnect and preload -->
<link rel="preconnect" href="https://images.unsplash.com" crossorigin>
<link rel="preload" as="image"
  href="[hero 1600 url]"
  imagesrcset="[800w], [1200w], [1600w], [2400w]"
  imagesizes="100vw" fetchpriority="high">

<!-- Schema -->
[BreadcrumbList from 14.8]
[Service schema from 14.10 if a service page]
```

### 14.15 Page CSS template (paste at top of every Page Settings > Custom CSS)

```css
/* ===== GW: Page CSS template ===== */
/* Variable fallback (also defined site-wide) */
:root {
  --gw-paper:#F7F5F0; --gw-ink:#1C1A17; --gw-clay:#B85838;
  --gw-clay-dark:#9E4426; --gw-tint:#F0E4D6; --gw-slate:#3D4A52;
}

/* Scoped reset (from 14.2 - omit if site-wide already loaded) */

/* Page-specific sections below */
/* ===== GW: Hero ===== */
.gw-hero { /* ... */ }

/* ===== GW: Services grid ===== */
.gw-services-grid { /* ... */ }

/* ===== GW: Cross-link strip ===== */
.gw-crosslinks { /* ... */ }
```

---

## How to use this document when prompting individual page builds

When you're ready to build a specific page, reference this document by section:

> "Build the Pool Excavation service page following Master Reference Sections 1, 5, 6, 8, 11, 14. Hero photo: [Unsplash URL]. Three related industries: Pool Builders, Home Builders, Landscape Contractors. Three related services: Site Preparation, Grading, Trenching."

That single line plus this document is enough context to produce a page that fits the system. Every page reuses the variables in 14.1, the reset in 14.2, the buttons in 14.3, the section header in 14.5, and the CTA strip in 14.7. Service-specific HTML and CSS goes between.

Build the home page first to lock the visual language. Every subsequent page reuses the proven components and only changes content.