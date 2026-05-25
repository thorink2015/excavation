// Build script: reads data/businesses.csv and emits dist/<slug>/index.html for each row.
// Run with: npm run build
// Configure deploy URL with SITE_URL env var (defaults to local Cloudflare Pages name).

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { Eta } from 'eta';
import { buildUniqueSlugs } from './slugify.js';
import { normalize } from './normalize.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CSV_PATH      = path.join(ROOT, 'data', 'businesses.csv');
const TEMPLATE_DIR  = path.join(ROOT, 'template');
const ASSETS_DIR    = path.join(TEMPLATE_DIR, 'assets');
const TEMPLATE_FILE = path.join(TEMPLATE_DIR, 'index.html');
const DIST_DIR      = path.join(ROOT, 'dist');

const SITE_URL = (process.env.SITE_URL ?? 'https://excavation.pages.dev').replace(/\/$/, '');

function main() {
  ensure(CSV_PATH,      'Missing data/businesses.csv. Commit your scraped CSV at that path.');
  ensure(TEMPLATE_FILE, 'Missing template/index.html. Paste your HTML template there (use {{placeholders}} or Eta tags).');

  console.log(`Building from ${path.relative(ROOT, CSV_PATH)}`);
  console.log(`Site URL: ${SITE_URL}`);

  const csvText = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  });
  console.log(`Loaded ${rows.length} businesses.`);

  const slugMap = buildUniqueSlugs(rows);

  // Fresh dist
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // Copy static assets verbatim
  if (fs.existsSync(ASSETS_DIR)) {
    copyDir(ASSETS_DIR, path.join(DIST_DIR, 'assets'));
    console.log('Copied template/assets -> dist/assets');
  }

  const eta = new Eta({ views: TEMPLATE_DIR, useWith: true, autoEscape: false });

  let built = 0;
  const sitemapEntries = [];

  for (const row of rows) {
    const slug = slugMap.get(row);
    const data = normalize(row);
    data.slug = slug;
    data.site_url = `${SITE_URL}/${slug}/`;
    data.canonical = data.site_url;

    const html = eta.render('./index.html', data);
    const outDir = path.join(DIST_DIR, slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);

    sitemapEntries.push(data.site_url);
    built++;
  }

  // Sitemap + robots
  fs.writeFileSync(
    path.join(DIST_DIR, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      sitemapEntries.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
      `\n</urlset>\n`,
  );
  fs.writeFileSync(
    path.join(DIST_DIR, 'robots.txt'),
    // Cold-email landing pages — keep them out of Google to avoid doorway-page penalties.
    `User-agent: *\nDisallow: /\n`,
  );

  // Minimal root index so the bare domain isn't a 404
  fs.writeFileSync(
    path.join(DIST_DIR, 'index.html'),
    `<!doctype html><html lang="en"><head>` +
      `<meta charset="utf-8">` +
      `<meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<title>Excavation Network</title>` +
      `<meta name="description" content="Regional directory of excavation and site-prep contractors.">` +
      `<link rel="canonical" href="${SITE_URL}/">` +
      `<meta name="robots" content="noindex">` +
      `</head><body style="font-family:system-ui;padding:2rem;max-width:36rem">` +
      `<h1>Excavation Network</h1><p>${built} regional businesses.</p></body></html>`,
  );

  console.log(`Built ${built} pages -> ${path.relative(ROOT, DIST_DIR)}/`);
}

function ensure(p, msg) {
  if (!fs.existsSync(p)) {
    console.error(`ERROR: ${msg}`);
    process.exit(1);
  }
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

main();
