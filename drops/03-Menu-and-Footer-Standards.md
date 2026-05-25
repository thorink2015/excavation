# Groundwork Solutions: Menu and Footer Standards

Locked structure for the global header, top bar, and footer. Used identically on every page. Set once in the GHL global header and global footer sections.

---

## 1. Top bar (above the menu)

Slim utility strip across the very top of every page. Background Ink, text Paper.

**Desktop layout (3 columns, left-center-right):**

| Left | Center | Right |
|---|---|---|
| Phone: 530-559-8502 | Northern California Site Prep | [email protected] |

**Mobile (collapse to phone only):**

| Single line, centered |
|---|
| Phone: 530-559-8502 |

**HTML pattern (paste in Custom Code at top of global header):**

```html
<div class="gw gw-topbar">
  <div class="gw-container gw-topbar__inner">
    <a href="tel:+15305598502" class="gw-topbar__item gw-topbar__item--phone">
      <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <span>530-559-8502</span>
    </a>
    <span class="gw-topbar__item gw-topbar__item--center">Northern California Site Prep</span>
    <a href="mailto:[email protected]" class="gw-topbar__item gw-topbar__item--email">
      <svg aria-hidden="true" focusable="false" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      <span>[email protected]</span>
    </a>
  </div>
</div>
```

**CSS:**

```css
.gw-topbar {
  background: var(--gw-ink);
  color: var(--gw-paper);
  font-size: 0.875rem;
  padding: 8px 0;
}
.gw-topbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.gw-topbar__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--gw-paper);
  text-decoration: none;
}
.gw-topbar__item:hover { color: var(--gw-tint); }
.gw-topbar__item--center {
  font-family: var(--gw-font-display);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
}
@media (max-width: 768px) {
  .gw-topbar__item--center,
  .gw-topbar__item--email { display: none; }
  .gw-topbar__inner { justify-content: center; }
}
```

---

## 2. Top navigation (GHL native menu)

Use the GHL native Navigation Menu element. Configure once in the global header section.

### 2.1 Menu structure (locked)

| Order | Label | Type | Destination |
|---|---|---|---|
| 1 | Home | Link | `/` |
| 2 | About | Link | `/about` |
| 3 | Services | Dropdown | (see below) |
| 4 | Who We Work With | Dropdown | (see below) |
| 5 | Contact | Link | `/contact` |
| Right | 530-559-8502 | Click-to-call | `tel:+15305598502` |
| Right | Get a Quote | Button (Clay) | `/contact` |

### 2.2 Services dropdown

Configured as a sub-menu in the GHL menu element. Order matches the URL map.

| Label | Destination |
|---|---|
| All Services | `/services` |
| Excavation | `/services/excavation` |
| Utility Trenching | `/services/utility-trenching` |
| Concrete Removal | `/services/concrete-removal` |
| Asphalt Removal | `/services/asphalt-removal` |
| Site Clearing | `/services/site-clearing` |
| Demolition | `/services/demolition` |
| Rough Grading | `/services/rough-grading` |
| Pool Excavation | `/services/pool-excavation` |

### 2.3 Who We Work With dropdown

| Label | Destination |
|---|---|
| All Industries | `/who-we-work-with` |
| General Contractors | `/who-we-work-with/general-contractors` |
| Pool Builders | `/who-we-work-with/pool-builders` |
| Site & Civil | `/who-we-work-with/site-civil-contractors` |
| Utility Contractors | `/who-we-work-with/utility-contractors` |
| Landscape & Hardscape | `/who-we-work-with/landscape-hardscape-contractors` |
| Developers & PMs | `/who-we-work-with/property-developers` |
| Homeowners | `/who-we-work-with/homeowners` |

### 2.4 Menu styling

