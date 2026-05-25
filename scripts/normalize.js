// Convert a raw CSV row (all string values) into a typed object the template can consume.
// One place to add new fields when the CSV schema changes.
//
// Real CSV columns observed (Google Maps + Instantly scrape):
//   name, phone, email, website, street, city, state, state_code, postal_code,
//   address, rating, reviews (count only), working_hours (JSON), description,
//   subtypes (comma-separated services), full_name, first_name, last_name,
//   company_facebook, company_instagram, company_linkedin

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1583024011792-b165975b52f5?w=1200&q=80&auto=format&fit=crop';

const SERVICE_LIBRARY = {
  excavation:  { name: 'Excavation',         blurb: 'Footings, basements, and full site digs done clean.',                  icon: '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/>' },
  trenching:   { name: 'Utility Trenching',  blurb: 'Water, sewer, gas, and electric. Locates handled, lines protected.',   icon: '<line x1="2" y1="20" x2="22" y2="20"/><polyline points="4 16 8 12 12 14 16 8 20 12"/>' },
  grading:     { name: 'Grading',            blurb: 'Rough and finish grade to pad spec. Inspection-ready hand-off.',       icon: '<polyline points="2 18 8 12 12 14 22 6"/><polyline points="16 6 22 6 22 12"/>' },
  demolition:  { name: 'Demolition',         blurb: 'Tear-outs and small structure removal. Hauled and disposed.',          icon: '<polygon points="2 22 5 15 12 8 16 12 9 19 2 22"/><line x1="14" y1="6" x2="20" y2="12"/>' },
  clearing:    { name: 'Land Clearing',      blurb: 'Brush, stumps, debris. Lot opened up and ready to dig.',               icon: '<path d="M12 22V8"/><path d="M5 12 12 4l7 8"/><path d="M3 22h18"/>' },
  paving:      { name: 'Paving',             blurb: 'Asphalt and concrete prep, base, and finish work.',                    icon: '<rect x="3" y="10" width="18" height="6"/><line x1="3" y1="13" x2="21" y2="13" stroke-dasharray="3 3"/>' },
  concrete:    { name: 'Concrete',           blurb: 'Footings, slabs, flatwork. Formed, poured, finished.',                 icon: '<rect x="3" y="6" width="18" height="12"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="9" y1="6" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="18"/>' },
  septic:      { name: 'Septic Systems',     blurb: 'Tanks, leach fields, and rural site work. Permits handled.',           icon: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M8 9V5a4 4 0 0 1 8 0v4"/>' },
  hauling:     { name: 'Hauling',            blurb: 'Dirt, gravel, and debris in and out. Same day when we can.',           icon: '<rect x="1" y="8" width="14" height="9"/><polygon points="15 11 22 11 22 17 15 17"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="20" r="2"/>' },
};

const DEFAULT_SERVICES = ['excavation', 'trenching', 'grading', 'demolition', 'clearing', 'paving', 'concrete', 'hauling'];

export function normalize(row) {
  const business_name = pick(row.business_name, row.name) || 'Local Excavation';
  // brand_name is the version used everywhere the period dot accent is appended
  // (logo, footer brand). Strips a trailing "." so "Moore's Gravel Inc." doesn't
  // render as "Moore's Gravel Inc.." when the dot accent fires.
  const brand_name = business_name.replace(/\.+$/, '');
  const city          = str(row.city);
  const state         = str(row.state_code) || str(row.state);
  const state_code    = str(row.state_code) || twoLetterState(row.state);
  const phone         = str(row.phone);
  const phone_e164    = phoneE164(phone);
  const email         = str(row.email);
  const website       = str(row.website);
  const address_street = str(row.address_street) || str(row.street);
  const zip           = str(row.zip) || str(row.postal_code);
  const description_long  = str(row.description_long) || str(row.description);
  const description_short = str(row.description_short) || str(row.tagline);
  const rating_avg   = num(row.rating_avg ?? row.rating);
  const review_count = num(row.review_count ?? row.reviews) ?? 0;

  // Services: prefer explicit `services` column, fall back to `subtypes` (scrape default)
  const rawServices = parseList(row.services ?? row.subtypes);
  const services_for_grid = pickServicesForGrid(rawServices);

  const address_full = composeAddress({ street: address_street, city, state: state_code || state, zip });
  const map_embed_url = mapEmbed({ address_full, business_name, city, state: state_code || state });

  const hero_sub = description_short
    || `Excavation, trenching, and site prep in ${city}${state_code ? ', ' + state_code : ''}. Quotes back in 24 hours. Sites left clean. No surprise line items.`;

  const seo_title       = `Excavation ${city}${state_code ? ', ' + state_code : ''} | ${business_name}`.slice(0, 70);
  const seo_description = `${business_name}: excavation, trenching, and site prep in ${city}${state_code ? ', ' + state_code : ''}. Quotes in 24 hours. Call ${phone}.`.slice(0, 160);

  // Social URLs — optional; only render in template if present.
  const social = {
    facebook:  str(row.company_facebook)  || str(row.facebook),
    instagram: str(row.company_instagram) || str(row.instagram),
    linkedin:  str(row.company_linkedin)  || str(row.linkedin),
  };

  return {
    business_name,
    brand_name,
    social,
    phone,
    phone_e164,
    email,
    website,
    address_street,
    city,
    state,
    state_code,
    zip,
    address_full,
    description_long,
    description_short,
    hero_sub,
    hero_image: DEFAULT_HERO,
    services: rawServices,
    services_for_grid,
    rating_avg,
    review_count,
    map_embed_url,
    seo_title,
    seo_description,
    raw: row,
  };
}

// 5 common FAQs every excavation business can answer the same way.
// Used on the home page and as FAQPage schema for SEO.
export function faqsFor(data) {
  const phone = data.phone || 'us';
  const loc = data.city ? (data.state_code ? `${data.city}, ${data.state_code}` : data.city) : 'the local area';
  return [
    {
      q: 'How fast can you turn a quote?',
      a: 'For most projects, 24 business hours from when we get the scope. Bigger jobs that need a site walk take a day or two longer.',
    },
    {
      q: 'Do you handle the permits?',
      a: 'For demolition, septic, and most utility trenching, yes. For new-build excavation tied to a GC, the GC usually pulls the permit and we work under it. We will tell you which on the first call.',
    },
    {
      q: `Are you licensed and insured in ${loc}?`,
      a: 'Yes. Full general liability and workers comp. Certificates of insurance available before we break ground. License documentation on request.',
    },
    {
      q: 'How do I know my quote is honest?',
      a: 'Itemized line items, no vague allowances. If conditions change underground (rock, water, unmarked utilities), we stop and call before we run a change order. No quiet surprises on the final bill.',
    },
    {
      q: `Do you work outside of ${data.city || 'the metro'}?`,
      a: `Most of our work is within an hour of home base. We will travel further for the right project — call ${phone} and we will tell you straight if your job is in range.`,
    },
  ];
}

export function buildBreadcrumbLd(siteUrl, slug, crumbs) {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${slug}/` }];
  crumbs.forEach((c, i) => {
    const entry = { '@type': 'ListItem', position: i + 2, name: c.name };
    if (c.path) entry.item = `${siteUrl}/${slug}/${c.path}`;
    items.push(entry);
  });
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items });
}

export function buildServiceLd(data, pageKey) {
  const serviceName = ({
    'services/excavation':        'Excavation',
    'services/utility-trenching': 'Utility Trenching',
    'services/grading':           'Grading',
    'services/demolition':        'Demolition',
  })[pageKey] || 'Excavation Services';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${serviceName} — ${data.business_name}`,
    serviceType: serviceName,
    provider: {
      '@type': 'GeneralContractor',
      name: data.business_name,
      telephone: data.phone,
      url: data.site_url,
    },
    areaServed: data.city ? { '@type': 'City', name: data.city } : undefined,
    description: data.seo_description,
    url: data.site_url,
  });
}

