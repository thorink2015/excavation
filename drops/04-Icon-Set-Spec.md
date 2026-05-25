# Groundwork Solutions: Icon Set Spec

Inline SVG icon system used across the site. One visual style, drawn at one base size, color via `currentColor`.

---

## 1. Style rules

| Rule | Value |
|---|---|
| Format | Inline SVG only (no icon font, no img tags) |
| Base viewBox | `0 0 24 24` |
| Stroke width | 2px |
| Line cap | square |
| Line join | round |
| Fill | none on stroke icons; flat fill on glyph icons |
| Color | `currentColor` (inherits from parent) |
| Default render size | 24x24 |
| Small size | 16x16 |
| Large size | 32x32 |
| Decoration corners | sharp (no rounded corners on the artwork itself) |

**The look:** simple, mechanical, signage-like. Closer to road sign or industrial pictogram than to consumer-app filled icon. Matches Big Shoulders Display headlines.

**Avoid:**
- Filled gradient icons
- Drop shadows or glows
- 3D perspective
- Cute/rounded illustration style
- Mixed stroke widths within one icon
- Icons with their own color baked in (must inherit)

---

## 2. How to use icons in HTML

Always include with `aria-hidden="true"` and `focusable="false"` unless the icon is the only label for an interactive element. If it's the only label, give the parent button or link an `aria-label`.

```html
<!-- Decorative icon next to text -->
<a href="tel:+15305598502" class="gw-link">
  <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
    <path d="..."/>
  </svg>
  <span>530-559-8502</span>
</a>

<!-- Icon-only button -->
<button class="gw-icon-btn" aria-label="Close menu">
  <svg aria-hidden="true" focusable="false" ...>...</svg>
</button>
```

Set size with width/height attributes on the SVG. CSS color inherits from the parent text color.

---

## 3. Required icon set

### 3.1 Service icons (8)

One per service detail page. Used in:
- Services overview grid (24x24)
- Service detail hero (32x32)
- Footer (16x16, optional)

| Slug | Concept |
|---|---|
| `excavation` | Excavator silhouette with bucket |
| `utility-trenching` | Trench cross-section with pipe |
| `concrete-removal` | Slab with crack and breaker |
| `asphalt-removal` | Roller/asphalt chunk |
| `site-clearing` | Tree with axe or grapple |
| `demolition` | Wrecking ball or wall fragments |
| `rough-grading` | Grader blade or sloped pad |
| `pool-excavation` | Pool shape in cross-section |

### 3.2 Industry icons (7)

One per industry detail page.

| Slug | Concept |
|---|---|
| `general-contractors` | House blueprint with stud lines |
| `pool-builders` | Pool with steps |
| `site-civil` | Site plan grid |
| `utility-contractors` | Pipe with valve |
| `landscape-hardscape` | Tree + paver block |
| `developers` | Multi-building skyline |
| `homeowners` | Simple house |

### 3.3 UI icons (12)

| Slug | Concept |
|---|---|
| `phone` | Phone handset |
| `email` | Envelope |
| `pin` | Map pin |
| `clock` | Clock face |
| `check` | Checkmark |
| `arrow-right` | Right arrow |
| `chevron-down` | Dropdown chevron |
| `menu` | Hamburger 3 lines |
| `close` | X |
| `star` | Star (testimonials) |
| `external-link` | Box with up-right arrow |
| `quote` | Open quote mark |

### 3.4 Trust icons (4)

| Slug | Concept |
|---|---|
| `shield` | Shield (insured) |
| `certificate` | Document with ribbon (licensed) |
| `calendar` | Calendar (scheduling) |
| `truck` | Dump truck (haul-off) |

**Total: 31 icons.**

---

## 4. Production approach

### Option A (recommended): Use Lucide

