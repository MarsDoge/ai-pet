# Next Phase Plan

## Goals (3–5 items)
1. Close the core gameplay loop with visible feedback and rewards.
2. Add layered memory + narrative timeline (text only, no numeric mutation).
3. Keep release/docs/pages stability intact.

## Work packages
### A) Core gameplay loop
- Action feedback panel + state-based hints.
- Lightweight daily goals with small rewards (no rule changes).
- Clear visual feedback after each action.

### B) Memory & narrative
- Layered memory in SaveData (short/long term).
- Narrative timeline events stored in EventLog payload.
- UI surface for replaying narrative beats.

### C) Stability guard
- Keep Pages export guard.
- Ensure provider fallback remains intact.

## Sequence
1. Memory layer -> narrative timeline -> gameplay loop polish.

## Acceptance checklist
- Web build passes.
- Memory/narrative storage is deterministic and safe.
- Gameplay loop is visible (feedback + hints + goals).
