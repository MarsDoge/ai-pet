# CODEX_RULES — AI Pet Project

> Purpose: Keep Codex (and humans) aligned, predictable, and test-driven.  
> Scope: Applies to **all** work in this repo.

---

## 0) Non‑negotiables

1. **Core logic is deterministic.**  
   - `pet-core` must produce the same output for the same inputs.
2. **AI never mutates game state.**  
   - LLM output can only be text + suggestions + optional *KV* memory proposals.
   - All numeric changes must go through `pet-core` reducers.
3. **No milestone skipping.**  
   - Implement in this order: `pet-core` → `pet-memory` → `web` (no AI) → `pet-ai` → auto-speak → docs/demo.
4. **Every feature has tests or a reason.**  
   - `pet-core` and `pet-memory` require unit tests.
5. **Offline progression is mandatory.**  
   - Tick compensation must be correct and tested.

---

## 1) Repo conventions

### 1.1 Workspace structure (required)
- `apps/web` — UI
- `packages/pet-core` — deterministic simulation (state, events, reducer, tick)
- `packages/pet-memory` — KV + event log + save import/export
- `packages/pet-ai` — persona/prompt + adapters + templates (no state mutation)
- `packages/shared` — shared types/utils

### 1.2 Code style
- TypeScript everywhere
- No duplicated types across packages (export from `shared` or package entry)
- Prefer small pure functions + explicit inputs/outputs

### 1.3 Commit / PR rules
- One milestone per PR (unless tiny doc-only change)
- Keep core logic changes reasonably small (aim <500 LOC per PR for `pet-core`)
- PR must include:
  - What changed
  - Why
  - How to test (commands)
  - Risks/known limitations

---

## 2) Milestone gates (Definition of Done)

### Milestone A — pet-core
- `reduce(state, event)` implemented for required events
- tick compensation implemented (10 min interval by default)
- mood derivation implemented
- unit tests cover:
  - tick compensation across 1h/6h/24h
  - each action delta
  - level-up logic
  - mood boundary conditions
- `pnpm -r test` passes

**If Milestone A is not complete, do not start UI.**

### Milestone B — pet-memory
- KV store + event log (max 200) implemented
- SaveData export/import with version validation
- import clamps invalid numeric fields into legal ranges
- unit tests cover:
  - truncation
  - export/import roundtrip
  - version reject

### Milestone C — web (no AI)
- floating pet (drag) + bubble
- status panel
- action bar (feed/pet/bath/chat/play/sleep) — at least 4 working
- backpack usage (at least foods)
- save/load UI
- on app load: load save → tick compensation → render

### Milestone D — pet-ai
- templates fallback works without API key
- LLM adapter interface implemented
- at least 1 provider adapter integrated (OpenAI/DeepSeek/Ollama)
- strict JSON output parsing (fallback to text if parse fails)
- AI output cannot change numeric state

### Milestone E — auto speak
- triggers: hungry / low energy / dirty / long idle
- daily limit + on/off setting
- writes `AUTO_SPEAK` event (no numeric delta)

---

## 3) Safety & control requirements (must ship in V0.1)

- **Auto-speak**: default ON, but user can disable. Must have daily cap.
- **Logs**: every auto behavior is written into event log.
- **No hidden tool access**: no filesystem/shell control in V0.1.
- **Graceful degradation**: without LLM configuration, the app remains fully usable.

---

## 4) Implementation constraints (Codex)

- Do not introduce server-side components unless a milestone explicitly requires it.
- Avoid heavy dependencies; prefer standard libraries.
- Keep animations minimal and CSS-based in V0.1.
- Avoid “smart” behaviors in AI that change rules — rules live in `pet-core`.

---

## 5) How to run checks

- Install: `pnpm install`
- Test all: `pnpm -r test`
- Lint: `pnpm -r lint`
- Dev: `pnpm --filter web dev`

---

## 6) If unsure

When requirements are ambiguous, pick the option that:
1) preserves determinism,
2) reduces scope,
3) improves testability,
4) keeps the product playable without AI.

