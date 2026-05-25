# Template directory

Drop your existing template files here:

- `template/index.html` — your main HTML page
- `template/assets/` — CSS, JS, images, fonts (anything referenced by the HTML)

Once they're in place, I'll wire `{{placeholder}}` tags into `index.html` so the build script
can substitute each business's data per page. You don't need to touch anything else.

## Placeholder reference (what will be available in the template)

The build script feeds these variables into every page render:

| Variable | Type | Example |
|---|---|---|
| `business_name` | string | "ACME Excavation" |
| `owner_name` | string | "Jim Carter" |
| `phone` | string | "(512) 555-0101" |
| `phone_e164` | string (for `tel:` links) | "+15125550101" |
| `email` | string | "contact@acme-ex.com" |
| `website` | string | "https://acme-ex.example" |
| `address_street` | string | "1200 Industrial Blvd" |
| `address_full` | string | "1200 Industrial Blvd, Austin, TX, 78745" |
| `city` / `state` / `zip` | string | "Austin" / "TX" / "78745" |
| `lat` / `lng` | number | 30.2127 / -97.7686 |
| `founded_year` | string | "1998" |
| `description_short` | string | one-line tagline |
| `description_long` | string | paragraph copy |
| `services` | string[] | `["Site Prep", "Grading", ...]` |
| `hours` | string or object | "Mon-Fri 7am-5pm" |
| `rating_avg` | number | 4.8 |
| `review_count` | number | 127 |
| `reviews` | `{author, rating, text, date}[]` | array of review objects |
| `map_embed_url` | string | Google Maps embed URL (no API key) |
| `slug` | string | URL slug for this business |
| `site_url` | string | full public URL of this page |
| `canonical` | string | same as `site_url`, for `<link rel="canonical">` |
| `raw` | object | original CSV row, for escape-hatch access |

## Syntax (Eta template engine)

```html
<!-- Simple value -->
<h1><%= it.business_name %></h1>

<!-- Conditional -->
<% if (it.email) { %>
  <a href="mailto:<%= it.email %>">Email us</a>
<% } %>

<!-- Loop -->
<ul>
  <% it.services.forEach(function(s) { %>
    <li><%= s %></li>
  <% }) %>
</ul>

<!-- Reviews -->
<% it.reviews.forEach(function(r) { %>
  <article>
    <strong><%= r.author %></strong> · <%= r.rating %>★
    <p><%= r.text %></p>
  </article>
<% }) %>
```
