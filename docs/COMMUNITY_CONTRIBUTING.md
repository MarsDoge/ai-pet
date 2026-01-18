# Community Contributing (Draft)

This project welcomes contributors at different skill levels. Pick the path that fits you.

## Level 1: Content Packs (No code)
- Add skins, copy, badges, and story cards.
- Submit JSON + assets in `packages/pet-content/`.
- Use the spec in `docs/CONTENT_PACK_SPEC.md`.

## Level 2: Light Scripting (Basic TS)
- Add new actions/items by extending pack templates.
- Keep changes text-only and deterministic.
- No direct numeric mutation; use existing reducers.

## Level 3: Core Extensions
- New plugins, UI systems, or storage modules.
- Requires tests and review.
- Must comply with `docs/CODEX_RULES.md`.

## Submission Checklist
- Provide a short description, screenshots (if UI), and test notes.
- Follow `type: summary` commit messages.
- Prefer small PRs scoped to one goal.
