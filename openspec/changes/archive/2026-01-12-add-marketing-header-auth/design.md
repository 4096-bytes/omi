# Design: Marketing → Auth → Workspace 主流程（双布局铺垫 + 跳转策略）

## 目标

- 为营销首页（`/`）提供稳定的顶栏入口（`Sign in` / `Try Free` / `Go to workspace`），并打通到 `/workspace` 的主流程。
- 为后续“Marketing 与 App 两套布局”建立清晰的路由分组与布局边界，避免未来重构成本。
- 保持改动最小（KISS）：只做 Header 与必要的会话判断，不引入复杂导航、i18n 或工作区实现。
- 清理脚手架 demo：确保用户可见页面不包含 T3/tRPC 示例与 demo 模块，避免品牌与产品信息噪声。

## 非目标（本次不做）

- Marketing 信息架构（`Features / Pricing / FAQ`）与整页内容重做。
- 认证回调策略的通用化（例如统一 `next` 参数并支持任意受保护路由）；本次仅实现固定落点到 `/workspace`。
- 国际化（i18n）：当前站点仅英文，本次所有可见文案均为英文，但不引入多语言体系。
- 完整 marketing 内容（Hero/Features/Pricing/FAQ）：本次首页可为最小占位，但不得保留脚手架 demo。

## UX / 交互设计

### Header 入口状态机

- 未登录态：
  - 次入口：`Sign in` → `/login`
  - 主入口（Primary CTA）：`Try Free` → `/register`
- 已登录态：
  - 主入口：`Go to workspace` → `/workspace`

> 说明：已登录态不再显示 `Sign in/Try Free`，避免信息噪声与误导。

### 认证成功后的落点（固定 `/workspace`）

- 登录成功后进入 `/workspace`（通过 better-auth client 的 `callbackURL` 设置实现）。
- 注册流程由于强制邮箱验证：
  - 注册提交成功后仍停留在 `/register`，展示 “Check your email” 提示
  - 用户完成邮箱验证并自动登录后进入 `/workspace`（通过 `callbackURL: "/workspace"` 贯穿验证链路）

> 未来若需要“从任意受保护页面跳转到登录，再回跳原页面”，建议另起提案引入 `?next=` 并在登录/注册提交时使用 `callbackURL` 透传该值。

## 技术设计（UI / 路由）

### 路由分组与布局边界（Next.js App Router）

- `src/app/layout.tsx`：仅保留全局 Provider/字体/主题（当前已有）。
- 新增 `src/app/(marketing)/layout.tsx`：渲染 Marketing Header（后续可扩展 Footer）。
- 将现有首页迁移为 `src/app/(marketing)/page.tsx`，确保 `/` 命中 marketing layout。

> 通过 route group 隔离布局，可避免将来 `/workspace` 的 App Shell 与 marketing 顶栏互相污染。

### 清理 `src/app/page.tsx` 的脚手架 demo（避免迁移污染）

当前 `src/app/page.tsx` 含有脚手架示例（T3 demo 文案与外链、tRPC 示例调用、`LatestPost` 示例模块）。本次实现阶段需要：

- 不将上述 demo 逻辑迁移到 `src/app/(marketing)/page.tsx`。
- 将 marketing 首页替换为最小的产品占位内容（英文文案即可），仅用于承载 Header 与主流程入口。

### Header 组件拆分（KISS + 可复用）

- 建议组件层级：
  - `MarketingLayout`（Server Component）：读取 session → 传给 `MarketingHeader`
  - `MarketingHeader`（尽量保持 Server Component）：根据 session 渲染不同的 `<Link />`

不引入 client state 的理由：
- Header 仅依赖“是否登录”的离散状态；渲染在服务端可避免 hydration 复杂度，并减少闪烁（FOUC/跳变）。

## 技术设计（后端/会话逻辑）

### 会话来源与读取位置

- 使用现有 `getSession()`（`src/server/better-auth/server.ts`）在 marketing layout 中读取会话。
- 读取到 session：
  - truthy → 渲染 `Go to workspace`
  - falsy → 渲染 `Sign in` / `Try Free`

### 性能与稳定性

- `getSession()` 当前使用 `react/cache` 包装，适合在 RSC 中复用。
- Header 的条件渲染避免布局跳动：按钮区域宽度与对齐在两种状态下保持稳定（实现阶段注意）。

### `/workspace` 访问控制（最小实现）

- 新增 `/workspace` 页面作为 App 的入口（仅占位，不实现功能细节）。
- 页面在服务端读取 session：
  - 无 session → `redirect("/login")`
  - 有 session → 渲染占位内容

## 风格与品牌一致性（实现阶段约束）

- 遵循 OMI Studio Dark：深色背景 + 单一金色强调色。
- `Try Free` / `Go to workspace` 作为 Primary CTA；`Sign in` 为次级链接样式。

## 测试策略（强制）

- E2E（Playwright）：
  - 本变更引入/修改了用户主流程，属于可稳定自动化的场景，SHALL 补齐 Playwright E2E 覆盖。
  - 用例重点：`/` Header 状态（未登录/已登录）、`/login` 成功后进入 `/workspace`、未登录访问 `/workspace` 的重定向、`/register` 注册后停留并展示 “Check your email”。
- Unit（Vitest）：
  - 若本次实现新增或修改了 `src/server/**` 的服务逻辑（非纯胶水/类型调整），SHALL 补齐对应单元测试。

## 验收与回归

- `/` 顶部可见 Header：
  - 未登录：存在 `Sign in`、`Try Free` 且链接正确
  - 已登录：存在 `Go to workspace` 且链接正确
- `/login` 登录成功后进入 `/workspace`。
- `/register` 注册提交成功后停留在 `/register` 并展示 “Check your email” 提示；用户完成验证后进入 `/workspace`。
- 通过 `npm run check` 与 `npm run test:e2e`（实现阶段）；若涉及服务逻辑变更，同时通过 `npm run test:unit`。
