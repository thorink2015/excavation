// Build script: reads data/businesses.csv and emits a full multi-page site per business.
// Run with: npm run build
// Configure deploy URL with SITE_URL env var (defaults to local Cloudflare Pages name).

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { Eta } from 'eta';
import { buildUniqueSlugs } from './slugify.js';
import { normalize, buildJsonLd } from './normalize.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CSV_PATH      = path.join(ROOT, 'data', 'businesses.csv');
const TEMPLATE_DIR  = path.join(ROOT, 'template');
const ASSETS_DIR    = path.join(TEMPLATE_DIR, 'assets');
const PAGES_DIR     = path.join(TEMPLATE_DIR, 'pages');
const HOME_PAGE     = path.join(TEMPLATE_DIR, 'home.html');
const DIST_DIR      = path.join(ROOT, 'dist');

const SITE_URL = (process.env.SITE_URL ?? 'https://excavation.pages.dev').replace(/\/$/, '');

// Each business site is rendered as this set of pages.
// `key` is a stable identifier used to highlight the active nav item;
// `template` is relative to template/; `route` is the URL path under /<slug>/.
const PAGES = [
  { key: 'home',                    template: 'pages/home.html',                       route: '' },
  { key: 'services',                template: 'pages/services.html',                   route: 'services/' },
  { key: 'services/excavation',     template: 'pages/services/excavation.html',        route: 'services/excavation/' },
  { key: 'services/utility-trenching', template: 'pages/services/utility-trenching.html', route: 'services/utility-trenching/' },
  { key: 'services/grading',        template: 'pages/services/grading.html',           route: 'services/grading/' },
  { key: 'services/demolition',     template: 'pages/services/demolition.html',        route: 'services/demolition/' },
  { key: 'industries',              template: 'pages/industries.html',                 route: 'industries/' },
  { key: 'service-area',            template: 'pages/service-area.html',               route: 'service-area/' },
  { key: 'about',                   template: 'pages/about.html',                      route: 'about/' },
  { key: 'contact',                 template: 'pages/contact.html',                    route: 'contact/' },
  { key: 'privacy',                 template: 'pages/privacy.html',                    route: 'privacy/' },
  { key: 'terms',                   template: 'pages/terms.html',                      route: 'terms/' },
];

function main() {
  ensure(CSV_PATH,  'Missing data/businesses.csv. Commit your scraped CSV at that path.');
  ensure(PAGES_DIR, 'Missing template/pages/.');
  ensure(HOME_PAGE, 'Missing template/home.html (the agency landing page).');

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

  let businessesBuilt = 0;
  let pagesBuilt = 0;
  const sitemapEntries = [];

  for (const row of rows) {
    const slug = slugMap.get(row);
    const data = normalize(row);
    data.slug = slug;

    for (const page of PAGES) {
      const url = `${SITE_URL}/${slug}/${page.route}`;
      const pageData = {
        ...data,
        page: page.key,
        site_url: url,
        canonical: url,
        seo_title: titleFor(page, data),
        seo_description: descriptionFor(page, data),
      };
      pageData.json_ld = buildJsonLd(pageData);

      const html = eta.render(`./${page.template}`, pageData);
      const outDir = path.join(DIST_DIR, slug, page.route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html);

      sitemapEntries.push(url);
      pagesBuilt++;
    }

    businessesBuilt++;
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
    `User-agent: *\nDisallow: /\n`,
  );

  // Agency landing page at the root
  const homeHtml = eta.render('./home.html', {
    site_url: SITE_URL,
    agency_name:  process.env.AGENCY_NAME  ?? 'Groundwork Digital',
    agency_email: process.env.AGENCY_EMAIL ?? 'hello@groundwork.digital',
    business_count: businessesBuilt,
  });
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homeHtml);

  console.log(`Built ${businessesBuilt} businesses, ${pagesBuilt} business pages (+ 1 agency home) -> ${path.relative(ROOT, DIST_DIR)}/`);
}

function titleFor(page, data) {
  const city = data.city, st = data.state_code, biz = data.business_name;
  const loc = city ? (st ? ` ${city}, ${st}` : ` ${city}`) : '';
  switch (page.key) {
    case 'home':                    return `Excavation${loc} | ${biz}`;
    case 'services':                return `Services | ${biz}`;
    case 'services/excavation':     return `Excavation${loc} | ${biz}`;
    case 'services/utility-trenching': return `Utility Trenching${loc} | ${biz}`;
    case 'services/grading':        return `Grading${loc} | ${biz}`;
    case 'services/demolition':     return `Demolition${loc} | ${biz}`;
    case 'industries':              return `Who We Work With | ${biz}`;
    case 'service-area':            return `Service Area | ${biz}`;
    case 'about':                   return `About | ${biz}`;
    case 'contact':                 return `Contact | ${biz}`;
    case 'privacy':                 return `Privacy Policy | ${biz}`;
    case 'terms':                   return `Terms of Service | ${biz}`;
    default:                        return `${biz}`;
  }
}

function descriptionFor(page, data) {
  const biz = data.business_name;
  const city = data.city, st = data.state_code;
  const loc = city ? (st ? `${city}, ${st}` : city) : 'the local area';
  const phone = data.phone;
  switch (page.key) {
    case 'home':
      return `${biz}: excavation, trenching, and site prep in ${loc}. Quotes in 24 hours. Call ${phone}.`.slice(0, 160);
    case 'services':
      return `Full list of services from ${biz}: excavation, utility trenching, grading, demolition, clearing, and hauling in ${loc}.`.slice(0, 160);
    case 'services/excavation':
      return `Excavation in ${loc} for foundations, basements, pools, and full site digs. ${biz}. Quotes in 24 hours.`.slice(0, 160);
    case 'services/utility-trenching':
      return `Utility trenching in ${loc} for water, sewer, gas, electric, and data. ${biz}. Locates handled.`.slice(0, 160);
    case 'services/grading':
      return `Rough and finish grading in ${loc}. Building pads, driveways, parking lots. Laser-leveled tolerances. ${biz}.`.slice(0, 160);
    case 'services/demolition':
      return `Demolition in ${loc} for sheds, garages, slabs, and pools. Permits handled, debris hauled. ${biz}.`.slice(0, 160);
    case 'industries':
      return `${biz} works with general contractors, home builders, pool builders, developers, and homeowners across ${loc}.`.slice(0, 160);
    case 'service-area':
      return `${biz} is based in ${loc} and serves the surrounding metro and county. Quotes in 24 hours.`.slice(0, 160);
    case 'about':
      return `About ${biz}: owner-operated excavation crew based in ${loc}. Licensed, insured, and built around honest quotes.`.slice(0, 160);
    case 'contact':
      return `Contact ${biz} in ${loc}. Call ${phone} or send a project scope to get a quote within 24 hours.`.slice(0, 160);
    case 'privacy':
      return `Privacy policy for ${biz}. We don't sell your data and we only collect what you send us through our quote form.`.slice(0, 160);
    case 'terms':
      return `Terms of service for the ${biz} website. The actual contract for any work we do is a separate signed document.`.slice(0, 160);
    default:
      return `${biz} — excavation and site prep in ${loc}.`.slice(0, 160);
  }
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
