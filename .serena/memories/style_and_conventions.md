# 代码风格与约定

- TypeScript strict；优先 type-only imports。
- 路径别名: ~/* -> src/*。
- ESLint: 未使用参数用 _ 前缀。
- server/client 边界: DB/Auth/tRPC server 逻辑放在 src/server/，避免被客户端 bundle。
- Auth 使用 better-auth（Next.js Route Handler），session 在 tRPC context 中注入。
- DB 使用 Drizzle ORM + Postgres；schema 在 src/server/db/schema.ts；相关操作通过 drizzle-kit 完成。
- 机密信息: 禁止提交 .env；新增 env 需同步 .env.example 与 src/env.js。
