# OMI AI (Oh-My-Interior) — MVP

OMI AI is a **conversation-to-production** workspace for interior designers. It combines semantic chat with canvas point guidance (Point-to-Edit) to enable more controllable, mask-free edits, and provides a token-based Credits billing foundation.

> Note: This repo originally evolved from a T3 Stack (Next.js + tRPC) scaffold, and now uses **better-auth + Drizzle**. Features are shipped incrementally against the PRD/specs.

## MVP Goals

- **Validate the interaction loop**: chat + point guidance to reduce the learning cost of traditional masking workflows.
- **Ship the billing foundation**: token-based Credits with `Credits = (Base * (1+Y%)) + X` and Min/Max safeguards.
- **Validate performance**: fast 1K preview iteration, with 4K export planned.

## Current Capabilities

- Authentication: email/password sign-up & sign-in with mandatory email verification (Resend).
- Social login: Google OAuth sign-in (better-auth).
- API scaffolding: tRPC v11 + React Query integration (starter routers under `src/server/api/`).

## Planned (PRD/Roadmap)

- **Account system**: initialize 50 Credits for new users (planned).
- **Conversational rendering**: support initial generation from `Text + Image`; maintain `thought_signature` per session (planned).
- **Point-guided editing**: click canvas to get `(x, y)` and trigger localized edits via instructions (planned).
- **Multi-reference blending**: up to 14 reference images with weights/style/object replacement (planned).
- **Thinking process UI**: real-time `Thought Parts` rendering (planned).
- **Billing consistency**: charge on success callback; 100% refund on failure/interception (design constraint).
- **Compliance**: generated images SHALL include a SynthID watermark (design constraint).

## Tech Stack

- **Web**: Next.js (App Router) + React + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (with Prettier + Tailwind class sorting)
- **API**: tRPC v11 + TanStack React Query
- **Auth**: better-auth + Drizzle adapter
- **DB**: PostgreSQL + Drizzle ORM (schema: `src/server/db/schema.ts`; tooling: drizzle-kit)
- **Email**: Resend (transactional email)

## Getting Started (Local Dev)

1) Prepare environment variables: copy `.env.example` to `.env` and fill required values (keep `src/env.js` in sync).
   - Set `BETTER_AUTH_URL` (e.g. `http://localhost:3000` locally; use your deployed origin in production).
   - Google OAuth: configure redirect URI `${BETTER_AUTH_URL}/api/auth/callback/google` and origin `${BETTER_AUTH_URL}` in the Google Console.
   - Resend (verification email): set `RESEND_API_KEY`; default sender is `RESEND_FROM_EMAIL=onboarding@resend.dev`.
2) Start the local database (requires Docker or Podman):
   - `./start-database.sh`
3) Install dependencies and initialize DB schema (Drizzle):
   - `npm install`
   - `npm run db:push` (or use `npm run db:generate` / `npm run db:migrate` when needed)
4) Start the dev server:
   - `npm run dev`

### Local Smoke Test (Auth)

- Visit `http://localhost:3000/register` to sign up; open the verification email and complete verification (unverified users cannot sign in).
- Visit `http://localhost:3000/login` to sign in with email + password; on success you should be redirected to `/`.

## Common Commands

- `npm run check`: `next lint` + `tsc --noEmit`
- `npm run lint` / `npm run lint:fix`: lint / auto-fix
- `npm run format:check` / `npm run format:write`: formatting check / write
- `npm run db:studio`: Drizzle Studio
- `npm run build` / `npm run start` / `npm run preview`: build & run locally

## Project Structure (Core)

- `src/app/`: routes and pages (including `src/app/api/`)
- `src/app/_components/`: UI components (including shadcn/ui primitives)
- `src/server/`: server-only code (better-auth, Drizzle, tRPC routers)
- `src/trpc/`: tRPC/React Query client/server helpers
- `openspec/`: specs and change proposals (spec-driven development)

## Credits Billing Model (Design Notes / WIP)

- Formula: `Credits = (Base_Token_Cost * (1 + Y%)) + X`; 1K image base assumes `1290 tokens/image` (PRD assumption).
- State machine: `PENDING` reserve → settle on success using `totalTokens` (`SUCCESS`) → full refund on failure/timeout/safety interception (`FAIL`).
- Ledger: task-level records for timestamps, task IDs, and cost breakdowns (planned).

## Contributing / PR Guidelines

Read `AGENTS.md` first (contributor guidelines). Recommended conventions:

- Conventional Commits (e.g. `feat: ...` / `fix(auth): ...`)
- PR description includes: motivation, impact scope, UI screenshots (if applicable), migration notes (if DB changes are involved)
- Never commit `.env` or secrets; when adding env vars, update `.env.example` and `src/env.js`
- UI is dark-only (Studio Dark). Brand tokens live in `src/styles/globals.css` and any new/changed pages should keep the single gold accent discipline.
