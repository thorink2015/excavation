# Groundwork Solutions: Brandbook

Visual identity rules for groundworknorcal.com and every brand asset.

---

## 1. Brand position in one line

Site prep crew that shows up, hits grade, and leaves the next trade a clean lot.

---

## 2. Logo

Logo is in progress (delivered next day per brand brief). When it arrives:

**Format:** SVG primary, PNG fallback at 2x, 1x, and favicon sizes (32x32, 48x48, 192x192, 512x512).

**Sizing:**
- Header / nav: 36 to 48px tall
- Footer: 48 to 64px tall
- Favicon: 32x32
- OG image lockup: 1200x630 with logo at 200px tall, centered or left-aligned

**Clear space:** Equal to the cap height of the wordmark on all four sides. Nothing inside that space.

**Color variants needed:**
- Full color on paper (default)
- White on dark / on clay (for ink and clay backgrounds)
- Single color black (for fax, print, and one-color situations)

**Don't:**
- Don't stretch, skew, or rotate
- Don't change the colors
- Don't add drop shadows, glows, or strokes
- Don't put on a busy photo without a darkened overlay underneath
- Don't rasterize when an SVG is available

---

## 3. Color palette

All values verified for WCAG contrast. See Master Reference Guide section 7.3 for ratios.

### Primary palette

| Name | Hex | RGB | Use |
|---|---|---|---|
| Paper | `#F7F5F0` | 247, 245, 240 | Background, body backdrop |
| Ink | `#1C1A17` | 28, 26, 23 | Body text, headings |
| Clay | `#B85838` | 184, 88, 56 | Buttons, large headings, brand accent |
| Clay Dark | `#9E4426` | 158, 68, 38 | Inline links, small accent text |
| Tint | `#F0E4D6` | 240, 228, 214 | Section fills, card backgrounds |
| Slate | `#3D4A52` | 61, 74, 82 | Icons, dividers, dark sections |

### Status palette

| Name | Hex | Use |
|---|---|---|
| Success | `#3F7A4E` | Form success, confirmations |
| Warning | `#B8731B` | Notices, caution |
| Error | `#A8281C` | Form errors, validation |

### Color rules (hard)

- Body text is always Ink on Paper
- Inline links in body copy use Clay Dark, never Clay (Clay fails AA at body size)
- Headings 24px+ regular or 18.66px+ bold can use Clay
- Buttons: solid Clay fill with white labels (passes AA)
- Never put Ink labels on Clay (fails AA)
- Tint is decorative only, never used for text
- Slate is the secondary for icon strokes, dividers, footer backgrounds

### CSS variables (locked)

```css
:root {
  --gw-paper: #F7F5F0;
  --gw-ink: #1C1A17;
  --gw-clay: #B85838;
  --gw-clay-dark: #9E4426;
  --gw-tint: #F0E4D6;
  --gw-slate: #3D4A52;
  --gw-success: #3F7A4E;
  --gw-warning: #B8731B;
  --gw-error: #A8281C;
}
```

---

## 4. Typography

### Font families

**Display: Big Shoulders Display**
- Weights: 700, 800
- Use: H1, H2, hero numbers, eyebrows in ALL CAPS, button labels, stat numbers
- Source: Google Fonts

**Body: Public Sans**
- Weights: 400, 600
- Use: body copy, nav, forms, captions, H3, H4
- Source: Google Fonts

**Total font files: 4.** Latin subset only. No third family unless approved.

### Type scale (fluid via clamp)

```css
--gw-h1: clamp(2rem, 1.4rem + 3vw, 3.75rem);     /* 32 to 60px */
--gw-h2: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);  /* 24 to 40px */
--gw-h3: clamp(1.25rem, 1.1rem + 0.7vw, 1.75rem); /* 20 to 28px */
--gw-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16 to 18px */
--gw-small: 0.875rem;  /* 14px */
```

### Typography rules

