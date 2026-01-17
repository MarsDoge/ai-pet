# web app

Next.js UI for AI Pet.

## Responsibilities
- Render pet state and UI components.
- Dispatch core events and log them.
- Handle boot flow: load -> tick compensate -> render.
- Manage local persistence and JSON export/import.
- Display chat replies and auto-speak UI.

## Rules
- UI layer only; no game rules here.
- All numeric changes must go through pet-core reducers.

## Commands
Run from repo root:

```bash
pnpm --filter ./apps/web dev
pnpm --filter ./apps/web build
```
