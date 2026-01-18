# Next Phase Plan

## Goals (3–5 items)
1. Close the core gameplay loop with visible feedback and rewards.
2. Add layered memory + narrative timeline (text only, no numeric mutation).
3. Enable community contribution via content packs and plugins.
4. Define AI governance boundaries for community decisions.
5. Keep release/docs/pages stability intact.

## Work packages
### A) Core gameplay loop
- Action feedback panel + state-based hints.
- Lightweight daily goals with small rewards (no rule changes).
- Clear visual feedback after each action.

### B) Memory & narrative
- Layered memory in SaveData (short/long term).
- Narrative timeline events stored in EventLog payload.
- UI surface for replaying narrative beats.

### C) Community expansion
- Content pack spec and examples.
- Plugin API draft with safety constraints.
- Contributor pathways by skill level.

### D) AI governance
- Define decision scope and logging.
- Add governance event log schema.
- Ensure deterministic fallbacks.

### E) 3D stage prototype
- Draft 3D stage plan and acceptance.
- Prototype a mood-driven 3D pet stage.

### F) Stability guard
- Keep Pages export guard.
- Ensure provider fallback remains intact.

## Sequence
1. Memory layer -> narrative timeline -> gameplay loop polish.
2. Content pack spec -> plugin API draft -> governance logging.

## Acceptance checklist
- Web build passes.
- Memory/narrative storage is deterministic and safe.
- Gameplay loop is visible (feedback + hints + goals).
- Community contributions have clear specs and boundaries.
