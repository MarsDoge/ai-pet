# DEV_SPEC — AI Pet V0.1

This document captures the baseline rules for implementing V0.1 features.

## Deterministic Core (pet-core)
- State is deterministic: same input yields same output.
- No randomness or implicit time reads inside reducers.
- All numeric mutations flow through `reduce(state, event)`.

### Core stats
- Range-clamped stats: `hunger`, `energy`, `cleanliness`, `fun`, `affection` (0–100).
- `exp` and `coins` are non-negative; `level` is >= 1.

### Events
- Supported event types: `FEED`, `PET`, `BATH`, `PLAY`, `SLEEP`, `TICK`.
- Action deltas live in `packages/pet-core/src/constants.ts`.

### Tick compensation
- Interval: 10 minutes (`TICK_INTERVAL_MS`).
- `applyTickCompensation()` derives missing ticks and applies reducers in order.
- Tests must cover 1h/6h/24h compensation.

## Memory & SaveData (pet-memory)
- Event log is capped at 200 entries.
- SaveData `version` must match `CURRENT_SAVE_VERSION`.
- Import clamps illegal numeric values; do not crash on corrupt saves.

## Web (apps/web)
- UI reads state, dispatches events, and renders stats.
- Action bar must wire at least 4 actions.
- Save/Load uses JSON export/import plus localStorage persistence.

## AI Safety (pet-ai)
- AI output is text + tags only; it never mutates numeric state.
- Template replies must be used when no provider is configured.

## Testing
- `pet-core` and `pet-memory` require unit tests for every feature.
- Run `pnpm -r test` before submitting changes.
