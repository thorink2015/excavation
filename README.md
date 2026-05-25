# Excavation Multi-Site Generator

Generate 1000+ personalized landing pages for excavation/construction businesses from a single CSV, deploy as one static site, and get back a CSV of URLs ready for cold-email tools (Instantly, etc.).

## How it works

```
data/businesses.csv  →  npm run build  →  dist/<slug>/index.html × N  →  Cloudflare Pages
                    →  npm run urls   →  data/businesses.with-urls.csv  →  Instantly
```

One site, one deploy, N routes. Each business gets `https://<your-project>.pages.dev/<slug>/`.

## Setup

```bash
npm install
```

## Add your data

1. **Template** — paste your HTML/CSS/JS into `template/` (`index.html` + `assets/`).
   See `template/README.md` for the placeholder reference.
2. **CSV** — drop your scraped list at `data/businesses.csv`.
   See `data/businesses.sample.csv` for the expected columns. Extra columns are ignored;
   missing columns are tolerated (rendered as empty).

## Build

```bash
npm run build          # renders dist/<slug>/index.html for every row
npm run urls           # writes data/businesses.with-urls.csv (slug + url columns added)
npm run all            # both
```

Set the deploy URL with `SITE_URL`:

```bash
SITE_URL=https://excavation-leads.pages.dev npm run all
```

## Deploy (Cloudflare Pages)

One-time:

1. Push this repo to GitHub.
2. Cloudflare dashboard → Pages → *Create project* → Connect GitHub → pick this repo.
3. Build command: `npm run build`
4. Build output: `dist`
5. Environment variable: `SITE_URL=https://<your-project>.pages.dev` (or your custom domain).

Every push to `main` redeploys automatically. Free tier handles 1000+ pages easily.

## Cold-email workflow

1. `npm run all` → produces `data/businesses.with-urls.csv` with an extra `url` column.
2. Upload that CSV to Instantly (or your sender of choice).
3. Use `{{url}}` as a personalization variable in the email body, e.g.
   *"Hey {{first_name}}, I built a quick site for {{business_name}} — take a look: {{url}}"*.

## Layout

| Path | Purpose |
|---|---|
| `data/businesses.csv` | source of truth (you commit) |
| `data/businesses.with-urls.csv` | generated, gitignored |
| `template/index.html` | your template with Eta placeholders |
| `template/assets/` | CSS/JS/images, copied verbatim to `dist/assets` |
| `scripts/build.js` | renders all pages |
| `scripts/write-urls.js` | enriches CSV with deployed URLs |
| `scripts/slugify.js` | deterministic, collision-free slugs |
| `scripts/normalize.js` | CSV row → typed template variables |
| `dist/` | build output (gitignored) |
