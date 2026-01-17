# Project Status

## Current focus
- Stabilize CI build and keep web build checks aligned with local workflow.
- Prepare for potential GitHub Pages or release packaging pipeline.

## Recently completed
- 2026-01-17: Completed pet-core, pet-memory, web (Milestone C), pet-ai (Milestone D), auto-speak (Milestone E).
- 2026-01-17: Added architecture diagram and module responsibilities in README/README_CN.
- 2026-01-17: Added AI-first workflow docs and status tracking template.
- 2026-01-17: Localized web UI copy to zh-CN.
- 2026-01-17: Switched LICENSE to GPL-3.0 and added README_CN.

## Upcoming
- Confirm CI green after latest fixes and push changes.
- Decide whether to add GitHub Pages deployment (static export) or keep artifact-only CI.
- Add package-level READMEs with module boundaries and API contracts.

## Risks / decisions
- CI must run `pnpm --filter ./apps/web build` to catch type errors early.
- Next.js font fetching is disabled in favor of local font stacks to avoid network flakiness.
