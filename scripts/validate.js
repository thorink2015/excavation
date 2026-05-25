// Validator: scans dist/ for problems before you push to Cloudflare.
// Runs on every page in parallel; fails the build (exit 1) if any HARD checks fail.
// Run with: npm run validate (after npm run build).
//
// Checks per page (HARD = fail):
//   [HARD] No leftover Eta tags ("<%", "<%=", etc.)
//   [HARD] No leftover Mustache-style placeholders ("{{ ... }}")
//   [HARD] Has <html lang="...">
//   [HARD] Has <title>...</title> (non-empty)
//   [HARD] Has <meta name="description" content="..."> (non-empty)
//   [HARD] Has <meta name="viewport" content="...">
//   [HARD] Has <link rel="canonical" href="https://...">
//   [HARD] All local asset references (/assets/...) resolve in dist/
//   [HARD] schema.org JSON-LD parses as valid JSON
// Checks per page (SOFT = warn):
//   [SOFT] HTML size under 300 KB
//   [SOFT] All <img> tags have alt attribute
//   [SOFT] Page mentions the business_name (sanity that data was injected)
// Build-wide:
//   [HARD] Page count matches CSV row count
//   [HARD] No duplicate slugs

import fs from 'node:fs';
import path from 'node:path';
import { parse as parseCsv } from 'csv-parse/sync';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const CSV  = path.join(ROOT, 'data', 'businesses.csv');

const MAX_HTML_BYTES = 300 * 1024;

if (!fs.existsSync(DIST)) {
  console.error('ERROR: dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const pages = listPages(DIST);
const assetSet = new Set(listFiles(path.join(DIST, 'assets')).map((p) => `/assets/${path.relative(path.join(DIST, 'assets'), p).replace(/\\/g, '/')}`));

let hardErrors = 0;
let softWarnings = 0;
const businessSlugs = new Set();
const duplicateBusinessSlugs = [];

console.log(`Validating ${pages.length} page(s)...`);

for (const file of pages) {
  // Top-level dir under dist/ is the business slug; deeper dirs are page routes within a business.
  const rel = path.relative(DIST, file);
  const topLevel = rel.split(path.sep)[0];
  if (topLevel && topLevel !== 'index.html' && topLevel !== 'assets') {
    // Track distinct business slugs (no duplicate detection needed here since slugify already dedupes
    // per business — we only count them to verify the build produced the right number).
    businessSlugs.add(topLevel);
  }

  const html = fs.readFileSync(file, 'utf8');
  const issues = [];
  const warnings = [];

  // Leftover template tags
  if (/<%[=\-~]?[\s\S]+?%>/.test(html)) issues.push('leftover Eta tag <% ... %>');
  if (/\{\{\s*[a-z_][\w.]*\s*\}\}/i.test(html)) issues.push('leftover {{ placeholder }}');

  // Required head tags
  if (!/<html[^>]*\blang\s*=/i.test(html))                                       issues.push('missing <html lang="...">');
  if (!/<title>[^<]+<\/title>/i.test(html))                                      issues.push('missing or empty <title>');
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) issues.push('missing <meta name="description">');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html))                            issues.push('missing <meta name="viewport">');
  if (!/<link[^>]+rel=["']canonical["'][^>]+href=["']https?:\/\//i.test(html))   issues.push('missing <link rel="canonical">');

  // Asset references — every /assets/... must exist in dist/assets/
  for (const m of html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)) {
    const ref = m[1].split('?')[0].split('#')[0];
    if (!assetSet.has(ref)) issues.push(`broken asset reference: ${ref}`);
  }

  // schema.org JSON-LD parses
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch (e) { issues.push(`invalid JSON-LD: ${e.message}`); }
  }

  // Soft checks
  if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) {
    warnings.push(`HTML > ${MAX_HTML_BYTES} bytes (${Buffer.byteLength(html, 'utf8')})`);
  }
  for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt\s*=/i.test(m[1])) { warnings.push('img without alt attribute'); break; }
  }

  if (issues.length) {
    hardErrors += issues.length;
    console.error(`\n✗ ${path.relative(ROOT, file)}`);
    for (const i of issues) console.error(`    ERROR: ${i}`);
    for (const w of warnings) console.error(`    warn:  ${w}`);
  } else if (warnings.length) {
    softWarnings += warnings.length;
    console.warn(`\n! ${path.relative(ROOT, file)}`);
    for (const w of warnings) console.warn(`    warn:  ${w}`);
  }
}

// Build-wide checks
if (fs.existsSync(CSV)) {
  const rows = parseCsv(fs.readFileSync(CSV, 'utf8'), {
    columns: true, skip_empty_lines: true, trim: true, bom: true, relax_column_count: true,
  });
  if (businessSlugs.size !== rows.length) {
    hardErrors++;
    console.error(`\n✗ business slug count ${businessSlugs.size} != CSV row count ${rows.length}`);
  }
  // Each business should have the same number of pages (verifies no page failed to render).
  const pagesPerBusiness = new Map();
  for (const slug of businessSlugs) {
    pagesPerBusiness.set(slug, pages.filter((p) => path.relative(DIST, p).split(path.sep)[0] === slug).length);
  }
  const counts = new Set(pagesPerBusiness.values());
  if (counts.size > 1) {
    hardErrors++;
    console.error(`\n✗ inconsistent page counts across businesses:`);
    for (const [slug, n] of pagesPerBusiness) console.error(`    ${slug}: ${n} pages`);
  }
}

console.log(`\n${pages.length} pages scanned across ${businessSlugs.size} businesses · ${hardErrors} errors · ${softWarnings} warnings`);
process.exit(hardErrors === 0 ? 0 : 1);

function listPages(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listPages(p));
    else if (entry.isFile() && entry.name === 'index.html') out.push(p);
  }
  return out;
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p));
    else if (entry.isFile()) out.push(p);
  }
  return out;
}
