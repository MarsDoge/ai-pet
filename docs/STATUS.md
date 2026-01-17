# Project Status

## Current focus
- Keep CI green with install/test/build only (no artifact upload for now).
- Ensure Pages deploys via static export with correct basePath.

## Recently completed
- 2026-01-17: Completed pet-core, pet-memory, web (Milestone C), pet-ai (Milestone D), auto-speak (Milestone E).
- 2026-01-17: Added architecture diagram and module responsibilities in README/README_CN.
- 2026-01-17: Added AI-first workflow docs and status tracking template.
- 2026-01-17: Localized web UI copy to zh-CN.
- 2026-01-17: Switched LICENSE to GPL-3.0 and added README_CN.
- 2026-01-17: CI adjusted to install/test/build only (artifact upload removed).
- 2026-01-17: Added API contracts and SaveData migration policy docs.
- 2026-01-17: Added item effects table and SaveData tests for new KV fields.
- 2026-01-17: Added Settings panel for provider selection and quick actions.
- 2026-01-17: GitHub Pages static export deployed with basePath fix.

## Upcoming
- Verify Pages deployment URL and add to docs if needed.
- Add API contract references into package READMEs and docs index.

## Risks / decisions
- CI must run `pnpm --filter ./apps/web build` to catch type errors early.
- Next.js font fetching is disabled in favor of local font stacks to avoid network flakiness.
