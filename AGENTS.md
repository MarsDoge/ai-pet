# Repository Guidelines

## Project Structure & Module Organization
This repo is a PNPM workspace with planned packages and apps. Use these paths when they exist:
- `apps/web/` for the Next.js UI.
- `packages/pet-core/` for deterministic simulation (state, events, reducers, tick compensation).
- `packages/pet-memory/` for KV storage, event logs, and save import/export.
- `packages/pet-ai/` for prompts, adapters, and templates. AI must never mutate numeric state.
- `packages/shared/` for shared types/utilities.
- `docs/` for specs and contributor rules (see `docs/CODEX_RULES.md`).

## Build, Test, and Development Commands
Commands are documented in `README.md` and `docs/CODEX_RULES.md`:
- `pnpm install` installs workspace dependencies.
- `pnpm --filter ./apps/web dev` runs the web app locally.
- `pnpm -r test` runs all package tests.
- `pnpm -r lint` runs lint checks.
- `pnpm --filter ./apps/web build` runs the production build (required before commits that touch `apps/web`).

## Coding Style & Naming Conventions
- TypeScript only; keep functions small and pure with explicit inputs/outputs.
- Do not duplicate types across packages; re-export from `packages/shared/`.
- Keep AI output to text/suggestions only; all numeric state changes go through `pet-core` reducers.
- Indentation defaults to 2 spaces unless a package config specifies otherwise.

## Testing Guidelines
- `pet-core` and `pet-memory` require unit tests for every change.
- Coverage expectations include tick compensation (1h/6h/24h), action deltas, level-up logic, and import/export edge cases.
- Run the suite with `pnpm -r test` before opening a PR.

## Commit & Pull Request Guidelines
- Commit messages follow `type: short summary` (examples: `docs: add execution plan`, `chore: initialize project docs`).
- Keep PRs scoped to a single milestone unless the change is doc-only.
- PR descriptions must include: what changed, why, how to test, and risks/known limitations.

## Automation Workflow (AI-First)
- Use AI as a copilot for planning, breakdown, and implementation.
- Always start from a written blueprint: update specs or plans before coding.
- Preferred flow: **docs/specs → issues → code → tests → summary update**.
- See `docs/WORKFLOW.md` for the detailed checklist.

## Project Status & Summaries
- Maintain a concise status log in `docs/STATUS.md`.
- Update it after each milestone or major feature to keep contributors aligned.

## Configuration & Safety Notes
- For local AI testing, copy `apps/web/.env.example` to `apps/web/.env`.
- Key rule: AI never mutates numeric state; determinism in `pet-core` is mandatory.
