# pet-memory

Persistence layer for AI Pet.

## Responsibilities
- SaveData schema and version checks.
- Import validation and clamping.
- KV store and capped EventLog.

## Rules
- Does not own game rules (those live in pet-core).
- Never mutates numeric state directly.

## Public API
- `exportSaveData()` / `importSaveData()`
- `sanitizeState()`
- `KVStore`
- `EventLog`

## Contracts
- See `docs/API_CONTRACTS.md`.

## Tests
Run from repo root:

```bash
pnpm --filter @ai-pet/pet-memory test
```
