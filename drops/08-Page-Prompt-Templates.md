# Groundwork Solutions: Page Prompt Templates

Copy, fill the bracketed bits, and send. Each prompt pulls in exactly the docs needed and leaves no ambiguity.

---

## 1. Master prompt template (use as base for any page)

```
Build the [PAGE NAME] page for groundworknorcal.com.

References (use in this priority order):
1. Website copy: groundwork-website-copy.md, [SECTION NAME]
2. URL Map (01): cross-links per section [X.Y]
3. Brandbook (02): colors, type, spacing, button variants
4. Menu and Footer Standards (03): output WITHOUT footer (footer is a global section)
5. Icon Set Spec (04): inline SVGs only, currentColor, 2px stroke
6. Content Style Guide (05): voice rules, banned words, sentence patterns
7. SEO Meta and Schema (07): full head section, schema blocks per page type
8. Master Reference Guide: GHL HTML/CSS build standards
9. GHL Custom HTML and CSS Build Standards: gw- prefix, scoped CSS

Output:
- Single GHL Custom Code block, ready to paste into the page
- Full <head> meta section at top (in HTML comment so GHL can route it correctly)
- Body sections wrapped in a `.gw` root for CSS scope
- Inline `<style>` block with page-specific CSS only (sitewide vars come from global)
- Form section: empty container with comment `<!-- GHL native form goes here -->`

Hard constraints:
- No em-dashes, no double hyphens
- No banned words from Content Style Guide section 3
- No icon fonts, only inline SVG
- All internal links match the URL Map
- All images have descriptive alt text or alt=""
- Mobile-first responsive
- Buttons use the locked button component from Brandbook section 9
```

Save the above. Every page request is a small modification of it.

---

## 2. Homepage master prompt (use this one right now)

```
Build the Groundwork Solutions homepage for groundworknorcal.com using all project docs.

Pull copy from: groundwork-website-copy.md (Home section). Refine for tightness using Content Style Guide. Cut anything that does not earn its spot.

Output in TWO PARTS:

PART 1: Full homepage HTML and CSS without the footer.
Include in this order:
- Full <head> section in an HTML comment block at the top: title, meta description, keywords, robots, canonical, geo meta, Open Graph (with image), Twitter card, favicons, theme color, viewport, charset, font preconnect, fonts link, Organization JSON-LD, LocalBusiness JSON-LD, WebPage JSON-LD, FAQPage JSON-LD (if FAQ section is included)
- A logo placeholder block in the header area: comment marker `<!-- LOGO: replace src with final SVG, alt = Groundwork Solutions, width 180, height 48 -->`
- Top utility bar (matches Menu and Footer Standards section 1)
- Hero with H1, subhead, two CTA buttons, hero image with width/height attributes
- Trust strip (3 to 5 quick proof points: licensed, insured, owner-operated, 24-hour quotes, etc.)
- Services overview grid: 8 service cards with inline SVG icons from Icon Set Spec, each linking to its detail page from URL Map
- Why us section: 3 columns (Show Up On Time, Clean Hand-Off, No Surprise Bills)
- Industries strip: 7 industry cards with inline SVG icons, each linking to its detail page
- Stats bar: 3 to 4 honest stats (24-hour quotes, services count, service area, owner-operated)
- About teaser block with photo placeholder and link to /about
- How we work section: 3 to 4 steps (Quote, Schedule, Dig, Hand Off)
- FAQ accordion: 4 to 5 questions tied to the FAQPage schema in the head
- Final CTA section: H2, supporting line, two buttons (Get a Quote, Call 530-559-8502)
- Form section: section element with H2, supporting line, then `<div class="gw-form-slot"><!-- GHL native form goes here --></div>`
- Stop here. No footer.

PART 2: Footer code block (separate code file).
Use Menu and Footer Standards section 3 exactly. Output as a single Custom Code block ready to paste into the GHL global footer section. Include both the HTML and the scoped CSS.

Both parts must:
- Use the gw- CSS prefix from GHL Custom HTML and CSS Build Standards
- Wrap content in a .gw root div for CSS scope
- Use only the locked color variables from Brandbook section 3
- Use Big Shoulders Display 700/800 for headings, Public Sans 400/600 for body
- Use the locked button component (Primary Clay, Ghost, Light)
- Use the 8px spacing grid
- Pass WCAG AA contrast
- Be mobile-first responsive (mobile under 768, tablet 768 to 1024, desktop 1024+)
- Use lazy loading on every image except the hero LCP
- Set width and height on every image

Cross-links must match URL Map sections 2.1, 2.2, and 7.

Voice constraints (from Content Style Guide):
- No em-dashes, no double hyphens
- None of these words: delve, leverage, robust, comprehensive solution, seamless, elevate, unlock, navigate, in today's fast-paced world, harness, foster, paramount, plethora, myriad, streamline, empower, cutting-edge, world-class, best-in-class, game-changer, solutions (as a noun), utilize, commence, terminate, facilitate, optimize
- Numbers and specifics over adjectives
- Sentences 20 words max
- Paragraphs 3 sentences max
- One H1 only

Honesty constraints:
- No fake review counts, no fake years in business
- Use placeholder testimonials from the website copy doc with the "Want to be one of our first reviews?" line
- License number marked [VERIFY] until confirmed
```

