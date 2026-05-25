# Cloudflare

## Account

- Account ID: `6e0bb81b1001dd62f0acd077858aa822`
- Account-wide Workers subdomain: `excavation.workers.dev` (NOT a Pages URL — different product)

## Pages project (target)

- Project name: `excavation` (or closest available — confirm with user once created)
- Live URL pattern: `https://excavation.pages.dev/<business-slug>/`
- Build command: `npm run build`
- Build output: `dist`
- Production branch: `main`
- Env var on Cloudflare: `SITE_URL=https://excavation.pages.dev`

## Setup status

- [ ] Pages project created in dashboard
- [ ] GitHub repo connected
- [ ] First deploy successful
- [ ] Env var `SITE_URL` set

## If we ever switch to API deploys

User would need to issue a Cloudflare API token with `Cloudflare Pages: Edit`
permission and add it as a GitHub repo secret named `CLOUDFLARE_API_TOKEN`,
plus `CLOUDFLARE_ACCOUNT_ID`. Never paste tokens in chat or commit them.
