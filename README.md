# Harrison Liquor & Wine Market

Static business website for Harrison Liquor & Wine Market in Lincoln Park, Michigan.

The project uses plain HTML, CSS, JavaScript, local JSON data files, and optimized store/reel photography. It intentionally avoids React, Next.js, WordPress, a database, or a production Node.js runtime.

## Local preview

```bash
python3 -m http.server 4180
```

Then open `http://localhost:4180`.

## Editable content

Business content that may change often lives in `data/`:

- `data/store.json` for name, address, phone, email, map link, and hours.
- `data/deals.json` for current in-store deal cards.
- `data/categories.json` for customer browsing categories.
- `data/products.json` for new-arrival, premium, and request-focused cards.
- `data/testimonials.json` for future trust/proof content.

Use conservative language for products and deals. Do not claim live pricing, ratings, or availability unless the visible page is kept accurate.

## Validation

```bash
scripts/validate-site.sh
```

The script checks JSON syntax, JavaScript syntax, referenced assets, and oversized optimized images.

## Deployment options

The site can still be served as static files from GitHub Pages, Vercel, or another static host.

An optional pinned NGINX Alpine container foundation is also included:

```bash
docker build -t harrison-liquor-web:local .
docker run --rm -p 8080:8080 harrison-liquor-web:local
```

Then open `http://localhost:8080` or check `http://localhost:8080/health.html`.
