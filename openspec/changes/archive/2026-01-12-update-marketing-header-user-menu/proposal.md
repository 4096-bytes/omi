# Change: Marketing Header（已登录态显示用户信息 + Sign out）

## Why

当前营销站（`/`）在已登录态仅展示 `Go to workspace`，缺少“当前是谁登录”的上下文与可发现的退出入口。补齐用户信息与 `Sign out` 能降低困惑、提升可控性，并为后续 marketing/app 的信息架构迭代奠定基础。

## What Changes

- Marketing Header（`/`）：
  - 已登录态：在保留 `Go to workspace` 主按钮的同时，新增“用户信息菜单”（显示用户信息，点击展开下拉）。
  - 下拉菜单提供 `Sign out` 操作，执行后退出登录并回到未登录态。
- 文案：
  - 站点仅英文，本次新增文案使用英文（例如 `Sign out`）。
- Testing（强制）：
  - 补齐/更新 Playwright E2E，覆盖已登录态用户信息显示与登出流程。

## Impact

- Affected specs:
  - `marketing`（Header 已登录态的展示与交互）
- Affected code (implementation phase):
  - `src/app/(marketing)/layout.tsx`（Header 已登录态渲染）
  - 可能新增：`src/app/(marketing)/_components/*` 或 `src/app/_components/*`（用户菜单组件）
  - `e2e/*`（补齐登出相关用例）

## Decisions（已确认）

- Header 已登录态结构：保留 `Go to workspace`，并新增用户信息菜单（下拉包含 `Sign out`）。
- 用户信息展示：优先显示 `name`，缺失则 fallback 到 `email`；不做头像图片（可选：首字母圆点）。

