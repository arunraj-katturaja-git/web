# Aruvi Mill Web (Day-1 Foundation)

Next.js storefront starter for the bilingual (English + Tamil) AI-powered mill eCommerce platform.

## What is ready

- Locale-based routes: `/en` and `/ta`
- Language switcher in header
- Natural/organic visual baseline
- Strapi-backed product fetching through the commerce API
- Home + product listing pages
- Health endpoint: `/api/health`

## Run locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and update values when Strapi is available.

## Key paths

- `src/app/[lang]/page.tsx`: localized homepage
- `src/app/[lang]/products/page.tsx`: localized product listing
- `src/lib/i18n/*`: i18n config and translations
- `src/lib/strapi/*`: Strapi integration helpers
- `src/types/product.ts`: product view models
