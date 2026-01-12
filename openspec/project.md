# Project Context (OMI AI / Oh-My-Interior)

## Purpose

OMI AI is a “conversation-to-production” workspace for interior designers. It combines semantic chat with canvas point guidance (Point-to-Edit) to enable more controllable, mask-free editing, and supports a token-based Credits billing foundation at the product layer.

This repository currently focuses on:
- A Next.js App Router web application (including RSC / Route Handlers)
- A tRPC API (integrated with React Query on the frontend)
- better-auth authentication (email/password + optional OAuth)
- A PostgreSQL + Drizzle ORM data layer

## Technology Stack

- **Web**: Next.js (App Router) + React + TypeScript
- **API**: tRPC v11 + TanStack React Query
- **Auth**: better-auth (Next.js route handler: `src/app/api/auth/[...all]/route.ts`)
- **DB**: PostgreSQL + Drizzle ORM (connection: `src/server/db/index.ts`; schema: `src/server/db/schema.ts`; tooling: drizzle-kit)
- **Styling**: Tailwind CSS + shadcn/ui (with Prettier / Tailwind class sorting)
- **Config**: `src/env.js` (zod schema) + `.env.example`

## Project Structure

- `src/app/`: Next.js pages and routes (including `src/app/api/` route handlers)
- `src/app/_components/`: shared UI components (including shadcn/ui primitives in `src/app/_components/ui/`)
- `src/server/`: server-only code (can depend on Node/DB/Auth; avoid bundling into the client)
  - `src/server/better-auth/`: better-auth configuration and server-side session helpers
  - `src/server/db/`: Drizzle connection and schema
  - `src/server/api/`: tRPC entry and routers
- `src/trpc/`: tRPC + React Query client/server helpers

## Key Implementation Locations

- **Auth config**: `src/server/better-auth/config.ts` (adapter, providers, session type inference)
- **Auth route**: `src/app/api/auth/[...all]/route.ts`
- **Server session helper**: `src/server/better-auth/server.ts` (`getSession()`)
- **DB connection**: `src/server/db/index.ts` (uses a global cache in dev to avoid HMR reconnects)
- **DB schema**: `src/server/db/schema.ts`
- **tRPC context**: `src/server/api/trpc.ts` (injects `db` and `session` into ctx)
- **tRPC router registration**: `src/server/api/root.ts`

## Commands

> Use `package.json` as the source of truth. If you add or change scripts, update `AGENTS.md` and this document as well.

- `npm run dev`: start the dev server (Next.js `--turbo`)
- `npm run build` / `npm run start` / `npm run preview`: build/run locally
- `npm run check`: `next lint` + `tsc --noEmit` (minimum CI gate)
- `npm run test:unit` / `npm run test:unit:watch`: Vitest unit tests (server-side logic)
- `npm run test:e2e` / `npm run test:e2e:ui`: Playwright E2E tests (Chromium / CDP; covers real user journeys)
- `npm run format:check` / `npm run format:write`: Prettier check/format (currently only `ts/tsx/js/jsx/mdx`)
- `./start-database.sh`: start local Postgres (requires Docker/Podman)
- `npm run db:push` / `npm run db:migrate` / `npm run db:generate` / `npm run db:studio`: drizzle-kit workflow

## Coding Style & Conventions

- TypeScript strict; prefer type-only imports
- Path alias: `~/*` → `src/*`
- ESLint: prefix intentionally-unused params with `_`
- Keep server/client boundaries clear: DB/Auth/tRPC server logic lives in `src/server/`

## UI & Brand Consistency

- Any work that adds or changes pages (e.g. routes/pages/layouts under `src/app/**`, plus page-related interactions and visual styling) must use the `omi-brand-guidelines` skill to comply with OMI brand guidelines (Studio Dark palette, single gold accent, etc.).

## Testing Strategy

Vitest (unit tests) and Playwright (end-to-end) are configured; the minimum CI gate is `npm run check` (lint + typecheck).

When covering real user journeys (especially auth, forms, routing/navigation, and other UI interactions), tests SHALL prefer end-to-end automation based on Chrome DevTools Protocol (recommended: Playwright + Chromium) and build cases around real scenarios (any new scripts and conventions should be documented in OpenSpec).

Mandatory requirements (project defaults):
- If a UI/user-flow change can be reasonably covered by Playwright, the change SHALL add or update E2E coverage. If it is not feasible, the corresponding OpenSpec `proposal.md` MUST document why and provide alternative verification steps.
- If a change adds or modifies non-trivial server/service logic under `src/server/**` (beyond pure glue code or type-only changes), the change SHALL add or update Vitest unit tests. If unit tests are unnecessary, the corresponding OpenSpec `proposal.md` MUST document why.

Conventions:
- For backend/service logic, use Vitest and keep tests close to code (e.g. `src/server/**/*.test.ts`), run via `npm run test:unit`.
- Keep E2E tests under `e2e/`, run via `npm run test:e2e`. First run may require `npx playwright install` to install browsers.

## Git Workflow

- Use Conventional Commits (e.g. `feat: ...`, `fix(auth): ...`)
- PRs should include: motivation, impact scope, UI screenshots (if applicable), and migration notes (if DB changes are involved)

## Domain Context

- Credits billing is a core product capability (token-based billing, failure refunds, etc.); implementation constraints should be captured in specs first
- Image generation/editing involves “point guidance” interactions (Point-to-Edit); requirements may change frequently, so manage them via OpenSpec

## Key Constraints & Security

- Never commit `.env` or any secrets. When adding env vars, update `.env.example` and `src/env.js` together.
- DB schema/migrations are managed by drizzle-kit; avoid hand-editing generated artifacts. Migration changes should be committed and clearly documented in PR notes.

## External Dependencies

- PostgreSQL (local: `./start-database.sh`; production: provided by the deployment platform), configured via `DATABASE_URL` (see `src/env.js` and `.env.example`)
- better-auth: `BETTER_AUTH_SECRET` is required in production (see `src/env.js` and `.env.example`)
- OAuth (e.g. Google): `BETTER_AUTH_GOOGLE_CLIENT_ID` / `BETTER_AUTH_GOOGLE_CLIENT_SECRET` plus callback URL configuration (see `src/server/better-auth/config.ts`)
- Resend (transactional email delivery): `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (see `src/env.js` and `.env.example`)