- Body line height: 1.6
- Heading line height: 1.05 to 1.2
- Heading letter-spacing: 0.01em (Big Shoulders is already condensed, doesn't need much)
- Eyebrow letter-spacing: 0.12em (loose), uppercase, weight 700, size 14px
- Headings always in sentence case OR ALL CAPS, never Title Case
- Body text max-width: 70 characters per line for readability
- No drop caps, no italics on headings, no underlines on body text except inside links

### Loading

In site-level Header Tracking Code:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800&family=Public+Sans:wght@400;600&display=swap">
```

---

## 5. Layout and spacing

### Spatial system

8px base grid. All spacing is a multiple of 8.

```css
--gw-space-1: 8px;
--gw-space-2: 16px;
--gw-space-3: 24px;
--gw-space-4: 32px;
--gw-space-5: 40px;
--gw-space-6: 48px;
--gw-space-7: 64px;
--gw-space-8: 96px;
```

### Section padding

Vertical padding between major sections:

```css
--gw-section-y: clamp(48px, 8vw, 96px);
```

Horizontal gutter:

```css
--gw-gutter: clamp(16px, 4vw, 32px);
```

### Container widths

```css
--gw-max: 1200px;       /* default content max */
--gw-max-narrow: 720px; /* prose, lead paragraphs */
--gw-max-wide: 1440px;  /* hero only, where needed */
```

### Border radius

```css
--gw-radius-sm: 4px;  /* small UI: tags, badges */
--gw-radius: 6px;     /* default: buttons, cards */
--gw-radius-lg: 12px; /* hero images, big cards */
```

Use radius sparingly. Construction brand reads sharper with right angles than soft ones.

---

## 6. Photography direction

### Use these subjects

- Equipment in action mid-motion, dust visible
- Tight detail shots: bucket teeth, tracks, hydraulic rams, work boots, gloved hands on controls
- Site context: stakes, trenches, graded pads, finished work
- Crew shots with real PPE, hands on controls, faces secondary
- Northern California cues: golden hills, oaks, granite outcrops, vineyard rows, foothill light

### Avoid these subjects

- Suit-and-handshake stock
- Smiling models in clean hi-vis posing with clipboards
- CGI buildings, cartoon mascots, indoor laptop shots
- Group huddles around a tablet (the cliché stock construction shot)
- Drone shots that don't show the work clearly

### Tone of the photo grade

- Warm-leaning, not cool blue
- Golden hour or overcast light, not harsh midday
- Slight grain is fine, plastic gloss is not
- Real dust, real mud, real wear

### Sourcing order of preference

1. Real Groundwork crew on real Groundwork jobs (priority once jobs are running)
2. One half-day local photographer session at a working site
3. ImageKit or Squoosh-compressed Unsplash hot-links during launch
4. Paid stock as last resort (Adobe Stock or Shutterstock with construction filter)

### Unsplash search terms that work

`excavator dirt`, `skid steer`, `bulldozer dust`, `graded dirt pad`, `trench excavation`, `decomposed granite`, `california foothills`, `construction worker boots`, `surveyor stakes`, `hydraulic breaker`, `concrete demolition`

### Image specs

| Use | Dimensions | Target file size (AVIF/WebP) |
|---|---|---|
| Desktop hero | 1920x1080 to 2400x1350 | 150 to 250 KB |
| Mobile hero | 800x1200 (portrait crop) | 80 to 120 KB |
| Section feature | 1200x800 | 60 to 120 KB |
| Card thumbnail | 600x400 | 25 to 60 KB |
| Team / owner | 600x600 | 30 to 60 KB |
| OG image | 1200x630 | < 100 KB |

Total page weight under 1.5 MB. Above-the-fold combined under 300 KB.

### Alt text rules

- 8 to 15 words
- Describe what's in the photo and why it matters in context
- Front-load the important detail
- End with a period
- Decorative images get `alt=""` (never omit the attribute)
- No "image of" or "picture of"
- Keywords are fine if natural, never stuffed

**Good:** `Mini excavator backfilling a residential foundation in Loomis, California.`

**Bad:** `excavation Sacramento Roseville Rocklin grading dirt work contractor`

---

## 7. Voice and tone

Full writing rules in the Content Style Guide. Brand-level summary:

**Voice:** Contractor-to-contractor. Direct. Confident without bragging. Plain English over jargon.

**Tone shifts by context:**
- Headlines and hero: punchy, opinionated
- Service pages: practical, specific (numbers, materials, machines)
- Industry pages: empathetic to that trade's headaches
- About: human, owner-led
- Forms and CTAs: short, no pressure

**Banned words (these signal AI or corporate slop):**
- delve, leverage, robust, comprehensive solution, seamless, elevate, unlock, navigate, in today's fast-paced world, harness, foster, paramount, plethora, myriad

**Banned punctuation:**
- Em-dashes
- Double hyphens (used as em-dash substitute)
- Excessive ellipses

Use commas, periods, colons, semicolons, parentheses. Keep sentences short.

---

## 8. Iconography

Full icon spec is in the separate Icon Set Spec doc. Brand-level rules:

- Inline SVG only, no icon font
- Stroke style: 2px stroke, square line cap, round joins
- 24x24 default size, 16x16 small, 32x32 large
- Color via `currentColor` so they inherit text color
- One visual style across the site (no mixing outline and filled in the same context)
- Service and industry icons live in the same family

---

## 9. UI patterns

### Buttons

Three variants only:

**Primary:** Clay fill, white label, used for the strongest CTA per section. Max one primary per visual region.

**Ghost:** Transparent fill, Ink border and label. Used for secondary actions next to a primary.

**Light:** Paper fill, Ink label. Used on dark sections (Ink, Slate).

All buttons:
- Min height 48px
- Min width 48px
- Padding: 12px 24px
- Font: Big Shoulders Display 700, 16px, ALL CAPS, letter-spacing 0.06em
- Border radius: 6px
- Transition: 150ms ease on background, color, border

Full button CSS in Master Reference section 14.3.

### Cards

- Background: Tint (`#F0E4D6`) or Paper with 1px Slate border
- Padding: 24 to 32px
- Border radius: 6px
- No shadow (industrial brand reads better flat than lifted)
- Heading: H3 size, Public Sans 600
- Body: regular body size, Ink on Tint or Paper

### Forms

GHL native form. Style around it, not into it (can't reach inside the iframe with CSS).

For surrounding context:
- Section background: Paper or Tint
- Form heading: H2 size
- Lead paragraph: max 2 sentences
- Consent blocks: small text (14px), Slate color

### Dividers

- 1px solid Slate at 20% opacity, OR
- 2px solid Clay for a brand accent divider, OR
- Negative space (preferred over visible dividers)

---

## 10. Voice in microcopy

Examples of how the voice shows up in small UI text.

| Default | Groundwork |
|---|---|
| "Submit" | "Get Free Quote" |
| "Loading..." | "Sending..." |
| "Thank you for your submission" | "Got it. We'll be in touch within 24 hours." |
| "Please fill out all required fields" | "Missing a field. Take another look." |
| "An error occurred" | "That didn't go through. Try again or call 530-559-8502." |
| "Read more" | "Read the full page" or service-specific verb |
| "Click here" | (never use this) |
| "Welcome to our website" | (delete entirely; just open with the H1) |

---

## 11. Don't list (visual)

- Don't use gradients on backgrounds (one solid color per section)
- Don't use drop shadows on cards or buttons (flat reads more industrial)
- Don't use rounded corners over 12px on any element
- Don't use script or display fonts other than Big Shoulders
- Don't use stock photos of people in suits
- Don't use icons in two different styles on the same page
- Don't use more than 4 font weights total across the site
- Don't use background images for hero sections (use `<img>` for LCP)
- Don't use carousels or sliders anywhere
- Don't autoplay video

---

## 12. Application checklist (per page)

Run through this on every page before publish:

- [ ] Background uses Paper or Tint or Ink, no other colors
- [ ] H1 uses Big Shoulders Display 800
- [ ] Body text is Ink on Paper at 16 to 18px
- [ ] Inline links use Clay Dark, not Clay
- [ ] Buttons use the locked button component
- [ ] All images have descriptive alt text or `alt=""`
- [ ] No banned words in copy
- [ ] No em-dashes or double hyphens
- [ ] Spacing follows the 8px grid
- [ ] Section padding uses `--gw-section-y`
- [ ] Container max-width is `--gw-max` (1200px)
- [ ] Icons are inline SVG, currentColor, 2px stroke
- [ ] Logo (when delivered) uses correct clear space and size
