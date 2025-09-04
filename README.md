¡HYPEYA! Mini‑App is a mobile‑first Next.js application that fetches and displays the latest articles from the [¡HYPEYA!](https://hypeya.xyz) WordPress site. It includes advanced search and filtering (categories/tags), optimized mobile UX (gestures, haptics), and PWA support with offline fallback.

## Features

- Latest articles with pagination and loading states
- Advanced search with suggestions and real‑time filtering
- Category and tag filters with shared filter state
- Mobile UX: swipe gestures, pull‑to‑refresh (scaffolded), haptics
- Optimized images via Next Image and lazy loading
- Error boundaries, empty states, and performance monitoring
- PWA manifest + service worker for offline fallback

## Tech Stack

- Framework: Next.js 15 (App Router), React 19, TypeScript
- UI: Tailwind CSS 4, shadcn/ui, lucide-react
- Data: WordPress REST API (`https://hypeya.xyz/wp-json/wp/v2`)

## Quick Start

Prerequisites: Node.js 20 LTS and npm. A `.nvmrc` (20) is included.

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Create a `.env.local` from the example and fill values as needed:

```bash
cp .env.example .env.local
```

Environment variables:

- `WP_API_USERNAME` and `WP_API_KEY` are optional for authenticated WordPress requests (Application Passwords). The app reads public content without them, but credentials can help avoid rate limits or access protected resources.
- `NEXT_PUBLIC_API_DEBUG` enables extra client‑side logging.
- `NEXT_PUBLIC_OFFLINE_MODE` simulates offline behavior in development.

3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev`: Start dev server
- `npm run dev:turbopack`: Start dev with Turbopack
- `npm run build`: Build production bundle
- `npm run build:turbopack`: Build with Turbopack
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run typecheck`: TypeScript type checking
- `npm run analyze`: Analyze bundle size (after a build)

Bundle analysis uses `scripts/analyze-bundle.js` and prints page/chunk sizes and suggestions. If you build with Turbopack, the analyzer degrades gracefully with a lighter report.

## Environment

The app integrates with WordPress via `src/services/wordpress.ts` and `src/constants/api.ts`. Image remote patterns are configured in `next.config.ts` for WordPress/Gravatar domains.

PWA assets live in `public/` (`manifest.json`, `sw.js`, icons). The layout registers the service worker via `src/components/ServiceWorkerInitializer.tsx`.

## Project Structure

Key directories under `src/`:

- `app/`: App Router pages (`page.tsx`, `layout.tsx`, error/offline pages)
- `components/`: UI, common, articles, search, mobile, error boundaries
- `hooks/`: Data fetching and filtering hooks (e.g., `useFilteredArticles`)
- `services/`: WordPress API service and transformations
- `types/`: Typed models for articles, categories, tags, API
- `lib/` and `utils/`: Helpers (e.g., service worker, haptics, performance)

See [architecture.md](docs/architecture.md) for a deeper breakdown and [tasks.md](docs/tasks.md) for implementation progress.

## Notable Routes

- `/`: Home (latest articles, filters, search)
- `/search`: Search results page (query via `?q=`)
- `/offline`: Offline fallback route

## Development Notes

- Accessibility: Work is in progress (see Phase 11 in [tasks.md](docs/tasks.md)).
- Mobile‑first: Verify layouts in responsive mode (375px–430px).
- API limits: Public endpoints are used; credentials can reduce rate‑limit issues.

## Web3 Integration

- OnchainKit + Wagmi + Viem integration added for Base network (wallet connect, smart wallets, and creator tipping scaffolding).
- See [ONCHAINKIT_INTEGRATION.md](docs/ONCHAINKIT_INTEGRATION.md) for setup and required environment variables (`NEXT_PUBLIC_ONCHAINKIT_*`).

## Troubleshooting

- Empty article list: Ensure WordPress API is reachable from your network; check browser console for CORS/network errors.
- Images not loading: Confirm domains in `next.config.ts > images.remotePatterns` match requested image hosts.
- Bundle analysis requires a prior build: run `npm run build` then `npm run analyze`.

## License

This project is for internal use and evaluation. Do not commit real credentials. If publishing, add a proper license file.

## Docs Index

- [architecture.md](docs/architecture.md): High‑level architecture and structure
- [DEPLOYMENT.md](docs/DEPLOYMENT.md): Vercel deployment guide
- [WORDPRESS_API_OPTIMIZATION.md](docs/WORDPRESS_API_OPTIMIZATION.md): `_embed` optimization summary
- [EMBEDDED_DATA_FIX.md](docs/EMBEDDED_DATA_FIX.md): Embedded data extraction fixes
- [ONCHAINKIT_INTEGRATION.md](docs/ONCHAINKIT_INTEGRATION.md): Web3 integration notes
- [tasks.md](docs/tasks.md): Phased implementation log
