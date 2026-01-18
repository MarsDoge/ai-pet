# Plugin API (Draft)

Plugins extend UI behavior and content parsing without modifying `pet-core`.

## Goals
- Allow community extensions with clear boundaries.
- Keep determinism and safety guarantees intact.

## Proposed Interface (TS)
```ts
export type PetPlugin = {
  id: string;
  version: string;
  register(registry: PluginRegistry): void;
};

export type PluginRegistry = {
  addAction(name: string, handlerId: string): void;
  addNarrative(source: string, templateId: string): void;
  addSkin(skinId: string, assetPath: string): void;
};
```

## Constraints
- No direct numeric changes; must call existing reducers.
- No network calls from plugins by default.
- All plugin output should be logged.

## Loading
- Only load trusted plugins listed in config.
- Validate version and compatibility on startup.
