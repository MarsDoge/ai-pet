# Project Status

## Current focus
- Keep CI green with install/test/build only (no artifact upload for now).
- Ensure Pages deploys via static export with correct basePath.
- Validate AI provider wiring with real API keys when available.
- Improve AI provider error UX and guardrails.

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
- 2026-01-17: Wired provider settings to chat with OpenAI-compatible adapter.
- 2026-01-17: Added SaveData migration pipeline and tests.
- 2026-01-17: Added AI provider validation with template fallback on error.
- 2026-01-17: Added missing API key hint in settings panel.
- 2026-01-17: Added provider error banner to avoid mixing errors into chat text.
- 2026-01-17: Persisted provider error banner dismissal in SaveData.
- 2026-01-17: Added docs index links, onboarding section, provider UX reset, and Pages output guard.
- 2026-01-17: Added provider setup page and linked it from settings.
- 2026-01-17: Added provider model and base URL hints in settings.
- 2026-01-17: Consolidated Milestone F follow-ups (#70-#73) for docs, provider UX, Pages, and CI guard.
- 2026-01-17: Added action feedback panel to show recent events and deltas.

## Upcoming
- Verify Pages deployment URL and add to docs if needed.
- Add a docs index that links architecture/contracts/migration/UX specs.
- Improve provider-specific error handling and rate limit UX.

## Risks / decisions
- CI must run `pnpm --filter ./apps/web build` to catch type errors early.
- Next.js font fetching is disabled in favor of local font stacks to avoid network flakiness.
