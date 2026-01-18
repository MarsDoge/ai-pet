# AI Governance (Draft)

This document defines how AI makes community-facing decisions while preserving determinism.

## Scope (Allowed)
- Resolve conflicts between community content packs.
- Rank or schedule narrative events (text-only).
- Recommend action priorities and spotlight community content.
- Moderate or flag unsafe content submissions.

## Out of Scope (Forbidden)
- Any numeric state mutation (hunger/energy/coins/etc.).
- Bypassing `pet-core` reducers or deterministic rules.
- Direct storage writes outside approved KV fields.

## Inputs
- Content pack metadata (version, author, compatibility).
- EventLog summaries (text only).
- User configuration (opt-in preferences).

## Outputs
- Decision log entries (text + tags).
- Ranked lists or approved pack sets.
- Suggested actions or narratives.

## Transparency & Auditability
- Every decision must be logged in `EventLog` payload as `GOVERNANCE`.
- Provide a human-readable reason string.
- Allow users to export the decision history.

## Failure Modes
- AI unavailable: fallback to deterministic defaults.
- Unclear decision: choose smallest-impact option.

## Compliance
- All decisions must preserve determinism and be replayable from logs.
