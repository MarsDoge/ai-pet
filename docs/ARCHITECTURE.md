# Architecture Overview

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

## AI integration
- Web uses `pet-ai` to generate chat responses.
- When no provider is configured, templates are used.
- AI replies never mutate numeric state; reducers remain the single source of truth.

## Auto-speak
- Auto-speak triggers are derived from current pet state and idle time.
- Each auto message is logged as `AUTO_SPEAK` with no numeric delta.
