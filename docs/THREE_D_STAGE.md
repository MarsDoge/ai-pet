# 3D Stage Plan (Draft)

Goal: introduce a 3D pet stage without changing gameplay rules.

## Scope (Phase 1)
- Use `react-three-fiber` to render a simple 3D scene.
- Show a placeholder 3D pet (primitive or GLB).
- Map mood -> animation state (idle, happy, tired, hungry).

## Non-Goals
- No changes to `pet-core` rules.
- No physics-heavy interactions.
- No multiplayer sync.

## Integration
- Replace the 2D `PetStage` with a 3D stage component.
- Keep existing HUD (status, actions, chat) unchanged.

## Assets
- Start with a placeholder model; swap later for custom art.
- Use a single animation clip per mood to keep scope small.

## Risks
- Bundle size and load time.
- Mobile performance.

## Acceptance
- 3D stage renders on desktop and mobile.
- Mood changes switch the pet animation.