That's the prompt. Send it as-is when you're ready to build.

---

## 3. Service detail page prompt template

```
Build the [SERVICE NAME] page for groundworknorcal.com at [URL FROM URL MAP].

Copy source: groundwork-website-copy.md, [SERVICE NAME] section. Refine for tightness.

Reference docs:
- URL Map section 2.1 ([SERVICE] industries) and 2.3 ([SERVICE] related services)
- Brandbook for visuals
- Content Style Guide voice
- SEO Meta and Schema (07): use Service schema (5.3), WebPage schema (5.5), BreadcrumbList (5.4), FAQPage if FAQ section included

Output: single Custom Code block, no footer (global), no menu (global).

Structure:
1. Full <head> meta in comment block (title, meta, OG, Twitter, canonical, JSON-LD with Service + WebPage + Breadcrumb + FAQ)
2. Breadcrumb (Home > Services > [Service Name])
3. Hero: eyebrow "Site Prep", H1, direct-answer subhead, primary CTA button, hero image
4. Direct-answer paragraph block (40 to 75 words) right under hero
5. 3 feature blocks with inline SVG icons (one sentence each)
6. H2 "What's included" with 4 to 6 bullet points
7. H2 "How much does it cost?" with 40 to 75 word direct answer + price range bullets
8. H2 "How long does it take?" with direct answer + scope examples
9. H2 "Built for these trades" with 3 to 5 industry links from URL Map 2.1
10. H2 "Related services" with 2 to 3 links from URL Map 2.3
11. CTA strip (Clay background, white text, 2 buttons)
12. Form section: H2, supporting line, GHL form slot div with comment

Cross-links:
- Industries to link: [LIST FROM URL MAP 2.1]
- Related services: [LIST FROM URL MAP 2.3]

Voice and constraints: same as homepage prompt.
```

### Pre-filled cross-link lists for each service

| Service | Industries to link | Related services |
|---|---|---|
| Excavation | General Contractors, Site & Civil, Developers, Homeowners | Rough Grading, Utility Trenching, Pool Excavation |
| Utility Trenching | Utility Contractors, General Contractors, Site & Civil, Landscape & Hardscape | Excavation, Rough Grading |
| Concrete Removal | General Contractors, Landscape & Hardscape, Homeowners, Site & Civil | Asphalt Removal, Demolition |
| Asphalt Removal | Site & Civil, Developers, General Contractors | Concrete Removal, Rough Grading |
| Site Clearing | Developers, General Contractors, Homeowners | Demolition, Rough Grading |
| Demolition | Developers, General Contractors, Homeowners, Site & Civil | Site Clearing, Concrete Removal |
| Rough Grading | General Contractors, Developers, Site & Civil, Landscape & Hardscape | Excavation, Site Clearing |
| Pool Excavation | Pool Builders, Landscape & Hardscape, Homeowners | Excavation, Rough Grading |

---

## 4. Industry detail page prompt template

```
Build the [INDUSTRY NAME] page for groundworknorcal.com at [URL FROM URL MAP].

Copy source: groundwork-website-copy.md, [INDUSTRY NAME] section. Refine for tightness.

Reference docs:
- URL Map section 2.2 ([INDUSTRY] services) and section 7
- Brandbook
- Content Style Guide
- SEO Meta and Schema (07): WebPage (5.5), BreadcrumbList (5.4), FAQPage if FAQ section included

Output: single Custom Code block, no footer (global), no menu (global).

Structure:
1. Full <head> meta in comment block (title, meta, OG, Twitter, canonical, JSON-LD)
2. Breadcrumb (Home > Who We Work With > [Industry Name])
3. Hero: eyebrow "Industries", H1, direct-answer subhead, primary CTA button, hero image
4. Direct-answer paragraph (40 to 75 words)
5. "What we handle for [industry]" bullet block (4 to 6 items)
6. H2 "Common projects we run for [industry]" with 3 short examples
7. H2 "How we work with [industry]" with 3 to 4 process points
8. H2 "Services we run for [industry]" with [N] service links from URL Map 2.2
9. FAQ section (3 to 4 questions specific to this audience)
10. CTA strip
11. Form section with GHL form slot

Cross-links:
- Services to link: [LIST FROM URL MAP 2.2]

Voice and constraints: same as homepage prompt.
```

### Pre-filled cross-link lists for each industry

| Industry | Services to link |
|---|---|
| General Contractors | Excavation, Utility Trenching, Demolition, Rough Grading, Site Clearing |
| Pool Builders | Pool Excavation, Site Clearing, Rough Grading, Concrete Removal |
| Site & Civil | Excavation, Utility Trenching, Asphalt Removal, Rough Grading, Demolition |
| Utility Contractors | Utility Trenching, Excavation, Concrete Removal |
| Landscape & Hardscape | Concrete Removal, Site Clearing, Rough Grading, Pool Excavation |
| Developers & PMs | Site Clearing, Demolition, Rough Grading, Asphalt Removal, Excavation |
| Homeowners | Excavation, Demolition, Pool Excavation, Site Clearing, Concrete Removal |

