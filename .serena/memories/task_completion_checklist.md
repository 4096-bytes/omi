# 任务完成前检查清单

- 运行：`npm run format:check`（或 `npm run format:write` 修复格式）
- 运行：`npm run check`（`next lint` + `tsc --noEmit`）
- 如新增/修改环境变量：同步更新 `.env.example` 与 `src/env.js`
- 如变更 Prisma：更新 `prisma/schema.prisma` 后生成客户端（通常 `npm install` 会自动跑 `prisma generate`）；如引入迁移，按约定提交 `prisma/migrations/`
- 新增 tRPC router：在 `src/server/api/routers/` 创建后，务必在 `src/server/api/root.ts` 注册
- 确保不提交 `.env` 或任何密钥（仓库约定）
