# Tasks: Marketing Header（已登录态用户信息 + Sign out）

> 说明：本文件为实现阶段的可执行清单；在提案批准前不进行代码改动。

## 1. Implementation

- [x] 1.1 更新 marketing Header 已登录态：保留 `Go to workspace`；新增用户信息菜单触发器（展示 `name`，缺失则 `email`）。
- [x] 1.2 实现用户信息菜单下拉内容：提供 `Sign out`（英文文案）入口。
- [x] 1.3 实现登出操作：调用 better-auth client 的登出能力，完成后刷新/跳转以确保 Header 与页面状态变为未登录态。
- [x] 1.4 可访问性：菜单与 `Sign out` 可键盘操作（可聚焦、可触发），并具备基本的可读 aria 标识（按实现选择）。

## 2. Validation

- [x] 2.1 E2E：新增/更新 Playwright 用例覆盖：
  - 已登录访问 `/`：Header 同时展示 `Go to workspace` 与用户信息入口；
  - 点击用户信息入口可见 `Sign out`；
  - 点击 `Sign out` 后回到未登录态（Header 显示 `Sign in` / `Try Free`）。
- [x] 2.2 通过 `npm run check` 与 `npm run test:e2e`。
