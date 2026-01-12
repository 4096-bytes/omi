# Tasks: 打通 Marketing → Auth → Workspace 主流程

> 说明：本文件为实现阶段的可执行清单；在提案批准前不进行代码改动。

- [x] 路由分组：新增 `src/app/(marketing)/`，将现有首页迁移为 `src/app/(marketing)/page.tsx`，为后续 marketing/app 双布局打底。
- [x] 清理首页 demo：删除 `src/app/page.tsx` 中的脚手架示例（T3 demo 文案/外链、tRPC 示例请求、`LatestPost` 示例模块），且不迁移到 marketing。
- [x] Marketing Header：新增 `src/app/(marketing)/layout.tsx`（或组件），未登录态显示 `Sign in`（→ `/login`）与 `Try Free`（→ `/register`）；已登录态显示 `Go to workspace`（→ `/workspace`）。
- [x] Auth（登录）：更新 `/login` 的登录成功落点为 `/workspace`（邮箱登录与 Google 登录均一致）；已登录访问 `/login` 时跳转到 `/workspace`。
- [x] Auth（注册）：更新注册提交成功后的提示落点为 `/register`（展示 “Check your email”）；将验证邮件链路的 `callbackURL` 设为 `/workspace`，用户完成验证并自动登录后进入 `/workspace`。
- [x] Workspace：新增 `/workspace` 最小占位页面（不实现功能细节），并在未登录访问时重定向到 `/login`。
- [x] 可用性：移动端 Header 仍可用（不遮挡内容、可点击、可聚焦）。
- [x] E2E：新增/更新 Playwright 用例覆盖主流程（`/` Header 状态、`/login` 成功后进入 `/workspace`、未登录访问 `/workspace` 重定向、`/register` 注册后提示留在 `/register`）。
- [x] Unit：若本次实现新增/修改了 `src/server/**` 的服务逻辑（非纯 UI/路由改动），必须同步新增/更新 Vitest 单元测试。
- [x] 验收：手动验证主流程；并通过 `npm run check`、`npm run test:e2e`；若涉及服务逻辑变更同时通过 `npm run test:unit`。
