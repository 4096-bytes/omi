# 代码风格与约定

## TypeScript / 模块
- TS 配置为严格模式：`tsconfig.json` 启用 `strict`、`noUncheckedIndexedAccess` 等。
- 使用路径别名：`~/*` → `src/*`。

## ESLint
- 基于 `next/core-web-vitals` + `typescript-eslint`（包含 type-checked/stylistic configs）。
- 约定：
  - 优先 type-only imports（`@typescript-eslint/consistent-type-imports`）
  - 未使用参数如确需保留，前缀 `_`（`argsIgnorePattern: "^_"`）

## Prettier
- 启用 `prettier-plugin-tailwindcss`（Tailwind class 自动排序）。

## 结构/命名（项目约定）
- 组件：`PascalCase.tsx`；hooks：`useXyz`。
- tRPC routers：`src/server/api/routers/<domain>.ts`，并在 `src/server/api/root.ts` 注册。
- 不要手改 `generated/`；修改 Prisma schema 后用生成命令再生。
