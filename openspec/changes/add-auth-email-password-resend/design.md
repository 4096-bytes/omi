# Design: Email Auth + Resend

## 目标

- 以最小改动实现邮箱/密码注册与登录（better-auth）。
- 对“需要发送邮件”的认证流程使用 Resend（验证邮件为首要用例）。
- 强制邮箱验证：未验证邮箱不允许登录。
- 保持 server-only 边界清晰，避免把邮件发送逻辑打进客户端 bundle。

## 集成原则（KISS / SOLID）

- 将邮件发送抽象为小接口（依赖倒置）：auth 逻辑依赖 `EmailSender` 抽象，不直接依赖 Resend SDK。
- 默认实现为 Resend；未来需要替换供应商时仅替换实现，不改调用方。

## 邮件发送 SDK 封装（建议）

### 环境变量

- `RESEND_API_KEY`：Resend API Key（server-only）
- `RESEND_FROM_EMAIL`：发件人地址（server-only），固定为 `onboarding@resend.dev`

### 模块结构（示例）

- `src/server/email/sender.ts`
  - `export interface EmailSender { send(input): Promise<void> }`
- `src/server/email/resend.ts`
  - `class ResendEmailSender implements EmailSender`：封装 Resend SDK；统一错误处理与日志字段
- `src/server/email/templates/auth.ts`
  - `buildVerifyEmail({ verifyUrl, appName })`：返回 `{ subject, html, text }`
- `src/server/email/index.ts`
  - 导出 `emailSender` 实例与 auth 邮件 helper（例如 `sendVerifyEmail(to, verifyUrl)`）

> 模板策略：先使用简单 HTML + text（避免引入额外模板体系）。如后续需要可维护模板，再单独提案引入 React Email。

## better-auth 侧接入点（设计）

- 继续使用 `emailAndPassword` 能力（已存在）。
- 增加 email verification 的配置与发送钩子：
  - 由 better-auth 生成验证 token/URL
  - 通过 `EmailSender` 发送验证邮件（Resend）
  - 用户点击链接完成验证后，`emailVerified` 更新为 `true`
  - 登录强制校验 `emailVerified=true`（`emailAndPassword.requireEmailVerification=true`）

## 页面与路由（与 Google 提案协同）

- `/login`：
  - 本提案提供邮箱/密码登录表单
  - 若已应用 `replace-auth-github-with-google`，则同页面同时提供 Google 登录入口
- `/register`：提供邮箱/密码注册表单（提交时为 `name` 生成默认值）

## 数据一致性与约束

- `user.name` 在当前 Drizzle schema 中为非空字段：
  - better-auth 的 `/sign-up/email` 端点要求 `name` 字段；UI 可不暴露该字段，但在提交注册时需要为 `name` 生成默认值（例如 email 本地部分）。
- 邮件发送失败策略：
  - 注册成功但验证邮件发送失败时：优先保证账号创建成功，同时向用户展示可重试/重新发送的提示（重发能力可作为后续增量）。

## 非目标（本次不做）

- 忘记密码/重置密码
- 登录魔法链接（Magic Link）/OTP 邮箱无密码登录（如需要可另开提案）
- 引入测试框架（本仓库当前以 `npm run check` 为门槛）