export function buildFaqLd(faqs) {
  if (!faqs || !faqs.length) return null;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
}

export function buildJsonLd(data) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: data.business_name,
    description: data.seo_description,
    url: data.site_url,
    telephone: data.phone,
    image: data.hero_image,
  };
  if (data.email) ld.email = data.email;
  if (data.address_street || data.city) {
    ld.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address_street || undefined,
      addressLocality: data.city || undefined,
      addressRegion:   data.state_code || data.state || undefined,
      postalCode:      data.zip || undefined,
      addressCountry:  'US',
    };
  }
  if (data.rating_avg && data.review_count) {
    ld.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating_avg,
      reviewCount: data.review_count,
    };
  }
  ld.areaServed = data.city ? [{ '@type': 'City', name: data.city }] : undefined;
  return JSON.stringify(ld);
}

const str = (v) => (v == null ? '' : String(v).trim());
const num = (v) => {
  if (v == null || v === '') return null;
  const n = Number(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
};
const pick = (...vals) => { for (const v of vals) { const s = str(v); if (s) return s; } return ''; };

function phoneE164(raw) {
  const digits = str(raw).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

function composeAddress({ street, city, state, zip }) {
  const parts = [
    str(street),
    [str(city), str(state)].filter(Boolean).join(', '),
    str(zip),
  ].filter(Boolean);
  return parts.join(', ');
}

function parseList(raw) {
  if (raw == null || raw === '') return [];
  if (Array.isArray(raw)) return raw.map(str).filter(Boolean);
  const s = String(raw).trim();
  if (s.startsWith('[')) { try { return JSON.parse(s).map(str).filter(Boolean); } catch {} }
  return s.split(/[;|,]/).map((x) => x.trim()).filter(Boolean);
}

function pickServicesForGrid(rawServices) {
  // Map scrape strings ("Excavating contractor", "Paving contractor") to our service library.
  const keys = new Set();
  for (const s of rawServices) {
    const low = s.toLowerCase();
    if (low.includes('excavat')) keys.add('excavation');
    if (low.includes('trench'))  keys.add('trenching');
    if (low.includes('grad'))    keys.add('grading');
    if (low.includes('demo'))    keys.add('demolition');
    if (low.includes('clear') || low.includes('brush') || low.includes('land')) keys.add('clearing');
    if (low.includes('pav') || low.includes('asphalt')) keys.add('paving');
    if (low.includes('concrete') || low.includes('foundation')) keys.add('concrete');
    if (low.includes('septic')) keys.add('septic');
    if (low.includes('haul') || low.includes('truck')) keys.add('hauling');
  }
  // If we matched fewer than 4, top up with defaults so the grid stays full.
  for (const k of DEFAULT_SERVICES) {
    if (keys.size >= 8) break;
    keys.add(k);
  }
  return Array.from(keys).slice(0, 8).map((k) => SERVICE_LIBRARY[k]);
}

function mapEmbed({ address_full, business_name, city, state }) {
  const q = address_full || [business_name, city, state].filter(Boolean).join(' ');
  if (!q) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}

function twoLetterState(s) {
  const map = { alabama:'AL',alaska:'AK',arizona:'AZ',arkansas:'AR',california:'CA',colorado:'CO',connecticut:'CT',delaware:'DE',florida:'FL',georgia:'GA',hawaii:'HI',idaho:'ID',illinois:'IL',indiana:'IN',iowa:'IA',kansas:'KS',kentucky:'KY',louisiana:'LA',maine:'ME',maryland:'MD',massachusetts:'MA',michigan:'MI',minnesota:'MN',mississippi:'MS',missouri:'MO',montana:'MT',nebraska:'NE',nevada:'NV','new hampshire':'NH','new jersey':'NJ','new mexico':'NM','new york':'NY','north carolina':'NC','north dakota':'ND',ohio:'OH',oklahoma:'OK',oregon:'OR',pennsylvania:'PA','rhode island':'RI','south carolina':'SC','south dakota':'SD',tennessee:'TN',texas:'TX',utah:'UT',vermont:'VT',virginia:'VA',washington:'WA','west virginia':'WV',wisconsin:'WI',wyoming:'WY' };
  const k = str(s).toLowerCase();
  return map[k] || '';
}
