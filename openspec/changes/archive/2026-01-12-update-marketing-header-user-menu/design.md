# Design: Marketing Header 已登录态用户信息与登出入口

## 目标

- 在营销站 Header 的已登录态展示“当前用户是谁”的可见信息，并提供明确的 `Sign out` 入口。
- 保持实现最小（KISS / YAGNI）：不引入复杂导航体系、不新增第三方 UI 依赖（除非现有组件不足以满足基本可用性/可访问性）。
- 保持路由分组边界：仅影响 Marketing Layout，不影响 `/workspace` 的 App Shell（后续单独迭代）。
- 所有用户可见文案均使用英文。

## 非目标

- 不在本次实现完整 Account Settings / Profile 页面。
- 不做头像图片上传/渲染；只做文字（可选首字母圆点）。
- 不引入跨页面的“返回原路由”通用 `next` 参数（如需另起提案）。

## UI/交互

### Header（已登录态）

- Primary CTA：`Go to workspace`（保持不变）
- 用户信息菜单触发器：
  - 文案：优先 `session.user.name`，缺失则 `session.user.email`
  - 可选装饰：首字母圆点（从 `name/email` 推导）
- 下拉菜单项：
  - `Sign out`

### Sign out 行为

- 点击 `Sign out`：
  - 系统销毁会话（调用 better-auth client）
  - 页面跳转到 `/`（或触发 `router.refresh()` 并停留在当前 marketing 页面），确保服务端 Header 重新渲染为未登录态

## 技术设计

### 会话读取与组件边界

- `src/app/(marketing)/layout.tsx` 作为 Server Component 继续使用 `getSession()` 获取会话。
- 已登录态需要可交互下拉，因此用户菜单实现为 Client Component：
  - Server 仅传入最小必要字段（例如 `displayName` / `email`），避免在 client 侧再次取 session。

### 下拉菜单实现（KISS 优先）

优先方案：
- 使用原生 `<details>/<summary>` 构建下拉，可减少自定义 JS 状态管理与外部依赖；`Sign out` 按钮可由 Client Component 提供点击逻辑。

备选方案（如 `<details>` 难以满足设计/可访问性）：
- 引入 shadcn/ui 的 dropdown menu（Radix）并封装为 `src/app/_components/ui/dropdown-menu.tsx`，但应在实现阶段评估并尽量避免新增依赖。

### 可访问性注意事项

- 触发器应可聚焦，并能通过键盘打开菜单。
- `Sign out` 必须可聚焦与可触发；失败时提供可读错误（例如 inline message）。

## 测试策略（强制）

- 该变更属于可自动化的 UI 用户流（Header 展示 + 登出），实现阶段 SHALL 增补 Playwright E2E 覆盖。
- 本次不新增 `src/server/**` 服务逻辑，通常不需要新增 Vitest 单测；若实现阶段引入了非纯胶水的服务逻辑，则必须补齐对应单测并在提案中说明原因。

