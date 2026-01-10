# 常用命令（omi）

## 安装/运行
- 安装依赖：`npm install`（会触发 `postinstall`：`prisma generate`）
- 启动开发：`npm run dev`（Next.js `--turbo`）
- 构建/运行：`npm run build` / `npm run start` / `npm run preview`

## 代码质量
- 综合检查（建议作为最小门槛）：`npm run check`（`next lint` + `tsc --noEmit`）
- Lint：`npm run lint` / `npm run lint:fix`
- Typecheck：`npm run typecheck`
- 格式化：`npm run format:check` / `npm run format:write`

## 数据库（Prisma + Postgres）
- 启动本地 DB 容器：`./start-database.sh`（Docker/Podman）
- 推送 schema：`npm run db:push`
- 开发迁移：`npm run db:generate`（实际为 `prisma migrate dev`）
- 部署迁移：`npm run db:migrate`（`prisma migrate deploy`）
- Prisma Studio：`npm run db:studio`

## 环境变量校验
- 如需跳过 env 校验：`SKIP_ENV_VALIDATION=1 npm run dev` 或 `SKIP_ENV_VALIDATION=1 npm run build`
