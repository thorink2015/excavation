// Deterministic, URL-safe slugs from business name (and city as tie-breaker only).
// Most businesses get a clean /<name>/ URL. Only collisions add the city, then -N.

export function slugify(text) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')        // strip accents
    .toLowerCase()
    .replace(/['']/g, '')                   // drop apostrophes ("o'brien" -> "obrien")
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// Build a Map<row, slug> with collision-free slugs.
// Order of preference for each row:
//   1. slugify(name)                — clean: /moores-gravel-inc/
//   2. slugify(name)-slugify(city)  — disambiguated: /ace-excavation-austin/
//   3. <above>-2, -3, ...           — final fallback
export function buildUniqueSlugs(rows, {
  nameKeys = ['business_name', 'name'],
  cityKey = 'city',
} = {}) {
  const slugMap = new Map();
  const used = new Set();

  function pickName(row) {
    for (const k of nameKeys) {
      const v = (row[k] ?? '').toString().trim();
      if (v) return v;
    }
    return 'business';
  }

  for (const row of rows) {
    const name = pickName(row);
    const city = row[cityKey] ?? '';
    const nameSlug = slugify(name) || 'business';
    const citySlug = slugify(city);

    // Try clean name first
    let slug = nameSlug;
    if (used.has(slug) && citySlug) {
      // Try name-city
      slug = `${nameSlug}-${citySlug}`;
    }
    if (used.has(slug)) {
      // Append -2, -3, ... until unique
      const base = slug;
      let n = 2;
      while (used.has(`${base}-${n}`)) n++;
      slug = `${base}-${n}`;
    }

    used.add(slug);
    slugMap.set(row, slug);
  }

  return slugMap;
}
