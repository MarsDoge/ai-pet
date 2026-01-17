# SaveData Migration Policy

## Goals
- Preserve user saves across releases.
- Allow additive fields without breaking older saves.
- Avoid data loss when possible; clamp invalid values instead.

## Versioning
- `CURRENT_SAVE_VERSION` is the only accepted version at runtime.
- When a breaking change is needed, bump `CURRENT_SAVE_VERSION` and add a migration step.
- Additive fields in `kv` should not require a version bump.

## Compatibility rules
- Backward compatibility: new code should read old saves whenever possible.
- Forward compatibility: older builds may ignore unknown fields.
- Invalid numeric values must be clamped, never crash the app.

## Migration flow
1. Load SaveData.
2. If version mismatches, run migration to the latest version.
3. Sanitize numeric fields and clamp ranges.
4. Persist the upgraded SaveData.

## Example strategy
- v1 -> v2: introduce new `kv.autoSpeak` defaults when missing.
- v2 -> v3: rename a field (keep old field for one version and migrate).
