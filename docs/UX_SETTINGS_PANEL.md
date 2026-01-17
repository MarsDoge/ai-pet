# Settings Panel UX Spec

## Goals
- Give users a single place to manage AI provider, auto-speak, and save/load actions.
- Keep advanced actions discoverable but not cluttered.

## Sections
1. AI
   - Provider selector: none/openai/deepseek/ollama.
   - Show current provider label.
2. Auto-speak
   - Toggle on/off.
   - Daily count display.
3. Save/Load
   - Quick save.
   - Copy JSON export.
   - Quick import (paste JSON prompt).

## Behavior
- Sections can be collapsed/expanded.
- Persist expanded/collapsed state in local KV (SaveData).
- Status feedback should be concise and cleared on new action.

## Copy (zh-CN)
- Settings title: "设置"
- Provider label: "AI 提供方"
- Auto-speak toggle: "开启/关闭自动说话"
- Quick save: "快速保存"
- Copy export: "复制 JSON"
- Quick import: "快速导入"
