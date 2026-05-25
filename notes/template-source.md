# Template Source Notes

## What's in `drops/`

Existing template files from the user's "Groundwork" excavation brand, built originally for GoHighLevel (GHL) but actually clean static HTML with no GHL injection. We're rebuilding as a static-site template that gets parameterized per business.

**HTML files** (pages of the Groundwork site, single-business):
- `groundwork-home.html` — main homepage with all sections
- `homepage-part1-body.html` + `homepage-part2-footer.html` — split version of same homepage
- `about-page.html`, `contact.html`, `services-overview.html`, `services-utility-trenching.html`, `industries-general-contractors.html`, `who-we-work-with-overview.html`, `privacy.html`, `terms.html`

**Spec markdown files:**
- `02-Brandbook.md` — palette, typography, logo spec
- `03-Menu-and-Footer-Standards.md` — nav and footer structure
- `05-Content-Style-Guide.md` — voice, banned words, sentence/paragraph length
- `07-SEO-Meta-and-Schema.md` — title/desc patterns + JSON-LD requirements
- `08-Page-Prompt-Templates.md` — section-by-section copy patterns

## What carries over to our 1000-business template

**Brand visual system (LOCKED across all pages):**
- Palette: Paper `#F7F5F0`, Ink `#1C1A17`, Clay `#B85838`, Clay Dark `#9E4426`, Tint `#F0E4D6`, Slate `#3D4A52`, Ink-2 `#5A544C`
- Fonts: `Big Shoulders Display` 700/800 for headings (Google Fonts), `Public Sans` 400/600 for body
- Class prefix: `.gw-*` (kept as-is, avoids future collisions)

**Section structure (per business):**
1. Sticky header (logo as text = business name, phone CTA)
2. Hero — H1 `Excavation in {city}, {state_code}` + subhead + CTAs + hero image
3. Trust strip — Licensed, Insured, 24-Hour Quotes, Owner-Operated (use static defaults; no per-biz license # available in CSV)
4. Services grid — pulled from `subtypes` column, fallback to 8 default excavation services
5. Why us — 3 columns (Show Up On Time, Clean Hand-Off, No Surprise Bills)
6. Reviews — rating + count from CSV, "Be one of our first reviews" CTA since no text reviews available
7. How we work — 3 steps
8. Final CTA — phone + (decorative) quote form
9. Footer

**DROPPED (Groundwork-specific):**
- "Edward Dardi Ursulescu" owner name
- "530-559-8502" phone, Sacramento area cities, Rocklin address
- Groundwork social media URLs
- License number `[VERIFY]` placeholders

## Voice rules (apply to all generated copy)

- Banned words: delve, leverage, robust, comprehensive, seamless, elevate, unlock, navigate, harness, foster, paramount, plethora, myriad, streamline, empower, cutting-edge, world-class, best-in-class, game-changer, solutions, utilize, commence, terminate, facilitate, optimize.
- Banned punctuation: em-dashes (use period or comma), excessive ellipses.
- Sentences ≤ 20 words. Paragraphs ≤ 3 sentences.
- Numbers beat adjectives. Contractor-to-contractor tone.

## Form

Decorative only (no backend). Visible fields, "Get Free Quote" button. Clicking shows a success message via inline JS, no POST. Fields: first name, last name, email, phone, project type (dropdown), notes.

## Images

Original uses Unsplash CDN — keep that. Each business gets the same hero/service photos (we don't have per-business photos in CSV).
