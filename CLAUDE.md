# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev              # Start dev server (tsx watch + Vite HMR, default port 3000)
pnpm build            # Production build (vite build + esbuild server bundle)
pnpm start            # Run production server (node dist/index.js)
pnpm check            # TypeScript type-check (tsc --noEmit)
pnpm test             # Run tests (vitest run)
pnpm format           # Format code (prettier --write)
pnpm db:push          # Generate and run Drizzle migrations (drizzle-kit generate && migrate)
```

Package manager: **pnpm** (v10.4.1+)

## Architecture

Full-stack TypeScript app: React 19 frontend + Express/tRPC backend, both built with Vite 7.

### Server (`server/`)

- **Entry:** `server/_core/index.ts` — Express server with dynamic port fallback (+20 ports from 3000)
- **API:** tRPC v11 with superjson transformer. Router defined in `server/routers.ts`
- **Three procedure levels:** `publicProcedure`, `protectedProcedure` (authenticated), `adminProcedure` (role=admin, matched by OWNER_OPEN_ID)
- **Auth:** External OAuth server → JWT stored in httpOnly cookie (1-year expiry). Flow: OAuth callback → code exchange → getUserInfo → upsert DB user → sign JWT. Handled in `server/_core/sdk.ts` and `server/_core/oauth.ts`
- **Database:** MySQL via Drizzle ORM (`server/db.ts`). Tables: users, orders, newsletterSubscribers. Schema lives in `server/drizzle/schema/`
- **Payments:** Stripe checkout sessions. Webhook handler in `server/stripeWebhook.ts` processes `checkout.session.completed`
- **Downloads:** Token-based secure URLs for digital products (`server/downloadTokens.ts`, `server/downloadRoute.ts`)
- **Email:** Resend service for order confirmations (`server/emailService.ts`)

### Client (`client/`)

- **Entry:** `client/src/main.tsx` → tRPC + React Query provider setup
- **Routing:** Wouter (lightweight). 50+ routes defined in `client/src/App.tsx`
- **State:** React Context for cart (`CartContext`) and theme (`ThemeContext`). Server state via React Query/tRPC
- **Styling:** Tailwind CSS v4 with OKLCH-based custom theme in `client/src/index.css`. Brand colors: navy + gold
- **UI components:** `client/src/components/ui/` — Radix UI primitives (shadcn pattern)
- **Auth hook:** `client/src/_core/hooks/useAuth.ts`

### Path Aliases

- `@` → `client/src/`
- `@shared` → `shared/`
- `@assets` → `attached_assets/`

## Product Catalog

Products are hardcoded in `server/routers.ts` (100+ items). Categories: digital products (wellness, neurodiversity, education, grief, seasonal), wall art (country-specific cultural prints), greeting cards, books, print shop items.

## Environment Variables

Required: `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

## Testing

Vitest. Test files live alongside server code: `server/shop.checkout.test.ts`, `server/auth.logout.test.ts`.
