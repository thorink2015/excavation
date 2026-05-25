# Project

Generate personalized landing pages for excavation/construction businesses from
a CSV, deploy as one static Cloudflare Pages site, write each business's URL
back to the CSV so it drops into Instantly for cold-email outreach.

## Phases

1. **Pilot (current):** 3 businesses, full template wired, all checks green, live on Cloudflare.
2. **Scale:** 1000+ businesses from real scrape, same pipeline.

## Source-of-truth files

- `data/businesses.csv` — input, user-committed. Build reads this.
- `template/index.html` + `template/assets/` — Eta template + static assets. Renders once per row.
- `drops/` — staging area for files the user wants me to read (NOT used by build).
- `notes/` — long-lived memory, read at session start.

## Output

- `dist/<slug>/index.html` per business, plus `dist/assets/`, `dist/sitemap.xml`, `dist/robots.txt`.
- `data/businesses.with-urls.csv` — input CSV + `slug` + `url` columns. Upload to Instantly.

## Quality bar

- Every page: valid HTML, all placeholders substituted, schema.org JSON-LD that parses, mobile viewport, canonical, lang attr, no broken asset paths.
- Build under 30s for 1000 pages.
- Validator (`npm run validate`) runs over the whole `dist/` and fails on any of the above.
- Page weight kept reasonable (warn if >300KB HTML — images excluded; images should be lazy-loaded).

## Conventions

- Slug = `slugify(name)-slugify(city)`, collisions get `-2`, `-3` suffix (see `scripts/slugify.js`).
- All template variables typed in `scripts/normalize.js`. Add new fields there, never inline in build.
- Forms are decorative only (no backend) — `<button>` with `onclick` or `<a>` styled as button. No POST endpoints.
