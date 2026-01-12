# Change: 打通 Marketing → Auth → Workspace 主流程（Header + 跳转到 `/workspace`）

## Why

当前需要尽快打通“首次访问 → 注册/登录 → 进入工作区”的主路径，作为后续在 App（`/workspace`）持续迭代核心功能的基础。同时，为后续将营销站与应用工作区分离为两套布局（Marketing Layout vs App Layout）提前建立清晰边界，避免未来重构成本。

## What Changes

- Marketing（`/`）：
  - 增加最小可用 Header：未登录态显示 `Sign in`、`Try Free`；已登录态显示 `Go to workspace`。
  - 移除现有首页中的脚手架 demo 示例内容（例如 T3 demo 文案/外链、tRPC 示例请求、`LatestPost` 示例模块），不迁移到 marketing。
- Auth（`/login`、`/register`）：
  - 登录成功后跳转到 `/workspace`。
  - 由于强制邮箱验证，注册提交成功后**不进入工作区**，而是在 `/register` 展示 “Check your email” 提示；用户完成邮箱验证并自动登录后跳转到 `/workspace`。
- Workspace（`/workspace`）：
  - 提供最小占位页面（不实现具体功能细节）。
  - 未登录访问 `/workspace` 时重定向到 `/login`。
- Testing（质量门槛）：
  - 为本次主流程补充 Playwright E2E（覆盖：marketing header 状态、登录成功进入 `/workspace`、未登录访问 `/workspace` 重定向、注册后提示留在 `/register`）。
  - 若本次实现引入/修改 `src/server/**` 的服务逻辑，必须同步补齐 Vitest 单元测试。

## Impact

- Affected specs:
  - `marketing`（营销首页 Header 的可见入口与导航行为）
  - `auth`（登录/注册后的跳转落点与邮箱验证链路）
  - `workspace`（工作区最小页面与访问控制）
- Affected code (implementation phase):
  - `src/app/(marketing)/layout.tsx`（新增营销站布局；提供 Header）
  - `src/app/(marketing)/page.tsx`（迁移现有首页实现以承载 marketing layout）
  - `src/app/page.tsx`（移除脚手架 demo 示例逻辑；避免残留在用户可见页面）
  - `src/app/(auth)/login/*`、`src/app/(auth)/register/*`（更新登录/注册成功后的落点与提示）
  - `src/app/workspace/page.tsx`（新增最小占位页面）
  - `e2e/*`（新增/更新 Playwright 用例以覆盖主流程）
  - `src/server/**/*.test.ts`（如引入/修改服务逻辑则新增/更新单测）
  - 可能新增复用组件：`src/app/_components/*`（Header 组件）
  - 视觉一致性：实现阶段需要遵循 OMI Studio Dark 品牌规范（单一金色强调色）

## Open Questions（需要你确认）

已确认：
- 强制邮箱验证：是。
- 注册后提示页：不新增 `/verify-email`，提示继续放在 `/register`。
- Header：
  - 未登录态：`Sign in`（→ `/login`）与 `Try Free`（→ `/register`）
  - 已登录态：`Go to workspace`（→ `/workspace`）
- 本次变更不包含 `Features / Pricing / FAQ` 导航项（后续单独完善）。
