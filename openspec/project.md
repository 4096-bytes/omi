# 项目上下文（OMI AI / Oh-My-Interior）

## 目的与范围（MVP）

OMI AI 是一个面向室内设计师的「对话即生产」工作台：通过语义化对话 + 画布坐标点引导（Point-to-Edit）实现更可控的无蒙版编辑体验，并在产品层配套按 Token 计费的 Credits 商业底座。

本仓库当前聚焦：
- Next.js App Router Web 应用（含 RSC/Route Handlers）
- tRPC API（与前端 React Query 集成）
- better-auth 登录体系（邮箱/密码 + 可选 OAuth）
- PostgreSQL + Drizzle ORM 数据层

## 技术栈（当前真实）

- **Web**：Next.js（App Router）+ React + TypeScript
- **API**：tRPC v11 + TanStack React Query
- **Auth**：better-auth（Next.js route handler：`src/app/api/auth/[...all]/route.ts`）
- **DB**：PostgreSQL + Drizzle ORM（连接：`src/server/db/index.ts`；schema：`src/server/db/schema.ts`；工具：drizzle-kit）
- **样式**：Tailwind CSS + shadcn/ui（配套 Prettier/Tailwind class 排序）
- **配置**：`src/env.js`（zod schema）+ `.env.example`

## 代码结构与边界

- `src/app/`：Next.js 页面与路由（含 `src/app/api/` route handlers）
- `src/app/_components/`：可复用 UI 组件（包含 `src/app/_components/ui/` 的 shadcn/ui primitives）
- `src/server/`：服务端代码（可依赖 Node/DB/Auth；避免被客户端 bundle）
  - `src/server/better-auth/`：better-auth 配置与服务端 session helper
  - `src/server/db/`：Drizzle 连接与 schema
  - `src/server/api/`：tRPC 入口与 routers
- `src/trpc/`：tRPC + React Query 客户端/服务端 helpers

## 关键实现位置（便于快速定位）

- **Auth 配置**：`src/server/better-auth/config.ts`（adapter、providers、session 类型推断）
- **Auth 入口路由**：`src/app/api/auth/[...all]/route.ts`
- **服务端取 session**：`src/server/better-auth/server.ts`（`getSession()`）
- **DB 连接**：`src/server/db/index.ts`（dev 下用 global 缓存连接避免 HMR 重连）
- **DB schema**：`src/server/db/schema.ts`
- **tRPC context**：`src/server/api/trpc.ts`（ctx 注入 `db` 与 `session`）
- **tRPC routers 注册**：`src/server/api/root.ts`

## 开发命令（npm）

> 以 `package.json` 为准；如新增/调整脚本，请同步更新 `AGENTS.md` 与本文件。

- `npm run dev`：启动开发服务（Next.js `--turbo`）
- `npm run build` / `npm run start` / `npm run preview`：构建/运行
- `npm run check`：`next lint` + `tsc --noEmit`（最低 CI 门槛）
- `npm run test:unit` / `npm run test:unit:watch`：Vitest 单元测试（后端服务逻辑）
- `npm run test:e2e` / `npm run test:e2e:ui`：Playwright E2E（基于 Chromium / CDP，覆盖真实用户链路）
- `npm run format:check` / `npm run format:write`：Prettier 校验/格式化（当前仅覆盖 `ts/tsx/js/jsx/mdx`）
- `./start-database.sh`：启动本地 Postgres（依赖 Docker/Podman）
- `npm run db:push` / `npm run db:migrate` / `npm run db:generate` / `npm run db:studio`：drizzle-kit 工作流

## 代码风格与约定

- TypeScript strict；优先使用 type-only imports
- 路径别名：`~/*` → `src/*`
- ESLint：对未使用参数使用 `_` 前缀
- 保持 server/client 边界清晰：DB/Auth/tRPC server 逻辑放在 `src/server/`

## 测试策略

当前未配置独立测试框架；以 `npm run check` 作为质量门槛。

当需要覆盖真实用户链路（尤其是认证、表单、路由跳转等 UI 交互）时，测试 SHALL 优先采用基于 Chrome DevTools Protocol 的端到端自动化方案（推荐：Playwright + Chromium），并按“实际场景”建设用例（新增脚本与约定需写入 OpenSpec）。

约定：
- 后端服务逻辑的单元测试使用 Vitest，测试用例优先就近放置（例如 `src/server/**/*.test.ts`），通过 `npm run test:unit` 执行。
- E2E 测试放在 `e2e/`，通过 `npm run test:e2e` 执行；首次运行可能需要 `npx playwright install` 安装浏览器。

## Git 工作流

- 采用 Conventional Commits（例如：`feat: ...`、`fix(auth): ...`）
- PR 建议包含：变更动机、影响范围、UI 截图（如适用）、迁移说明（如涉及数据库变更）

## 领域上下文（提示）

- Credits 计费为产品核心能力之一（按 Token 计费、失败返还等约束）；落地实现应优先写入 specs
- 图片生成/编辑流程中涉及「坐标点引导」交互（Point-to-Edit），需求变化可能较频繁，建议用 OpenSpec 管理

## 重要约束与安全

- 严禁提交 `.env` 或任何密钥；新增环境变量需同步更新 `.env.example` 与 `src/env.js`
- DB schema/迁移由 drizzle-kit 管理：避免手改生成产物；迁移变更需要随 PR 一起提交并在说明中明确影响

## 外部依赖

- PostgreSQL（本地 `./start-database.sh`；生产环境由部署平台提供）
- OAuth（如 Google）依赖对应的 clientId/clientSecret 与回调 URL 配置（见 `src/server/better-auth/config.ts`）
