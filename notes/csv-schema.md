# CSV Schema (Real Data)

Both CSVs in `drops/` are identical schema — Google Maps + Instantly scraper output. 99 columns each.

- `drops/CSV Batch 1 - Excavation - Sheet1.csv` — **3 rows** pilot
- `drops/Excavatin Contracto - Instantly 1 - Sheet1.csv` — **211 rows** full

## Field mapping (source → normalized)

| Source column | Normalized field | Notes |
|---|---|---|
| `name` | `business_name` | always present |
| `phone` | `phone` | already in `+1 XXX-XXX-XXXX` shape; `phoneE164` strips formatting |
| `email` | `email` | usually present |
| `website` | `website` | full URL |
| `street` | `address_street` | |
| `city` | `city` | always present |
| `state` | `state` | full name ("California"); `state_code` is the 2-letter |
| `state_code` | (use this for `state` instead) | "CA" — better for headlines |
| `postal_code` | `zip` | |
| `description` | `description_long` | free-form |
| `subtypes` | `services` (parsed) | comma-separated, e.g. "Excavating contractor, Paving contractor" |
| `working_hours` | `hours` | JSON object: `{"Monday":["7AM-4:30PM"], ...}` |
| `rating` | `rating_avg` | numeric |
| `reviews` | `review_count` | numeric COUNT — **no text** |
| `reviews_per_score` | (skip or use for star histogram) | JSON `{"1":0,"2":0,"3":0,"4":1,"5":6}` |
| `company_insights.founded_year` | `founded_year` | often missing or wrong (scraper conflated companies) |
| `full_name`/`first_name` | `owner_name` | usually empty — handle gracefully |

## Critical gaps (template must degrade gracefully)

- **No individual review text** — the template's reviews section uses an aggregated rating + count + "Be one of our first reviews" CTA when no text reviews exist.
- **No `lat`/`lng`** — Google Maps embed uses address-based query (no API key needed); we set in `normalize.js` already.
- **No `owner_name`** typically — show "the team at [business_name]" as fallback in copy.
- **`founded_year`** is unreliable — only render if present and looks like a 4-digit year between 1900–current.

## normalize.js changes needed

Add these source-column fallbacks:
- `business_name`: try `row.name` first, then `row.business_name`
- `state` shorthand: prefer `row.state_code` over `row.state` for headlines/JSON-LD (use "CA" not "California")
- `services`: parse from `row.subtypes` (comma-separated)
- `description_long`: from `row.description`
- `rating_avg`, `review_count` from `row.rating`, `row.reviews`
