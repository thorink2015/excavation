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
import { shouldDeploy } from './normalize.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const IN   = path.join(ROOT, 'data', 'businesses.csv');
const OUT  = path.join(ROOT, 'data', 'businesses.with-urls.csv');
const OUT_CAMPAIGN = path.join(ROOT, 'data', 'campaign-batch.csv'); // deployed-only subset

const SITE_URL = (process.env.SITE_URL ?? 'https://groundworkers.pages.dev').replace(/\/$/, '');
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

// Mirror build.js: eligible = passes the category blocklist; deployed = within
// LIMIT of the eligible list. Rows that are NOT eligible never deploy regardless
// of position. This way the campaign-batch.csv is always 1500 real prospects.
let deployedCount = 0;
const enriched = rows.map((row) => {
  const eligible = shouldDeploy(row);
  const isDeployed = eligible && (LIMIT == null || deployedCount < LIMIT);
  if (isDeployed) deployedCount++;
  return {
    ...row,
    slug: slugMap.get(row),
    url: `${SITE_URL}/${slugMap.get(row)}/`,
    eligible: eligible ? 'true' : 'false',
    deployed: isDeployed ? 'true' : 'false',
  };
});

fs.writeFileSync(OUT, stringify(enriched, { header: true }));

const live = enriched.filter((r) => r.deployed === 'true');
const eligibleFuture = enriched.filter((r) => r.eligible === 'true' && r.deployed === 'false').length;
const blocked = enriched.filter((r) => r.eligible === 'false').length;
fs.writeFileSync(OUT_CAMPAIGN, stringify(live, { header: true }));

console.log(`Wrote ${enriched.length} rows -> ${path.relative(ROOT, OUT)}`);
console.log(`  ${live.length} live (deployed to ${SITE_URL})`);
console.log(`  ${eligibleFuture} eligible but not yet deployed (LIMIT cap)`);
console.log(`  ${blocked} blocked by category filter (not excavation-relevant)`);
console.log(`Wrote ${live.length} ready-to-send rows -> ${path.relative(ROOT, OUT_CAMPAIGN)}`);
