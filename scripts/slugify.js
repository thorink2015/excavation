// Deterministic, URL-safe slugs from business name + city.
// Guarantees uniqueness across the full CSV by appending a counter on collisions.

export function slugify(text) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')      // strip accents
    .toLowerCase()
    .replace(/['']/g, '')                  // drop apostrophes ("o'brien" -> "obrien")
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// Build a Map<row, slug> with collision-free slugs for an entire dataset.
// Slug = slugify(name)-slugify(city); if multiple rows collapse to the same slug
// (e.g. two "ACME Excavation" in "Austin"), suffix with -2, -3, ...
// nameKeys are tried in order; the first non-empty value wins.
export function buildUniqueSlugs(rows, {
  nameKeys = ['business_name', 'name'],
  cityKey = 'city',
} = {}) {
  const slugMap = new Map();
  const counts = new Map();

  for (const row of rows) {
    let nameValue = '';
    for (const k of nameKeys) {
      const v = (row[k] ?? '').toString().trim();
      if (v) { nameValue = v; break; }
    }
    const namePart = slugify(nameValue || 'business');
    const cityPart = slugify(row[cityKey] ?? '');
    const base = cityPart ? `${namePart}-${cityPart}` : namePart;

    const seen = counts.get(base) ?? 0;
    const slug = seen === 0 ? base : `${base}-${seen + 1}`;
    counts.set(base, seen + 1);
    slugMap.set(row, slug);
  }

  return slugMap;
}