Lucide (https://lucide.dev) is open source, MIT licensed, hand-drawn at 24x24 with 2px stroke and matches our style exactly. Use directly without modification for UI and trust icons.

**Lucide direct matches:**

| Our slug | Lucide name |
|---|---|
| `phone` | `phone` |
| `email` | `mail` |
| `pin` | `map-pin` |
| `clock` | `clock` |
| `check` | `check` |
| `arrow-right` | `arrow-right` |
| `chevron-down` | `chevron-down` |
| `menu` | `menu` |
| `close` | `x` |
| `star` | `star` |
| `external-link` | `external-link` |
| `quote` | `quote` |
| `shield` | `shield-check` |
| `certificate` | `award` |
| `calendar` | `calendar` |
| `truck` | `truck` |

Get the SVG from lucide.dev, copy the `<path>` content, paste into the SVG wrapper template below.

### Option B: Custom for service and industry icons

The 8 service and 7 industry icons need custom artwork to match the trade. Lucide has approximations but nothing trade-specific (no "excavator," no "trench cross-section"). Three production paths:

1. **Hire one illustrator** for a half-day to draw all 15 in one consistent set. Best result, locked style.
2. **Use Heroicons + Lucide combinations** as approximations:
   - `excavation`: `digger` from Tabler Icons
   - `utility-trenching`: stacked horizontal lines + `circle` for pipe
   - `concrete-removal`: `square-stack` with break line
   - `pool-excavation`: `waves` inside rounded rectangle
3. **AI-generated SVG** (gpt-image-1 or similar) followed by manual cleanup in a vector editor.

For launch, use option 2. Replace with option 1 when budget allows.

---

## 5. SVG wrapper template

Every icon uses this exact wrapper. Only the inner `<path>` (or `<line>`, `<circle>`, etc.) changes.

```html
<svg
  aria-hidden="true"
  focusable="false"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="square"
  stroke-linejoin="round">
  <!-- icon paths here -->
</svg>
```

For filled glyph icons (like the social icons in the footer), the wrapper changes:

```html
<svg
  aria-hidden="true"
  focusable="false"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor">
  <!-- icon paths here -->
</svg>
```

---

## 6. Example SVG code (ready to paste)

These are the most common icons. Drop straight into HTML.

### Phone

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
</svg>
```

### Email (envelope)

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
  <polyline points="22,6 12,13 2,6"/>
</svg>
```

### Map pin

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>
```

### Check

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>
```

### Arrow right

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"/>
  <polyline points="12 5 19 12 12 19"/>
</svg>
```

### Chevron down

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <polyline points="6 9 12 15 18 9"/>
</svg>
```

### Clock

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <polyline points="12 6 12 12 16 14"/>
</svg>
```

### Shield (insured)

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  <polyline points="9 12 11 14 15 10"/>
</svg>
```

### Truck

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <rect x="1" y="6" width="14" height="11" rx="1"/>
  <path d="M15 9h4l3 3v5h-7"/>
  <circle cx="6" cy="19" r="2"/>
  <circle cx="18" cy="19" r="2"/>
</svg>
```

### Star

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>
```

### Menu (hamburger)

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <line x1="3" y1="6" x2="21" y2="6"/>
  <line x1="3" y1="12" x2="21" y2="12"/>
  <line x1="3" y1="18" x2="21" y2="18"/>
</svg>
```

### Close (X)

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <line x1="6" y1="6" x2="18" y2="18"/>
  <line x1="6" y1="18" x2="18" y2="6"/>
</svg>
```

### Calendar

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="1"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
</svg>
```

### Quote (open quote mark)

```html
<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  <path d="M3 21c3 0 6-1 6-7V8H3v6h3v1c0 3-1 4-3 4v2zm12 0c3 0 6-1 6-7V8h-6v6h3v1c0 3-1 4-3 4v2z"/>
</svg>
```

---

## 7. Service icon examples (custom)

These are starter approximations. Replace with custom artwork when budget allows.

### Excavation (excavator silhouette, simplified)

```html
<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <path d="M3 18h18"/>
  <path d="M5 18v-3h6v3"/>
  <path d="M11 15l3-3 3 1 4-5"/>
  <circle cx="6" cy="20" r="1"/>
  <circle cx="10" cy="20" r="1"/>
  <path d="M19 7l2 2-1 2"/>
</svg>
```

### Utility trenching (trench cross-section with pipe)

```html
<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <path d="M3 6l3 4v10h12V10l3-4"/>
  <circle cx="12" cy="16" r="2"/>
  <line x1="3" y1="6" x2="21" y2="6"/>
</svg>
```

### Pool excavation (pool cross-section)

```html
<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <path d="M3 8h3v8h12V8h3"/>
  <path d="M3 8v10h18V8"/>
  <line x1="6" y1="12" x2="18" y2="12"/>
</svg>
```

### Demolition (wrecking impact)

```html
<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <line x1="6" y1="3" x2="10" y2="11"/>
  <circle cx="11" cy="13" r="3"/>
  <path d="M14 14l3 2 1 4"/>
  <path d="M3 21h18"/>
  <line x1="16" y1="20" x2="20" y2="16"/>
</svg>
```

### Site clearing (tree + ground)

```html
<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <path d="M12 3l-4 5h2l-3 4h2l-2 3h10l-2-3h2l-3-4h2z"/>
  <line x1="12" y1="15" x2="12" y2="20"/>
  <line x1="3" y1="20" x2="21" y2="20"/>
</svg>
```

### Rough grading (slope + level)

```html
<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <line x1="3" y1="18" x2="21" y2="18"/>
  <path d="M3 14l8-4 10 4"/>
  <line x1="11" y1="10" x2="11" y2="6"/>
  <polyline points="9 8 11 6 13 8"/>
</svg>
```

### Concrete removal (slab with crack)

```html
<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <rect x="3" y="9" width="18" height="9"/>
  <path d="M9 9l2 4-1 5"/>
  <path d="M14 9l-1 5 2 4"/>
</svg>
```

### Asphalt removal (roller drum + line)

```html
<svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">
  <circle cx="8" cy="14" r="4"/>
  <line x1="12" y1="14" x2="20" y2="14"/>
  <path d="M14 8h6v4"/>
  <line x1="3" y1="20" x2="21" y2="20"/>
</svg>
```

---

## 8. Icon sizing in CSS

```css
.gw-icon { width: 24px; height: 24px; flex-shrink: 0; }
.gw-icon--sm { width: 16px; height: 16px; }
.gw-icon--lg { width: 32px; height: 32px; }
.gw-icon--xl { width: 48px; height: 48px; }
```

For inline icons next to text, use `vertical-align: middle` or wrap both in a flex container.

```css
.gw-link-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

---

## 9. Accessibility

- Decorative icons: `aria-hidden="true"` and `focusable="false"`
- Icon-only buttons: parent button gets `aria-label`
- Icon next to text label: icon is decorative, label is the accessible name
- Never rely on icon alone for meaning. Always pair with visible text or aria-label.

---

## 10. File organization

If icons are extracted into reusable files later:

```
/icons/
  /service/
    excavation.svg
    utility-trenching.svg
    concrete-removal.svg
    asphalt-removal.svg
    site-clearing.svg
    demolition.svg
    rough-grading.svg
    pool-excavation.svg
  /industry/
    general-contractors.svg
    pool-builders.svg
    site-civil.svg
    utility-contractors.svg
    landscape-hardscape.svg
    developers.svg
    homeowners.svg
  /ui/
    phone.svg, email.svg, pin.svg, clock.svg, check.svg, arrow-right.svg,
    chevron-down.svg, menu.svg, close.svg, star.svg, external-link.svg, quote.svg
  /trust/
    shield.svg, certificate.svg, calendar.svg, truck.svg
```

For the GHL build, paste icons inline in the page HTML as needed. No external file structure required for launch.

---

## 11. Application checklist

- [ ] Every icon uses `viewBox="0 0 24 24"` and `currentColor`
- [ ] Stroke width consistent at 2px across all stroke icons
- [ ] No mixing of stroke and filled styles in the same context
- [ ] All decorative icons have `aria-hidden="true"` and `focusable="false"`
- [ ] All icon-only buttons have `aria-label` on the button
- [ ] Service grid uses 8 service icons in same style
- [ ] Industry grid uses 7 industry icons in same style
- [ ] Footer social icons use filled style (matches social brand convention)
- [ ] No icon font loaded from external CDN
- [ ] No PNG icons (SVG only)
