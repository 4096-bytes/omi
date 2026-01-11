# 完成任务时的检查清单

- 若改动包含 TS/业务逻辑：运行 npm run check。
- 若改动涉及格式：运行 npm run format:check（必要时 format:write）。
- 若改动涉及 DB/schema：使用 drizzle-kit 生成/迁移并在 PR 中说明影响。
- 若新增/调整环境变量：同步更新 .env.example 与 src/env.js。
- 若改动涉及 OpenSpec：更新对应 specs/changes 并（如适用）运行 openspec validate。
