# Harrison Liquor & Wine Market

Static business website for Harrison Liquor & Wine Market in Lincoln Park, Michigan.

The project now uses Astro as a lightweight component build layer for premium, SEO-friendly pages. Production output is still plain static HTML, CSS, JavaScript, JSON, and optimized store/reel photography. It intentionally avoids WordPress, a database, a CMS, or a production Node.js runtime.

## Local preview

For the current static workspace:

```bash
python3 -m http.server 4180
```

Then open `http://localhost:4180`.

For the Astro component workflow:

```bash
npm install
npm run dev
```

Then open `http://localhost:4182`.

Use Node.js 22.12 or newer for Astro builds. The Dockerfile already uses a Node 22 build stage.

To build the production static output:

```bash
npm run build
npm run preview
```

Then open `http://localhost:4183`.

## Editable content

Business content that may change often lives in `data/`:

- `data/store.json` for name, address, phone, email, map link, and hours.
- `data/deals.json` for current in-store deal cards.
- `data/categories.json` for customer browsing categories.
- `data/featured-offers.json` for current offer-card content.
- `data/api-integrations.json` for approved or rejected public API ideas.
- `data/weekly-api-review.json` for owner-approved API review candidates shown on `/api-review.html`.
- `data/geo-trend-review.json` for weekly local search, weather, event, and catalog trend candidates shown on `/geo-trend-review.html`.
- `data/local-trend-signals.json` for live/review-only local trend inputs used by Mix & Match planning.
- `data/product-offer-image-sources.json` for the source trail behind optimized offer product images.
- `data/products.json` for new-arrival, premium, and request-focused cards.
- `data/testimonials.json` for future trust/proof content.

Use conservative language for products and deals. Do not claim live pricing, ratings, or availability unless the visible page is kept accurate.

Astro pages live in `src/pages/`, and reusable page sections live in `src/components/`. Legacy static pages are copied into `dist` during `npm run build` so rollback remains simple.

The featured offers and mix-and-match pages use Open-Meteo as optional browser-side enhancements for weather-aware shopping prompts. External product, grocery, alcohol, tobacco, vape, local event, or search-trend APIs must first be listed on a noindex owner review page and approved by the store before any result is reused publicly.

## Validation

```bash
scripts/validate-site.sh
npm run build
```

The validation script checks JSON syntax, JavaScript syntax, referenced assets, duplicate SEO titles/descriptions, and repeated or near-duplicate public image usage. The build command verifies the Astro component layer and produces `dist`.

## Deployment options

The site can still be served as static files from GitHub Pages, Vercel, or another static host. Use `dist` as the production output directory.

The Dockerfile uses Node only in the build stage, then serves the finished static site from a small NGINX Alpine image:

```bash
docker build -t harrison-liquor-web:local .
docker run --rm -p 8080:8080 harrison-liquor-web:local
```

Then open `http://localhost:8080` or check `http://localhost:8080/health.html`.
