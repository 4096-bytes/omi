# 代码结构速览

## 目录
- `src/app/`：Next.js App Router 页面与路由
  - `src/app/layout.tsx`：根布局（注入 `TRPCReactProvider`）
  - `src/app/page.tsx`：示例首页（含 NextAuth 登录/登出入口、tRPC 示例）
  - `src/app/api/auth/[...nextauth]/route.ts`：NextAuth handlers
  - `src/app/api/trpc/[trpc]/route.ts`：tRPC fetch adapter handler
- `src/app/_components/`：共享 UI 组件（示例：`post.tsx`）
- `src/server/`：服务端代码
  - `src/server/db.ts`：PrismaClient 单例
  - `src/server/auth/`：NextAuth 配置与导出（`auth`, `handlers`, `signIn`, `signOut`）
  - `src/server/api/`：tRPC 上下文、router 组装与 routers
- `src/trpc/`：tRPC + React Query 客户端/服务端工具
- `src/styles/`：全局样式（Tailwind）
- `prisma/schema.prisma`：Prisma 数据模型（包含 NextAuth 所需表 + 示例 Post）
- `generated/prisma/`：Prisma 生成客户端（不要手改）

## 关键调用链
- Web 请求进入 `src/app/api/trpc/[trpc]/route.ts` → `appRouter`（`src/server/api/root.ts`）→ `createTRPCContext`（`src/server/api/trpc.ts`，注入 `db`/`session`）。
- 认证请求进入 `src/app/api/auth/[...nextauth]/route.ts` → `src/server/auth/*`。
