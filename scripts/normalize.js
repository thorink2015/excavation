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

// Primary-category copy variants. Detected from CSV `subtypes` / `category` columns.
// Each variant overrides H1, hero subhead, SEO title prefix, and the trust badge headline
// so a paving-first business reads as paving and not as excavation.
const CATEGORY_VARIANTS = {
  excavation: {
    match: ['excavat'],
    h1_pre: "Site prep that doesn't ", h1_accent: 'slow your build.',
    hero_sub: (city, st) => `Excavation, trenching, and site prep in ${city}${st ? ', ' + st : ''}. Quotes back in 24 hours. Sites left clean. No surprise line items.`,
    title_prefix: 'Excavation',
    services_first: ['excavation', 'trenching', 'grading', 'demolition'],
  },
  paving: {
    match: ['pav', 'asphalt'],
    h1_pre: 'Paving that ', h1_accent: 'lasts the warranty.',
    hero_sub: (city, st) => `Asphalt and concrete paving for driveways, parking lots, and commercial pads in ${city}${st ? ', ' + st : ''}. Quotes back in 24 hours.`,
    title_prefix: 'Paving',
    services_first: ['paving', 'grading', 'concrete', 'excavation'],
  },
  demolition: {
    match: ['demoli'],
    h1_pre: 'Demolition done ', h1_accent: 'clean and on time.',
    hero_sub: (city, st) => `Structure tear-outs, slab removal, pool demo across ${city}${st ? ', ' + st : ''}. Permits handled, debris hauled, site left clean.`,
    title_prefix: 'Demolition',
    services_first: ['demolition', 'hauling', 'excavation', 'clearing'],
  },
  septic: {
    match: ['septic'],
    h1_pre: 'Septic systems ', h1_accent: 'built to pass inspection.',
    hero_sub: (city, st) => `Septic tank install, leach field repair, and rural site work in ${city}${st ? ', ' + st : ''}. Permits handled, inspection-ready hand-off.`,
    title_prefix: 'Septic Systems',
    services_first: ['septic', 'trenching', 'excavation', 'grading'],
  },
  concrete: {
    match: ['concrete', 'foundation'],
    h1_pre: 'Concrete and footings ', h1_accent: 'poured to spec.',
    hero_sub: (city, st) => `Footings, slabs, flatwork, and foundation prep in ${city}${st ? ', ' + st : ''}. Formed, poured, finished — inspection-ready.`,
    title_prefix: 'Concrete',
    services_first: ['concrete', 'excavation', 'grading', 'demolition'],
  },
  trenching: {
    match: ['trench', 'utility'],
    h1_pre: 'Utility trenching ', h1_accent: 'done to spec.',
    hero_sub: (city, st) => `Water, sewer, gas, and electric trenching in ${city}${st ? ', ' + st : ''}. Locates handled, spec-depth bedding, lines protected through backfill.`,
    title_prefix: 'Utility Trenching',
    services_first: ['trenching', 'excavation', 'grading', 'concrete'],
  },
  general_construction: {
    match: ['general contract', 'construction company', 'builder'],
    h1_pre: 'Site work and ', h1_accent: 'general construction.',
    hero_sub: (city, st) => `Excavation, site prep, and general construction services in ${city}${st ? ', ' + st : ''}. One crew, one quote, one schedule.`,
    title_prefix: 'Site Work & Construction',
    services_first: ['excavation', 'concrete', 'grading', 'demolition'],
  },
};

