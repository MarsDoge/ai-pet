# Next Phase Plan

## Goals (3–5 items)
1. Stabilize AI provider UX and validation end-to-end.
2. Improve docs discoverability and contributor onboarding.
3. Ensure Pages deployment is reliable and documented.

## Work packages
### A) AI provider UX
- Inline validation for required fields (API key, model).
- Error banner behavior (dismiss + reset on new attempts).
- Provider setup doc link surfaced in UI.

### B) Docs & onboarding
- Keep docs index updated (add provider setup, release checklist).
- Add a short onboarding section in README/README_CN.

### C) Pages reliability
- Verify deployment URL and add a health note in README/README_CN.
- Add a CI guard that checks Pages build output exists (optional).

## Sequence
1. Docs (index + onboarding) -> UI (provider UX) -> CI/Pages guard.

## Acceptance checklist
- Web build passes.
- Provider errors are visible and actionable.
- Docs index links are complete.
- Pages URL confirmed and documented.
