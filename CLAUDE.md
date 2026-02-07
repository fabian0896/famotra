# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Famotra is a personal finance management web application built with React 19, TypeScript, and Supabase. Users can manage bank accounts, track transactions (income/expense/transfer), categorize spending, and create shortcuts for frequent merchants/cards. Includes an admin dashboard.

## Commands

```bash
npm run dev          # Start Vite dev server on port 3000
npm run build        # Vite build + TypeScript check
npm run test         # Run Vitest (all tests)
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run check        # Format + lint fix together
npm run update-types # Regenerate Supabase database types into src/models/database.types.ts
npm run deploy       # Deploy Supabase edge functions to production
```

To add new Shadcn UI components:
```bash
pnpx shadcn@latest add <component-name>
```

## Architecture

### Frontend (React + Vite)

- **Routing:** TanStack Router with file-based routing in `src/routes/`. Routes under `_authenticated/` are protected and use a sidebar + breadcrumb layout. The route tree is auto-generated in `src/routeTree.gen.ts`.
- **Data fetching:** TanStack React Query. Query options are defined in `query-options/` files within each module or at `src/query-options/`. Query keys are centralized in `src/constants/query-keys.ts`.
- **Forms:** TanStack React Form with custom field components in `src/components/form/`.
- **UI components:** Shadcn UI (new-york style, zinc base color) in `src/components/ui/`. Config in `components.json`.
- **Styling:** Tailwind CSS 4 with dark/light theme support via `next-themes`.
- **Path alias:** `@/` maps to `./src/`.

### Backend (Supabase)

- **Database:** Supabase PostgreSQL. Auto-generated types in `src/models/database.types.ts`.
- **Edge functions:** Deno 2 + Hono framework in `supabase/functions/shorcut/`. Endpoints for transaction CRUD, categories, and accounts. Uses JWT auth middleware and Zod validation.
- **Auth:** Supabase Auth with JWT tokens.

### Module Structure

Feature code lives in `src/modules/` with each module following this pattern:
```
modules/<feature>/
├── components/      # Feature-specific UI components
├── pages/           # Page components referenced by routes
├── services/        # Static service classes for data operations
├── query-options/   # TanStack Query definitions
├── models/          # TypeScript interfaces
└── constants/       # Module constants
```

Modules: `auth`, `transactions`, `accounts`, `categories`, `shortcuts`, `admin`, `settings`.

### Key Patterns

- **Services** use static methods (e.g., `Auth.login()`, `Transactions.getAll()`).
- **Supabase client** is initialized in `src/integrations/supabase/client.ts`.
- **React Query client** is set up in `src/integrations/tanstack-query/query-client.ts`.
- **Amount formatting:** Transaction amounts are stored in centimes (integers) and converted for display.

### Deployment

- Frontend deploys to **Vercel** (SPA rewrite config in `vercel.json`).
- Edge functions deploy to **Supabase** via GitHub Actions on push to main (`.github/workflows/deploy-functions.yml`).

## Code Style

- Prettier: single quotes, trailing commas (es5), print width 100, always arrow parens.
- ESLint: TanStack config with React, Router, and Query plugins.
- Strict TypeScript with `noUnusedLocals` and `noUnusedParameters` enabled.
