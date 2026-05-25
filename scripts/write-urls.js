// Reads data/businesses.csv, computes each row's deployed URL using the same slug
// logic as build.js, and writes data/businesses.with-urls.csv with an added `url` column.
// That file is what you upload to Instantly (or any cold-email tool) — use {{url}} as
// a personalization variable in the email body.

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { buildUniqueSlugs } from './slugify.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const IN   = path.join(ROOT, 'data', 'businesses.csv');
const OUT  = path.join(ROOT, 'data', 'businesses.with-urls.csv');

const SITE_URL = (process.env.SITE_URL ?? 'https://excavation-leads.pages.dev').replace(/\/$/, '');

if (!fs.existsSync(IN)) {
  console.error('ERROR: data/businesses.csv not found.');
  process.exit(1);
}

const rows = parse(fs.readFileSync(IN, 'utf8'), {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  bom: true,
  relax_column_count: true,
});

const slugMap = buildUniqueSlugs(rows);
const enriched = rows.map((row) => ({ ...row, slug: slugMap.get(row), url: `${SITE_URL}/${slugMap.get(row)}/` }));

fs.writeFileSync(OUT, stringify(enriched, { header: true }));
console.log(`Wrote ${enriched.length} rows with URLs -> ${path.relative(ROOT, OUT)}`);
console.log(`Site URL base: ${SITE_URL}`);
