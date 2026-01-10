# OpenSpec 使用提示

## 何时需要 OpenSpec
- 请求包含：proposal/spec/change/plan 等规划类关键词
- 引入新能力、破坏性变更、架构调整、较大性能/安全改动
- 需求含糊且需要权威 spec 再动手实现

## 工作流（摘要）
- 先读：`openspec/AGENTS.md`
- 选择 `change-id`（kebab-case、动词开头，如 `add-...`/`update-...`）
- 在 `openspec/changes/<change-id>/` 编写：`proposal.md`、`tasks.md`（必要时 `design.md`）及 delta specs
- 校验：`openspec validate <change-id> --strict`
- **未获批准不要开始实现**（OpenSpec 约定）
