# Release Checklist

## Pre-release
- [ ] `pnpm -r test` passes
- [ ] `pnpm --filter ./apps/web build` passes
- [ ] Pages workflow completes successfully
- [ ] Demo URL renders with correct assets

## Versioning
- [ ] Update `CHANGELOG.md`
- [ ] Tag release in Git (`vX.Y.Z`)
- [ ] Verify README/README_CN badges and demo links

## SaveData
- [ ] If SaveData schema changed, bump `CURRENT_SAVE_VERSION`
- [ ] Add migration step and update `docs/SAVEDATA_MIGRATION.md`

## Docs
- [ ] Update `docs/STATUS.md`
- [ ] Update `docs/EXECUTION_PLAN.zh-CN.md`
- [ ] Confirm `docs/INDEX.md` links are current