---

## 5. About page prompt

```
Build the About page for groundworknorcal.com at /about.

Copy source: groundwork-website-copy.md, About section. Owner is Edward "Dardi" Ursulescu.

Reference docs: all standard project docs.

Output: single Custom Code block, no footer (global), no menu (global).

Structure:
1. Full <head> meta with WebPage schema + Person schema for Dardi (founder)
2. Breadcrumb (Home > About)
3. Hero: H1 "About Groundwork", subhead about the business in one line, hero photo (Dardi or equipment)
4. Owner story section: 2 to 3 short paragraphs, photo on the side
5. What we believe section: 3 to 4 short principle blocks (Show up. Hit grade. Clean hand-off. No surprises.)
6. What we do section: brief services summary with link to /services
7. Service area: list of cities and counties served, optional embedded map
8. Trust strip (licensed, insured, owner-operated, [VERIFY] CSLB number)
9. CTA strip
10. Form slot

Voice constraints: extra warm and human on this page. Dardi speaks in the first person where natural. Still no banned words.
```

---

## 6. Contact page prompt

```
Build the Contact page for groundworknorcal.com at /contact.

Copy source: groundwork-website-copy.md, Contact section.

Reference docs: all standard project docs.

Output: single Custom Code block, no footer (global), no menu (global).

Structure:
1. Full <head> meta with WebPage schema + ContactPage schema
2. Breadcrumb (Home > Contact)
3. Hero: H1 "Get a Site Prep Quote", subhead, primary CTA scroll-to-form
4. 2-column layout below hero:
   - Left: Form section with H2, supporting line, GHL form slot
   - Right: Contact details column (phone, email, mailing address, hours, service area)
5. Service area block: list of cities and counties
6. Optional: embedded Google Map of the Rocklin business area (no exact address pin)
7. Below-the-fold: "What happens next" 3-step block (you submit, we review, we send a quote within 24 hours)

Form behavior notes (for GHL form configuration, not HTML):
- Submit button text: "Get Free Quote"
- Success message: "Got it. We'll be in touch within 24 hours."
- Error message: "That didn't go through. Try again or call 530-559-8502."

Voice constraints: same as homepage prompt.
```

---

## 7. Services overview page prompt

```
Build the Services overview page at /services.

Copy source: groundwork-website-copy.md, Services overview.

Output: single Custom Code block.

Structure:
1. Full <head> meta with WebPage schema and CollectionPage schema if appropriate
2. Breadcrumb (Home > Services)
3. Hero: H1 "Our Services", subhead about the breadth of work
4. Direct-answer paragraph (40 to 75 words): one paragraph summarizing all 8 services
5. Service grid: 8 cards, each with inline SVG icon, service name as H3, 1 to 2 sentence description, link to service detail page
6. Why we run all 8 in-house section (3 short value props)
7. Industries strip: brief grid linking to all 7 industry pages
8. CTA strip
9. Form slot
```

---

## 8. Industries overview page prompt

```
Build the Who We Work With overview page at /who-we-work-with.

Copy source: groundwork-website-copy.md, Who We Work With overview.

Output: single Custom Code block.

Structure:
1. Full <head> meta
2. Breadcrumb
3. Hero: H1 "Who We Work With", subhead
4. Direct-answer paragraph
5. Industry grid: 7 cards with inline SVG icons, name, 1 to 2 sentence description, link to detail page
6. Cross-link section to all 8 services
7. CTA strip
8. Form slot
```

---

## 9. Variations and modifiers

Append these phrases to any prompt above to tweak output:

- **Shorter:** `Output a tighter version: aim for 40% less copy. Cut anything not load-bearing.`
- **More technical:** `Lean technical. Add equipment names, soil types, and trade-specific terms a contractor would notice.`
- **More homeowner-friendly:** `Lean conversational. Avoid trade jargon. Explain terms inline.`
- **Add testimonials:** `Add a 2-card testimonial section between the value props and the FAQ. Use placeholder copy from the website copy doc.`
- **Add gallery:** `Add a 6-image gallery section between FAQ and final CTA. Use lazy-loaded thumbnails with width and height set, lightbox optional.`
- **Mobile preview only:** `Output only the body, no head section, optimized for a single mobile preview.`
- **Update an existing page:** `This is an update to an existing page. Preserve the structure, swap [SECTION NAME] with [NEW CONTENT].`

---

## 10. Single source of truth (always say this in your prompt)

When in doubt, append:

```
If anything in the project docs conflicts, follow this priority order:
1. URL Map (01)
2. Brandbook (02)
3. Menu and Footer Standards (03)
4. Content Style Guide (05)
5. SEO Meta and Schema (07)
6. Master Reference Guide
7. Website copy doc

Flag any conflicts in a note at the end of the output before writing the code.
```