function detectCategory(subtypes, fallbackDescription) {
  // The scraper lists subtypes in priority order — first is primary.
  // ("Excavating contractor, Paving contractor" → excavation is primary.)
  const subtypeList = String(subtypes || '').split(/[,;|]/).map((s) => s.trim().toLowerCase()).filter(Boolean);

  function matchOne(text) {
    if (!text) return null;
    // Excavation first — this is the niche we lead with whenever it applies.
    if (text.includes('excavat')) return 'excavation';
    if (text.includes('septic'))  return 'septic';
    if (text.includes('demoli'))  return 'demolition';
    if (text.includes('pav') || text.includes('asphalt')) return 'paving';
    if (text.includes('concrete') || text.includes('foundation')) return 'concrete';
    if (text.includes('trench') || text.includes('utility')) return 'trenching';
    if (text.includes('general contract') || text.includes('construction company') || text.includes('builder')) return 'general_construction';
    return null;
  }

  for (const st of subtypeList) {
    const cat = matchOne(st);
    if (cat) return cat;
  }
  const cat = matchOne(String(fallbackDescription || '').toLowerCase());
  return cat || 'excavation';
}

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

  // Google Maps / Reviews — must be declared before address/map_embed_url which uses place_id.
  const reviews_link_early = str(row.reviews_link)  || str(row.location_reviews_link);
  const maps_link_early    = str(row.location_link);
  const place_id_early     = str(row.place_id);

  // Services: prefer explicit `services` column, fall back to `subtypes` (scrape default)
  const rawServices = parseList(row.services ?? row.subtypes);

  // Detect primary category (excavation / paving / demolition / septic / concrete / etc.)
  // from the scraper's subtypes + free-form description.
  const primaryCategory = detectCategory(rawServices.join(' '), description_long);
  const variant = CATEGORY_VARIANTS[primaryCategory];

  // Build services_for_grid honoring the variant's "what we lead with" order.
  const services_for_grid = pickServicesForGrid(rawServices, variant.services_first);

  const address_full = composeAddress({ street: address_street, city, state: state_code || state, zip });
  // Map embed always uses the simple query URL (no API key required, more reliable in iframes).
  const map_embed_url    = mapEmbed({ address_full, business_name, city, state: state_code || state });
  const map_embed_simple = map_embed_url;

  const stCode = state_code || state || '';
  const hero_h1_pre    = variant.h1_pre;
  const hero_h1_accent = variant.h1_accent;
  const hero_sub       = description_short || variant.hero_sub(city || 'your area', stCode);

  const seo_title       = `${variant.title_prefix} ${city}${stCode ? ', ' + stCode : ''} | ${business_name}`.slice(0, 70);
  const seo_description = `${business_name}: ${variant.title_prefix.toLowerCase()} services in ${city}${stCode ? ', ' + stCode : ''}. Quotes in 24 hours. Call ${phone}.`.slice(0, 160);

  // Social URLs — optional; only render in template if present.
  const social = {
    facebook:  str(row.company_facebook)  || str(row.facebook),
    instagram: str(row.company_instagram) || str(row.instagram),
    linkedin:  str(row.company_linkedin)  || str(row.linkedin),
  };

  // Google Maps + Reviews (re-aliased from the early declarations above for readability).
  const reviews_link  = reviews_link_early;
  const maps_link     = maps_link_early;
  const place_id      = place_id_early;
  const verified      = String(row.verified || '').toUpperCase() === 'TRUE';

  // Email — only surface if the scraper validated it as deliverable.
  const emailStatus   = String(row['email.emails_validator.status'] || '').toUpperCase();
  const email_valid   = !emailStatus || emailStatus === 'RECEIVING' || emailStatus === 'VALID';

  // Real per-business hero photo from Google (when present) — falls back to a generic
  // Unsplash excavation photo at the template level.
  const business_photo = str(row.photo);
  const business_logo  = str(row.logo);
  const street_view    = str(row.street_view);

  // Owner / team
  const owner_name     = str(row.full_name) || pick(row.first_name, row.last_name);
  const first_name     = str(row.first_name);
  const name_short     = str(row.name_for_emails) || business_name;

  // Business meta (often sparse — render conditionally)
  const founded_year   = str(row['company_insights.founded_year']);
  const employees      = str(row['company_insights.employees']);
  const domain         = str(row.domain);

  // Working hours table for the Contact page and footer.
  const hours_table    = parseHoursTable(row.working_hours, row.working_hours_csv_compatible);

  return {
    business_name,
    brand_name,
    name_short,
    social,
    phone,
    phone_e164,
    email: email_valid ? email : '',
    email_valid,
    website,
    domain,
    address_street,
    city,
    state,
    state_code,
    zip,
    address_full,
    description_long,
    description_short,
    hero_sub,
    // Per-business hero photo (real Google photo) wins; template falls back to DEFAULT_HERO if empty.
    hero_image: business_photo || DEFAULT_HERO,
    business_photo,
    business_logo,
    street_view,
    primary_category: primaryCategory,
    hero_h1_pre, hero_h1_accent,
    services: rawServices,
    services_for_grid,
    rating_avg,
    review_count,
    reviews_link,
    maps_link,
    place_id,
    verified,
    owner_name,
    first_name,
    founded_year,
    employees,
    hours_table,
    map_embed_url,
    map_embed_simple,
    seo_title,
    seo_description,
    raw: row,
  };
}

// Parse working_hours JSON into a uniform [{day, hours}] array for templates.
function parseHoursTable(jsonStr, csvStr) {
  if (jsonStr) {
    try {
      const obj = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      if (obj && typeof obj === 'object') {
        const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        return days.filter((d) => obj[d]).map((d) => {
          const v = obj[d];
          const hours = Array.isArray(v) ? v.join(', ') : String(v);
          return { day: d, hours: hours === 'Closed' ? 'Closed' : hours };
        });
      }
    } catch {}
  }
  // Fallback: "Monday,7AM,4:30PM|Tuesday,..." format
  const s = String(csvStr || jsonStr || '').trim();
  if (!s) return [];
  if (s.includes('|')) {
    return s.split('|').map((seg) => {
      const [day, open, close] = seg.split(',').map((x) => x.trim());
      if (!day) return null;
      return { day, hours: open && close ? `${open}–${close}` : (open || 'Closed') };
    }).filter(Boolean);
  }
  return [];
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

function pickServicesForGrid(rawServices, leadOrder = []) {
  // Detect which services the business actually offers based on scraper subtypes.
  const detected = new Set();
  for (const s of rawServices) {
    const low = s.toLowerCase();
    if (low.includes('excavat')) detected.add('excavation');
    if (low.includes('trench'))  detected.add('trenching');
    if (low.includes('grad'))    detected.add('grading');
    if (low.includes('demo'))    detected.add('demolition');
    if (low.includes('clear') || low.includes('brush') || low.includes('land')) detected.add('clearing');
    if (low.includes('pav') || low.includes('asphalt')) detected.add('paving');
    if (low.includes('concrete') || low.includes('foundation')) detected.add('concrete');
    if (low.includes('septic')) detected.add('septic');
    if (low.includes('haul') || low.includes('truck')) detected.add('hauling');
  }
  // Order: variant's lead order first (only if detected or default), then remaining detected, then DEFAULT_SERVICES fillers.
  const ordered = [];
  const seen = new Set();
  for (const k of leadOrder) {
    if (!seen.has(k) && SERVICE_LIBRARY[k]) { ordered.push(k); seen.add(k); }
  }
  for (const k of detected) {
    if (!seen.has(k) && SERVICE_LIBRARY[k]) { ordered.push(k); seen.add(k); }
  }
  for (const k of DEFAULT_SERVICES) {
    if (ordered.length >= 8) break;
    if (!seen.has(k) && SERVICE_LIBRARY[k]) { ordered.push(k); seen.add(k); }
  }
  return ordered.slice(0, 8).map((k) => SERVICE_LIBRARY[k]);
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
