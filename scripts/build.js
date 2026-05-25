// Build script: reads data/businesses.csv and emits a full multi-page site per business.
// Run with: npm run build
// Configure deploy URL with SITE_URL env var (defaults to local Cloudflare Pages name).

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { Eta } from 'eta';
import { buildUniqueSlugs } from './slugify.js';
import { normalize, buildJsonLd, buildBreadcrumbLd, buildServiceLd, buildFaqLd, faqsFor, shouldDeploy } from './normalize.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CSV_PATH      = path.join(ROOT, 'data', 'businesses.csv');
const TEMPLATE_DIR  = path.join(ROOT, 'template');
const ASSETS_DIR    = path.join(TEMPLATE_DIR, 'assets');
const PAGES_DIR     = path.join(TEMPLATE_DIR, 'pages');
const HOME_PAGE     = path.join(TEMPLATE_DIR, 'home.html');
const DIST_DIR      = path.join(ROOT, 'dist');

const SITE_URL = (process.env.SITE_URL ?? 'https://groundworkers.pages.dev').replace(/\/$/, '');

// LIMIT=N caps the build to the first N businesses. Useful for fitting within
// Cloudflare Pages' 20k-file-per-deploy ceiling. Slugs are still generated for
// ALL businesses (so the URL writeback CSV stays complete), but only the first
// N have their HTML rendered.
//
// Default is 1500: 1500 businesses × 13 pages = 19,500 files, just under
// Cloudflare's 20k limit. Override locally with LIMIT=99999 to build all rows;
// override on Cloudflare via the dashboard env var when deploying additional batches.
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : 1500;

// Each business site is rendered as this set of pages.
// `key` is a stable identifier used to highlight the active nav item;
// `template` is relative to template/; `route` is the URL path under /<slug>/.
const PAGES = [
  { key: 'home',                    template: 'pages/home.html',                       route: '',                          crumbs: [] },
  { key: 'services',                template: 'pages/services.html',                   route: 'services/',                 crumbs: [{ name: 'Services' }] },
  { key: 'services/excavation',     template: 'pages/services/excavation.html',        route: 'services/excavation/',      crumbs: [{ name: 'Services', path: 'services/' }, { name: 'Excavation' }] },
  { key: 'services/utility-trenching', template: 'pages/services/utility-trenching.html', route: 'services/utility-trenching/', crumbs: [{ name: 'Services', path: 'services/' }, { name: 'Utility Trenching' }] },
  { key: 'services/grading',        template: 'pages/services/grading.html',           route: 'services/grading/',         crumbs: [{ name: 'Services', path: 'services/' }, { name: 'Grading' }] },
  { key: 'services/demolition',     template: 'pages/services/demolition.html',        route: 'services/demolition/',      crumbs: [{ name: 'Services', path: 'services/' }, { name: 'Demolition' }] },
  { key: 'equipment',               template: 'pages/equipment.html',                  route: 'equipment/',                crumbs: [{ name: 'Equipment' }] },
  { key: 'industries',              template: 'pages/industries.html',                 route: 'industries/',               crumbs: [{ name: 'Industries' }] },
  { key: 'service-area',            template: 'pages/service-area.html',               route: 'service-area/',             crumbs: [{ name: 'Service Area' }] },
  { key: 'about',                   template: 'pages/about.html',                      route: 'about/',                    crumbs: [{ name: 'About' }] },
  { key: 'contact',                 template: 'pages/contact.html',                    route: 'contact/',                  crumbs: [{ name: 'Contact' }] },
  { key: 'privacy',                 template: 'pages/privacy.html',                    route: 'privacy/',                  crumbs: [{ name: 'Privacy Policy' }] },
  { key: 'terms',                   template: 'pages/terms.html',                      route: 'terms/',                    crumbs: [{ name: 'Terms of Service' }] },
];

// Page-specific hero images. Only Unsplash IDs verified against the original
// Groundwork HTML files are used — these are known-public construction photos
// that reliably resolve. Pages where no matching photo exists fall back to a
// text-only hero (controlled by the template, not this map).
const EXCAVATOR_HERO  = 'https://images.unsplash.com/photo-1583024011792-b165975b52f5';
const SITE_PREP_HERO  = 'https://images.unsplash.com/photo-1649807533255-bbc9c9fb7d77';
const HEAVY_EQUIP_HERO = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece';
const PERSON_ON_SITE_HERO = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd';

const HERO_IMAGES = {
  'home':                       EXCAVATOR_HERO,
  'services':                   HEAVY_EQUIP_HERO,
  'services/excavation':        EXCAVATOR_HERO,
  // services/utility-trenching, services/grading, services/demolition: text-only hero
  'equipment':                  EXCAVATOR_HERO,
  'industries':                 HEAVY_EQUIP_HERO,
  'about':                      PERSON_ON_SITE_HERO,
  // service-area, contact, privacy, terms: text-only hero (already)
  // Fallback for OG/Twitter image and pages without a hero photo:
  'default':                    EXCAVATOR_HERO,
};

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

  // Slugs are deterministic across the FULL dataset so the URL writeback CSV
  // matches even when we only render the first LIMIT eligible businesses.
  const slugMap = buildUniqueSlugs(rows);

  // Apply the category blocklist BEFORE LIMIT — that way LIMIT counts only real
  // excavation prospects. Anything filtered out is excluded from the deploy
  // entirely (and write-urls.js marks them deployed=false).
  const eligibleRows = rows.filter(shouldDeploy);
  const buildRows = LIMIT ? eligibleRows.slice(0, LIMIT) : eligibleRows;
  console.log(`Eligible (after category blocklist): ${eligibleRows.length} of ${rows.length}`);
  if (LIMIT) console.log(`LIMIT=${LIMIT} — rendering first ${buildRows.length} of ${eligibleRows.length} eligible businesses.`);

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

  for (const row of buildRows) {
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
        // Use the Unsplash hero for every business on the home page (consistent brand).
        // Inner pages use page-specific Unsplash so a paving page shows paving, etc.
        hero_image: HERO_IMAGES[page.key] ?? HERO_IMAGES.default,
        faqs: page.key === 'home' ? faqsFor(data) : [],
      };
      pageData.json_ld = buildJsonLd(pageData);
      pageData.breadcrumb_ld = page.crumbs.length
        ? buildBreadcrumbLd(SITE_URL, slug, page.crumbs)
        : null;
      pageData.service_ld = page.key.startsWith('services/')
        ? buildServiceLd(pageData, page.key)
        : null;
      pageData.faq_ld = page.key === 'home'
        ? buildFaqLd(pageData.faqs)
        : null;

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
    case 'equipment':               return `Equipment | ${biz}`;
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
    case 'equipment':
      return `Equipment fleet at ${biz}: mini and standard excavators, skid steers, trenchers, dump trucks, compactors. Right machine, right job.`.slice(0, 160);
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
