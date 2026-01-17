# 执行蓝图（中文）— V0.1

本文件用于：
- 个人日常开发执行
- 指挥 Codex 按顺序推进
- 防止跑偏 / 提前写 UI / 过早接 AI

---

## 当前阶段：Milestone A — pet-core

### 当前目标
实现确定性的养成核心逻辑（无 UI、无 AI）

---

## 当前允许做的事情
- 定义 PetState / Event
- 实现 reducer
- 实现 tick 与补偿
- 写 vitest 单测

---

## 当前禁止做的事情
- ❌ 任何 UI
- ❌ 任何 LLM 调用
- ❌ 非确定性逻辑
- ❌ “先写了再说”

---

## 今日执行清单（示例）
- [ ] 定义 PetState 类型
- [ ] 实现 clamp 工具
- [ ] 实现 deriveMood()
- [ ] reducer：FEED / PET
- [ ] 单测：动作 delta 校验

---

## 完成标准（DoD）
- pnpm -r test 全绿
- reducer 对相同输入产生相同输出

