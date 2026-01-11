# OMI / omi 项目概览

## 项目目的
- 面向室内设计师的「对话即生产」工作台：对话 + 坐标点引导（Point-to-Edit）实现可控编辑，并配套 Credits（按 Token 计费）商业底座。

## 技术栈（当前）
- Next.js App Router + React + TypeScript
- tRPC v11 + TanStack React Query
- Auth: better-auth（Next.js Route Handler）
- DB: PostgreSQL + Drizzle ORM（drizzle-kit 负责 schema/迁移/Studio）
- Tailwind CSS；ESLint + Prettier

## 目录结构
- src/app/: 页面与路由（含 src/app/api/ route handlers）
- src/server/: 服务端代码
  - src/server/better-auth/: better-auth 配置与 session helper
  - src/server/db/: Drizzle 连接与 schema
  - src/server/api/: tRPC 入口与 routers
- src/trpc/: tRPC/React Query 客户端与服务端工具

## 关键文件
- Auth 配置: src/server/better-auth/config.ts
- Auth 路由: src/app/api/auth/[...all]/route.ts
- DB 连接: src/server/db/index.ts
- DB schema: src/server/db/schema.ts
- tRPC context: src/server/api/trpc.ts
- tRPC root router: src/server/api/root.ts
- 环境变量 schema: src/env.js
- drizzle-kit 配置: drizzle.config.ts
