# Content Pack Spec (Draft)

Content packs allow community members to add skins, actions, narratives, and achievements without touching core logic.

## Folder Layout
- `packages/pet-content/<pack-id>/pack.json`
- `packages/pet-content/<pack-id>/assets/*`
  - Example: `packages/pet-content/sample-pack/`

## pack.json (Minimum)
```json
{
  "id": "sunset-pack",
  "name": "Sunset Pack",
  "version": "0.1.0",
  "author": "you",
  "compatible": ["web"],
  "skins": [],
  "stories": [],
  "achievements": []
}
```

## Skins
```json
{ "id": "sunset", "label": "日落", "asset": "assets/sunset.png" }
```

## Story Cards (Narrative Only)
```json
{ "id": "quiet-morning", "text": "今天的清晨很安静。", "tags": ["CONTENT"] }
```

## Achievements (UI Only)
```json
{ "id": "badge-3", "title": "坚持三天", "target": 3, "kind": "badges" }
```

## Rules
- No numeric state mutation.
- All text must be safe and respectful.
- Packs must be deterministic and replayable.
