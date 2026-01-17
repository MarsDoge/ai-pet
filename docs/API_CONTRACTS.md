# API Contracts

This document defines the versioned contracts for cross-package data.

## Versioning rules
- Only additive changes are allowed in minor updates.
- Breaking changes require a SaveData version bump and a migration step.
- `pet-core` and `pet-memory` must keep contracts stable.

## PetState (pet-core)
Fields and ranges:
- `hunger`: number, 0–100
- `energy`: number, 0–100
- `cleanliness`: number, 0–100
- `fun`: number, 0–100
- `affection`: number, 0–100
- `exp`: number, >= 0
- `level`: number, >= 1
- `coins`: number, >= 0
- `lastTickAt`: number, >= 0 (ms timestamp)

## CoreEvent (pet-core)
- `type`: `FEED | PET | BATH | PLAY | SLEEP | TICK`
- `at`: number (ms timestamp)

## EventLogEntry (pet-memory)
- `type`: string (CoreEvent type or UI/AI event)
- `at`: number (ms timestamp)
- `delta`: optional `StatDelta`
- `payload`: optional object

## SaveData (pet-memory)
- `version`: number (must equal `CURRENT_SAVE_VERSION`)
- `state`: `PetState`
- `kv`: key-value object
  - `inventory`: Inventory array (web)
  - `autoSpeak`: settings blob (web)
- `log`: `EventLogEntry[]`

## AI Reply (pet-ai)
- `text`: string
- `emotionTag`: Mood (`HUNGRY | TIRED | DIRTY | BORED | HAPPY | CONTENT`)
- `suggestedActions`: `FEED | PET | BATH | PLAY | SLEEP | CHAT`
- `memoryWrite`: optional object
