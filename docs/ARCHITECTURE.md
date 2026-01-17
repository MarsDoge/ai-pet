# Architecture Overview

## Layering and boundaries
The project is split into deterministic core logic, persistence, optional AI, and UI.
Dependencies must follow this direction:

```
apps/web
  -> packages/pet-ai
  -> packages/pet-memory
  -> packages/pet-core
  -> packages/shared
```

Rules:
- `pet-core` is pure and deterministic (no time, random, IO, DOM, or Node).
- `pet-memory` stores and validates data; it does not own game rules.
- `pet-ai` outputs text/tags only; it never mutates numeric state.
- `apps/web` renders state and dispatches events; it does not implement rules.

## Package layout
- `packages/pet-core`: deterministic simulation engine (state, events, reducers, tick).
- `packages/pet-memory`: SaveData, KV store, and event log management.
- `packages/pet-ai`: optional LLM interface and template fallback replies.
- `apps/web`: Next.js UI that renders state and dispatches core events.

## Data flow
1. UI dispatches a core event (e.g., `FEED`).
2. `pet-core` computes next state + numeric delta.
3. `pet-memory` records the event in a capped log.
4. SaveData is persisted via localStorage and JSON export/import.

### Boot flow
1. Load SaveData (if any).
2. Run tick compensation using `pet-core`.
3. Render the updated state.
4. Persist the result.

### Event flow
1. User action -> `CoreEvent`.
2. `pet-core.reduce()` returns next state and delta.
3. `pet-memory.EventLog` appends the event.
4. UI re-renders and persists SaveData.

## AI integration
- Web uses `pet-ai` to generate chat responses.
- When no provider is configured, templates are used.
- AI replies never mutate numeric state; reducers remain the single source of truth.

## Auto-speak
- Auto-speak triggers are derived from current pet state and idle time.
- Each auto message is logged as `AUTO_SPEAK` with no numeric delta.

## Module roadmap (future plans)

### `packages/pet-core`
- V0.5: richer actions/items, mood modifiers, traits, and achievements.
- V1.0: plugin hooks for new actions and items with strict validation.

### `packages/pet-memory`
- V0.5: weekly summaries and optional vector memory (behind feature flag).
- V1.0: migration helpers for SaveData version upgrades.

### `packages/pet-ai`
- V0.5: multi-provider routing and stronger JSON schema validation.
- V1.0: tool-safe responses (no state mutation) with audit logs.

### `apps/web`
- V0.5: mini-games, shop, outfits, and daily tasks UI.
- V1.0: desktop wrapper (Tauri) with tray and hotkeys.

### `packages/shared`
- V0.5+: shared versioned contracts for events, SaveData, and UI labels.
