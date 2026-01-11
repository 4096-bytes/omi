<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router routes (`page.tsx`, `layout.tsx`) and route handlers under `src/app/api/`.
- `src/app/_components/`: shared UI components.
- `src/app/_components/ui/`: shadcn/ui-based primitive components (Button/Input/Card, etc.).
- `src/server/`: server-only code (better-auth in `src/server/better-auth/`, Drizzle in `src/server/db/`, tRPC routers in `src/server/api/`).
- `src/trpc/`: tRPC + React Query client/server helpers.
- `drizzle.config.ts`: drizzle-kit config (schema at `src/server/db/schema.ts`).
- `public/` and `src/styles/`: static assets and global styles (Tailwind).

## Build, Test, and Development Commands
- Use `npm` (lockfile: `package-lock.json`).
- `npm install`: install dependencies.
- `npm run dev`: start the Next.js dev server (`--turbo`).
- `npm run build` / `npm run start` / `npm run preview`: build, run, or build+run locally.
- `npm run check`: run `next lint` and `tsc --noEmit`.
- `npm run test:unit` / `npm run test:unit:watch`: Vitest unit tests (server-side logic).
- `npm run test:e2e` / `npm run test:e2e:ui`: Playwright E2E (Chrome DevTools Protocol via Chromium).
- `npm run format:check` / `npm run format:write`: verify or apply formatting (includes Tailwind class sorting).
- Database: `./start-database.sh` (local Postgres), `npm run db:push`, `npm run db:generate`, `npm run db:studio`.

## Coding Style & Naming Conventions
- TypeScript is strict; prefer type-only imports and prefix intentionally-unused params with `_` (ESLint).
- Use the `~/*` path alias for `src/*` imports.
- Components: `PascalCase.tsx`; hooks: `useXyz`; tRPC routers: `src/server/api/routers/<domain>.ts` and register in `src/server/api/root.ts`.

## Testing Guidelines
- Treat `npm run check` as the minimum CI gate.
- For backend service logic, use Vitest and keep unit tests near code (e.g., `src/server/**/*.test.ts`), run via `npm run test:unit`.
- For UI flows, prefer end-to-end automation driven by Chrome DevTools Protocol (recommended: Playwright + Chromium) and cover real user journeys.
- Keep E2E tests under `e2e/` and run via `npm run test:e2e` (first-time setup may require `npx playwright install`).

## Commit & Pull Request Guidelines
- No established Git history yet—use Conventional Commits (e.g., `feat: ...`, `fix(auth): ...`).
- PRs should include: a short rationale, screenshots for UI changes, migration notes (commit drizzle-kit generated migrations when added), and updates to `.env.example` + `src/env.js` when env vars change.

## Security & Configuration Tips
- Never commit `.env`. Keep `.env.example` secret-free and aligned with `src/env.js`.
- Avoid hand-editing generated migrations; re-generate via drizzle-kit.
