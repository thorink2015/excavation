// Convert a raw CSV row (all string values) into a typed object the template can consume.
// This is the ONE place to add new fields when the CSV schema changes.

export function normalize(row) {
  return {
    // Identity
    business_name: str(row.business_name) || str(row.name) || 'Local Excavation',
    owner_name:    str(row.owner_name),

    // Contact
    phone:      str(row.phone),
    phone_e164: phoneE164(row.phone),
    email:      str(row.email),
    website:    str(row.website),

    // Location
    address_street: str(row.address_street) || str(row.street),
    city:           str(row.city),
    state:          str(row.state),
    zip:            str(row.zip) || str(row.postal_code),
    address_full:   composeAddress(row),
    lat:            num(row.lat ?? row.latitude),
    lng:            num(row.lng ?? row.longitude),

    // Copy
    description_short: str(row.description_short) || str(row.tagline),
    description_long:  str(row.description_long) || str(row.description),
    founded_year:      str(row.founded_year),
    hours:             parseHours(row.hours),

    // Services: CSV may store as "Grading;Demolition;Land Clearing" or JSON array
    services: parseList(row.services),

    // Reviews: prefer JSON column, fall back to flattened columns
    reviews:      parseReviews(row.reviews),
    rating_avg:   num(row.rating_avg ?? row.rating),
    review_count: num(row.review_count ?? row.reviews_count),

    // Map embed (Google Maps query URL — works without an API key)
    map_embed_url: mapEmbed(row),

    // Raw row escape hatch for templates that need a column we haven't normalized
    raw: row,
  };
}

const str = (v) => (v == null ? '' : String(v).trim());
const num = (v) => {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function phoneE164(raw) {
  const digits = str(raw).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

function composeAddress(row) {
  const parts = [
    str(row.address_street) || str(row.street),
    [str(row.city), str(row.state)].filter(Boolean).join(', '),
    str(row.zip) || str(row.postal_code),
  ].filter(Boolean);
  return parts.join(', ');
}

function parseList(raw) {
  if (raw == null || raw === '') return [];
  if (Array.isArray(raw)) return raw.map(str).filter(Boolean);
  const s = String(raw).trim();
  if (s.startsWith('[')) {
    try { return JSON.parse(s).map(str).filter(Boolean); } catch {}
  }
  return s.split(/[;|,]/).map((x) => x.trim()).filter(Boolean);
}

function parseReviews(raw) {
  if (raw == null || raw === '') return [];
  if (Array.isArray(raw)) return raw;
  const s = String(raw).trim();
  if (s.startsWith('[')) {
    try {
      return JSON.parse(s).map((r) => ({
        author: str(r.author ?? r.name),
        rating: num(r.rating ?? r.stars),
        text:   str(r.text ?? r.review ?? r.body),
        date:   str(r.date ?? r.time),
      }));
    } catch { return []; }
  }
  return [];
}

function parseHours(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  const s = String(raw).trim();
  if (s.startsWith('{')) { try { return JSON.parse(s); } catch {} }
  return s; // fall back to a single string the template renders verbatim
}

function mapEmbed(row) {
  const q = composeAddress(row) || [row.business_name, row.city, row.state].filter(Boolean).join(' ');
  if (!q) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}
