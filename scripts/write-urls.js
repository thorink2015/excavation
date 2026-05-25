// Reads data/businesses.csv and writes data/businesses.with-urls.csv with the
// original columns PLUS `slug`, `url`, and `deployed` (true for the first LIMIT
// businesses that the build deploys, false for those slated for future batches).
//
// This file is the cold-email deliverable. Upload to Instantly (or any tool)
// and reference {{url}} in the email body for the personalized landing-page link.

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { buildUniqueSlugs } from './slugify.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const IN   = path.join(ROOT, 'data', 'businesses.csv');
const OUT  = path.join(ROOT, 'data', 'businesses.with-urls.csv');
const OUT_CAMPAIGN = path.join(ROOT, 'data', 'campaign-batch.csv'); // deployed-only subset

const SITE_URL = (process.env.SITE_URL ?? 'https://excavation.pages.dev').replace(/\/$/, '');
// Default matches build.js so the `deployed` flag is accurate.
const LIMIT    = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 1500;

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

const enriched = rows.map((row, i) => ({
  ...row,
  slug: slugMap.get(row),
  url: `${SITE_URL}/${slugMap.get(row)}/`,
  deployed: LIMIT ? (i < LIMIT ? 'true' : 'false') : 'true',
}));

fs.writeFileSync(OUT, stringify(enriched, { header: true }));

// Also write a focused "ready-to-cold-email" subset containing only deployed rows.
const live = enriched.filter((r) => r.deployed === 'true');
fs.writeFileSync(OUT_CAMPAIGN, stringify(live, { header: true }));

const deployedCount = live.length;
console.log(`Wrote ${enriched.length} rows -> ${path.relative(ROOT, OUT)}`);
console.log(`  ${deployedCount} live (deployed to ${SITE_URL})`);
if (LIMIT && rows.length > LIMIT) {
  console.log(`  ${rows.length - LIMIT} URLs generated but NOT live yet (deployed=false)`);
}
console.log(`Wrote ${live.length} ready-to-send rows -> ${path.relative(ROOT, OUT_CAMPAIGN)}`);
