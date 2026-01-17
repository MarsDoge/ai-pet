# pet-core

Deterministic simulation engine for AI Pet.

## Responsibilities
- Owns the state model, events, reducers, and tick compensation.
- Produces numeric deltas for every event.
- Enforces clamping rules for stats, exp, level, and coins.

## Rules
- No randomness, time reads, IO, DOM, or Node-specific APIs.
- All numeric changes must flow through `reduce()`.
- Must remain deterministic for identical inputs.

## Public API
- `createInitialState()`
- `reduce(state, event)`
- `applyTickCompensation(state, now)`
- `deriveMood(state)`

## Contracts
- See `docs/API_CONTRACTS.md`.

## Tests
Run from repo root:

```bash
pnpm --filter @ai-pet/pet-core test
```
