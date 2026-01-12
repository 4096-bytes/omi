# Design: Auth（Google OAuth）

## 目标

- 将现有 GitHub OAuth 登录替换为 Google OAuth 登录，不保留 GitHub provider。
- 引入 `/login` 页面作为统一登录入口，Google 登录按钮放在 `/login`（为后续邮箱登录/注册做准备）。
- 保持实现简单（KISS/YAGNI）：不引入新的 auth 框架或复杂的状态管理。

## 现状（基于代码扫描）

- better-auth 已通过 `src/app/api/auth/[...all]/route.ts` 暴露 Next.js handler。
- `src/server/better-auth/config.ts` 已配置 `socialProviders.google`（本 change 已切换为 Google OAuth）。
- 登录入口已调整为 `/login`，由该页面客户端调用 `authClient.signIn.social({ provider: \"google\" })` 发起 OAuth 流程（确保 OAuth state 相关 cookie 能正确落到浏览器）；首页未登录态仅提供跳转入口。
- DB 使用 Drizzle；schema 已存在 `user/session/account/verification` 表定义（见 `src/server/db/schema.ts`）。

## 方案概述

### 页面与路由

- 新增：
  - `/login`：仅提供 Google OAuth 登录入口（建议放在 `src/app/(auth)/login/`，后续邮箱登录/注册可复用同一分组）
- 首页：
  - 未登录：展示“去登录”的链接/按钮（跳转 `/login`）
  - 已登录：展示用户信息与退出入口（沿用现有实现）

### UI/UX 设计（/login，基于 ui-ux-pro-max）

> 目标：做一个“可直接上线”的极简登录页，同时为后续邮箱登录/注册预留清晰的扩展位（不在本 change 实现邮箱表单）。

#### 视觉与风格

- 产品类型：SaaS（Micro SaaS）登录页风格；优先 “Flat + Glassmorphism” 的轻量组合，避免重动效与复杂布局。
- 主题：延续现有深色背景（暗色模式友好）+ 半透明卡片（glass card），强调对比与可读性。
- 字体：保持现有 `Geist`（见 `src/app/layout.tsx`），不在本 change 引入新的字体体系；如未来需要品牌化字体，再单独提案。

#### 布局结构（信息架构）

- 版式：单卡片居中（mobile-first），在 `md` 以上可扩展为两列：
  - 左侧：品牌/产品简介（可选，偏 marketing copy；可不做）
  - 右侧：登录卡片（Google 按钮 + 未来邮箱登录区）
- 登录卡片内容顺序（从上到下）：
  1) 标题：`Sign in to OMI`
  2) 描述：`Continue with Google to access your workspace.`
  3) 主要 CTA：`Sign in with Google`（全宽按钮）
  4) Divider：`or`（为后续邮箱登录预留）
  5) 预留区：`Email sign-in will be available soon`（本 change 可只放占位文案，避免引入表单与逻辑）
  6) 辅助链接：`Back to home`（回 `/`）

#### 组件与交互细节

- Google 按钮：
  - 采用白底深字（对比强、符合品牌按钮常见样式），内含 Google SVG 标识（不使用 emoji；不引入整套 icon 库也可）。
  - Hover：仅颜色/阴影变化，避免 scale 造成布局抖动。
  - Loading：点击后按钮进入 disabled + spinner（>300ms 显示，避免“卡死感”）。
- 错误提示（可访问性优先）：
  - 登录失败时在按钮下方展示错误提示，使用 `role="alert"` 或 `aria-live="polite"`，并提供“重试/返回”路径。
- 键盘/焦点：
  - 所有可交互元素有可见 focus ring；Tab 顺序自然（按钮 → 辅助链接）。

#### 响应式与可达性

- Mobile：卡片宽度 `w-full max-w-md`，左右 padding ≥ 16px。
- Desktop：卡片宽度不超过 `max-w-lg`；若两列则整体容器 `max-w-5xl`，左右留白充足。
- 颜色对比：确保正文/次要文案在深色背景下 ≥ WCAG AA（避免过浅灰）。

#### 与后续邮箱提案的衔接

- `add-auth-email-password-resend` 将在同一 `/login` 页面实现邮箱/密码登录表单：
  - 复用 divider 下方预留区，替换占位文案为邮箱表单；
  - 保持 Google 按钮作为社交登录入口并存。

### 调用链

- Google OAuth：
  - `/login` 页面使用 `authClient.signIn.social` 触发 `/api/auth/sign-in/social`：由 better-auth 的 fetch redirect plugin 自动跳转到 Google 授权页。
  - 说明：OAuth 需要在发起阶段写入 state cookie（以及 verification 记录）。使用 server action 直接调用 `auth.api.signInSocial` 时，`Set-Cookie` 不会自动回传给浏览器，容易导致回调阶段 `state_mismatch`；因此本 change 采用客户端调用。
  - 首次登录需要创建用户记录：`user.name` 为非空字段，应优先使用 Google profile 的 name；缺失时生成默认值（例如取 email 本地部分）。

### 配置与环境变量

- 将 `BETTER_AUTH_GITHUB_CLIENT_ID/SECRET` 替换为 `BETTER_AUTH_GOOGLE_CLIENT_ID/SECRET`。
- 更新 `src/env.js` 与 `.env.example`，并确保本地开发的回调 URL 与 Google OAuth 控制台配置一致：
  - 预期回调形态：`http://localhost:3000/api/auth/callback/google`（与 better-auth provider 名称一致）。
- Google 控制台（本地开发）需要配置：
  - Authorized JavaScript origins：`http://localhost:3000`
  - Authorized redirect URIs：`http://localhost:3000/api/auth/callback/google`
- 本地环境变量建议写入 `.env`（或 `.env.local`），不要提交到仓库：
  - `BETTER_AUTH_GOOGLE_CLIENT_ID=<your-client-id>`
  - `BETTER_AUTH_GOOGLE_CLIENT_SECRET=<your-client-secret>`

## 非目标（本次不做）

- 邮箱/密码注册与登录与邮件能力（见独立提案 `add-auth-email-password-resend`）
- 2FA、多 provider 并存
- 细粒度权限系统（RBAC/ABAC）
- 引入独立测试框架（除非后续明确要求）

## 风险与回滚

- 风险：Google OAuth 回调 URL 配置不一致导致无法登录；通过在文档中明确 required redirect URIs 以及在开发期自检缓解。
- 回滚：保留更改为单一 provider 的修改点（config/env/UI），可在必要时恢复 GitHub provider（独立 change 处理）。
