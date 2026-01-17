# Contributing

Thanks for contributing! This repo is deterministic-first and test-driven.

## Before you start
- Read `docs/CODEX_RULES.md` and `docs/DEV_SPEC.md`.
- Follow the milestone order: pet-core → pet-memory → web (no AI) → pet-ai → auto-speak.

## Development flow
1. Create or pick an Issue.
2. Make a focused change tied to that Issue.
3. Run tests: `pnpm -r test`.

## Pull requests
PRs must include:
- What changed
- Why it changed
- How to test
- Risks/known limitations

Keep PRs scoped to one milestone unless the change is doc-only.

## Commit messages
Use `type: short summary` (e.g., `feat(core): add tick compensation`).