The GHL native menu has its own classes (we don't restyle them in detail). Set in the GHL menu element settings:

- Background: Paper (`#F7F5F0`)
- Logo height: 40px desktop, 36px mobile
- Menu link color: Ink
- Menu link active color: Clay Dark
- Menu link hover: Clay Dark
- Font: Public Sans 600, 15px
- Sticky on scroll: ON
- Mobile menu type: Hamburger (right-aligned)
- Mobile menu icon color: Ink
- CTA button style: Clay background, white text, 6px radius

Do not try to override the GHL menu HTML from page CSS. It lives in its own component scope.

---

## 3. Footer (custom HTML, every page)

Build once in a global footer section using a single Custom Code element. Reuse on every page.

### 3.1 Layout (desktop)

4 columns + base row.

| Col 1 (logo + tagline) | Col 2 (Services) | Col 3 (Who We Work With) | Col 4 (Company) |

### 3.2 Layout (mobile)

Stack to single column. Logo + tagline first, then accordion-free vertical lists.

### 3.3 Full HTML (paste in Custom Code)

```html
<footer class="gw gw-footer" role="contentinfo">
  <div class="gw-container gw-footer__inner">
    <div class="gw-footer__col gw-footer__brand">
      <a href="/" class="gw-footer__logo" aria-label="Groundwork Solutions home">
        <img src="https://groundworknorcal.com/logo-white.svg" alt="Groundwork Solutions" width="180" height="48" loading="lazy">
      </a>
      <p class="gw-footer__tag">Site prep for builders across Northern California. Excavation, trenching, breaking, clearing, grading.</p>
      <ul class="gw-footer__contact" role="list">
        <li>
          <a href="tel:+15305598502">530-559-8502</a>
        </li>
        <li>
          <a href="mailto:[email protected]">[email protected]</a>
        </li>
        <li>
          <span>2351 Sunset Blvd, Ste. 170-716<br>Rocklin, CA 95765</span>
        </li>
      </ul>
    </div>

    <nav class="gw-footer__col gw-footer__nav" aria-label="Services">
      <h2 class="gw-footer__heading">Services</h2>
      <ul role="list">
        <li><a href="/services">All Services</a></li>
        <li><a href="/services/excavation">Excavation</a></li>
        <li><a href="/services/utility-trenching">Utility Trenching</a></li>
        <li><a href="/services/concrete-removal">Concrete Removal</a></li>
        <li><a href="/services/asphalt-removal">Asphalt Removal</a></li>
        <li><a href="/services/site-clearing">Site Clearing</a></li>
        <li><a href="/services/demolition">Demolition</a></li>
        <li><a href="/services/rough-grading">Rough Grading</a></li>
        <li><a href="/services/pool-excavation">Pool Excavation</a></li>
      </ul>
    </nav>

    <nav class="gw-footer__col gw-footer__nav" aria-label="Industries we work with">
      <h2 class="gw-footer__heading">Who We Work With</h2>
      <ul role="list">
        <li><a href="/who-we-work-with">All Industries</a></li>
        <li><a href="/who-we-work-with/general-contractors">General Contractors</a></li>
        <li><a href="/who-we-work-with/pool-builders">Pool Builders</a></li>
        <li><a href="/who-we-work-with/site-civil-contractors">Site &amp; Civil</a></li>
        <li><a href="/who-we-work-with/utility-contractors">Utility Contractors</a></li>
        <li><a href="/who-we-work-with/landscape-hardscape-contractors">Landscape &amp; Hardscape</a></li>
        <li><a href="/who-we-work-with/property-developers">Developers &amp; PMs</a></li>
        <li><a href="/who-we-work-with/homeowners">Homeowners</a></li>
      </ul>
    </nav>

    <nav class="gw-footer__col gw-footer__nav" aria-label="Company">
      <h2 class="gw-footer__heading">Company</h2>
      <ul role="list">
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/contact">Get a Quote</a></li>
        <li><span class="gw-footer__license">CSLB License #[VERIFY]</span></li>
      </ul>
      <ul class="gw-footer__social" role="list" aria-label="Social media">
        <li><a href="https://www.facebook.com/groundworknorcal" aria-label="Facebook" rel="noopener" target="_blank">
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
        </a></li>
        <li><a href="https://www.instagram.com/groundworknorcal" aria-label="Instagram" rel="noopener" target="_blank">
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a></li>
        <li><a href="https://www.linkedin.com/company/groundworknorcal" aria-label="LinkedIn" rel="noopener" target="_blank">
          <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
        </a></li>
      </ul>
    </nav>
  </div>

  <div class="gw-footer__base">
    <div class="gw-container gw-footer__base-inner">
      <p class="gw-footer__copy">&copy; <span id="gw-year">2026</span> Groundwork Solutions LLC. All rights reserved.</p>
      <ul class="gw-footer__legal" role="list">
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/sitemap.xml">Sitemap</a></li>
      </ul>
    </div>
  </div>
</footer>
```

### 3.4 Footer CSS (paste in site-wide Custom Code or page Custom CSS)

```css
.gw-footer {
  background: var(--gw-ink);
  color: var(--gw-paper);
  padding: var(--gw-section-y) 0 0;
  font-size: 0.9375rem;
}
.gw-footer__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  padding-bottom: 48px;
}
@media (min-width: 700px) {
  .gw-footer__inner { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1000px) {
  .gw-footer__inner { grid-template-columns: 1.4fr 1fr 1fr 1fr; }
}
.gw-footer__brand {
  max-width: 320px;
}
.gw-footer__logo img {
  width: 180px;
  height: auto;
  margin-bottom: 16px;
}
.gw-footer__tag {
  color: var(--gw-tint);
  margin-bottom: 20px;
  line-height: 1.6;
}
.gw-footer__contact {
  display: grid;
  gap: 8px;
}
.gw-footer__contact a,
.gw-footer__nav a {
  color: var(--gw-paper);
  text-decoration: none;
  transition: color 150ms ease;
}
.gw-footer__contact a:hover,
.gw-footer__nav a:hover {
  color: var(--gw-clay);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.gw-footer__heading {
  font-family: var(--gw-font-display);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gw-clay);
  margin-bottom: 16px;
}
.gw-footer__nav ul {
  display: grid;
  gap: 8px;
}
.gw-footer__license {
  color: var(--gw-tint);
  font-size: 0.875rem;
}
.gw-footer__social {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
.gw-footer__social a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--gw-tint);
  border-radius: 6px;
  color: var(--gw-paper);
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
}
.gw-footer__social a:hover {
  background: var(--gw-clay);
  color: var(--gw-paper);
  border-color: var(--gw-clay);
}
.gw-footer__base {
  border-top: 1px solid rgba(247, 245, 240, 0.15);
  padding: 24px 0;
}
.gw-footer__base-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 0.875rem;
}
.gw-footer__copy {
  color: var(--gw-tint);
}
.gw-footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.gw-footer__legal a {
  color: var(--gw-tint);
  text-decoration: none;
}
.gw-footer__legal a:hover {
  color: var(--gw-clay);
  text-decoration: underline;
}
@media (max-width: 600px) {
  .gw-footer__base-inner { justify-content: center; text-align: center; }
}
```

### 3.5 Footer rules

- Logo always linked to `/`
- Phone always click-to-call (`tel:+15305598502`)
- Email always mailto link
- License number displayed when CSLB license arrives (`[VERIFY]` placeholder until then)
- Social icons hidden if profile not yet live (don't ship dead links)
- Year in copyright: hardcode for now (`2026`) and update each January, OR use a 1-line script in body tracking code if dynamic year is preferred

---

## 4. Mobile menu rules

GHL handles the hamburger natively. Settings to confirm in the menu element:

- Hamburger position: right
- Hamburger color: Ink
- Mobile menu background: Paper
- Mobile menu link color: Ink
- Mobile menu link size: 18px
- Mobile menu link spacing: 16px vertical
- Submenu expand on tap: yes
- Close button: top right, X icon

Test on a real iPhone Safari and a real Android Chrome. The menu's internal HTML is GHL-generated; do not try to restyle from page CSS.

---

## 5. Header behavior on scroll

- Sticky on desktop: yes
- Sticky on mobile: yes
- Background on scroll: Paper with 1px Slate (10% opacity) bottom border
- Shadow on scroll: none (industrial brand reads better flat)

These are GHL menu element settings. Don't override with custom CSS.

---

## 6. Active page indicator

GHL menu adds an `aria-current="page"` and a class to the active link automatically. Style:

```css
.hl-menu-link[aria-current="page"],
.hl-menu-link.active {
  color: var(--gw-clay-dark) !important;
  border-bottom: 2px solid var(--gw-clay);
}
```

Class names may vary by GHL version. Inspect the live page and update the selector.

---

## 7. Application checklist (header and footer)

Before publishing the site:

- [ ] Top bar shows phone, tagline, email on desktop
- [ ] Top bar collapses to phone only on mobile
- [ ] Logo in nav links to `/`
- [ ] All 5 main menu items present and ordered correctly
- [ ] Services dropdown lists all 8 service pages plus All Services
- [ ] Who We Work With dropdown lists all 7 industry pages plus All Industries
- [ ] Phone number visible on desktop, click-to-call on mobile
- [ ] Get a Quote button in Clay, links to `/contact`
- [ ] Footer matches the locked HTML
- [ ] Footer logo links to `/`
- [ ] Footer phone, email, address present
- [ ] All footer service links match the URL map
- [ ] All footer industry links match the URL map
- [ ] Social icons hidden if profiles not live
- [ ] Privacy Policy, Terms of Service, Sitemap links in base row
- [ ] Copyright year correct
- [ ] Mobile menu opens, closes, scrolls correctly on real device
