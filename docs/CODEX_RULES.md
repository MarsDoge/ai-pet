# CODEX_RULES v2 — AI Pet Project 执行规则（含 gh 工作流 / 中文注释）

> **本文件是强制约束文件（NON-NEGOTIABLE）**  
> 适用于：Codex / Cursor / 人类开发者  
> 目标：让项目始终**可控、可测试、不中途跑偏**

---

## 0️⃣ 总原则（必须遵守）

### 0.1 确定性优先（Determinism First）
- `pet-core` 的任何逻辑 **必须是确定性的**
- 相同输入（state + event + time）→ 相同输出
- 不允许：
  - 随机数
  - 时间隐式依赖
  - AI 直接参与数值计算

---

### 0.2 AI 永远不能修改数值
- LLM **只能输出**：
  - 文本（text）
  - 情绪标签（emotionTag）
  - 建议动作（suggestedActions）
  - KV 记忆建议（memoryWrite）
- **禁止**：
  - AI 修改 hunger / energy / coins / exp 等任何数值
- 所有数值变化：
  - 必须通过 `pet-core` 的 reducer
  - 必须生成 event + delta

---

### 0.3 不允许跳阶段
**强制执行顺序：**

```
pet-core
  ↓
pet-memory
  ↓
web（无 AI）
  ↓
pet-ai
  ↓
auto-speak
  ↓
docs / demo
```

如果当前阶段未完成：
- ❌ 不允许写下一阶段代码
- ❌ 不允许“先占坑”

---

## 1️⃣ 仓库结构约束

```text
apps/web              # UI（允许状态展示，不允许核心规则）
packages/pet-core     # 确定性模拟（state / event / reducer / tick）
packages/pet-memory   # KV / EventLog / SaveData
packages/pet-ai       # Persona / Prompt / Adapter / Templates
packages/shared       # 公共类型与工具
docs/                 # 所有规格 / 规则 / 计划
```

规则：
- `pet-core` **不依赖** `pet-ai`
- `pet-core` 不引用浏览器 / DOM / Node 特性
- `pet-ai` 不直接写 storage
- `web` 不包含业务规则

---

## 2️⃣ GitHub Issues 工作流（必须使用 gh）

> Codex **被允许并被要求** 使用 GitHub CLI（`gh`）

### 2.1 开始工作前（必须）

```bash
gh issue list --label "area:core,priority:P0"
```

选择一个 Issue 后：

```bash
gh issue comment <ISSUE_ID> \
  --body "🟡 开始处理该 Issue：实现 pet-core 相关逻辑"
```

---

### 2.2 开发过程中（推荐）

- 重要决策 / 发现边界情况 → 写 Issue 评论
- 不确定点 → 写 TODO 评论，而不是擅自决定

---

### 2.3 完成 Issue（必须）

完成后：

```bash
gh issue close <ISSUE_ID> \
  --comment "✅ 已完成：
- 实现内容：<简要说明>
- 测试：vitest 全部通过
- 影响范围：pet-core（无 UI / 无 AI）"
```

---

## 3️⃣ 当前阶段执行规范（V0.1）

### 当前阶段：**Milestone A — pet-core**

#### ✅ 允许做的事情
- 定义 PetState / Event / ReduceResult
- 实现 reducer（FEED / PET / BATH / PLAY / SLEEP / TICK）
- 实现 tick 补偿（10 分钟粒度）
- 实现 mood 派生规则
- 写 vitest 单测

#### ❌ 禁止做的事情
- ❌ 任何 UI / React / CSS
- ❌ 任何 LLM / API 调用
- ❌ 非确定性逻辑
- ❌ “先写了再说”

---

## 4️⃣ 测试硬性要求（pet-core / pet-memory）

### pet-core 必须覆盖：
- tick 补偿：1h / 6h / 24h
- 每个 action 的 delta
- level-up 边界
- mood 阈值边界

### pet-memory 必须覆盖：
- EventLog 截断
- SaveData 导入导出一致性
- 非法数值修复（clamp）

---

## 5️⃣ 提交与 PR 规则

- 一个 PR = 一个 Issue（除非是纯文档）
- `pet-core` 相关 PR：
  - 推荐 < 500 行逻辑变更
  - 必须附带测试
- PR 描述必须包含：
  - 做了什么
  - 为什么这么做
  - 如何验证

---

## 6️⃣ 失败与降级策略（必须实现）

- LLM 不可用 → 模板回复
- JSON 解析失败 → 文本 fallback
- 存档损坏 → 修复 + 警告，而不是崩溃

---

## 7️⃣ 当规则冲突时的决策优先级

1. 本文件（CODEX_RULES）
2. docs/DEV_SPEC.md
3. GitHub Issue 描述
4. README

---

## 8️⃣ Codex 专用启动指令（推荐你复制用）

> 请严格遵守 docs/CODEX_RULES.md（v2）。  
> 你可以使用 GitHub CLI（gh）管理 Issues。  
> 请先查看 `area:core + priority:P0` 的 Issue，  
> 逐个完成并在 Issue 中回写进度与结果。

---

**如果不确定如何做，选择：**
- 更确定性的方案  
- 更小的改动  
- 更容易测试的实现  

这比“聪明但不稳定”的方案更重要。

