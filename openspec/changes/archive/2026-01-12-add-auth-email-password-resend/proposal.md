# Change: 实现邮箱注册/登录（better-auth）并使用 Resend 发送认证邮件（强制邮箱验证）

## Why

产品需要提供邮箱注册与登录能力（better-auth 的默认能力之一），以覆盖非社交登录用户。邮箱相关的事务邮件（例如验证邮件）需要通过 Resend 统一发送，便于后续模板管理、投递监控与域名配置。

## What Changes

- 提供邮箱 + 密码注册/登录的用户可见流程（页面、表单校验、错误提示、成功后跳转到 `/`）。
- 对新注册用户发送邮箱验证邮件（Resend），并在用户完成验证后更新 `emailVerified`；**未验证不允许登录**。
- 引入最小的 Resend “邮件发送 SDK 封装”（server-only），作为 auth/业务邮件发送的统一入口。

## Impact

- Affected specs:
  - `auth`（邮箱注册、邮箱登录、退出、邮箱验证邮件、Resend 集成）
- Affected code (implementation phase):
  - `src/server/better-auth/config.ts`（启用/配置 email 相关能力与邮件发送钩子）
  - `src/server/better-auth/server.ts`、`src/app/api/auth/[...all]/route.ts`（保持；验证兼容性）
  - `src/env.js`, `.env.example`（新增 Resend 配置）
  - 新增 server-only 邮件模块（例如 `src/server/email/*`）
  - 新增/扩展登录/注册页面（例如 `src/app/(auth)/login`、`src/app/(auth)/register`；其中 Google 按钮由 `replace-auth-github-with-google` 提案提供）

## Open Questions（需要你确认）

已确认：
- 邮箱验证为强制门槛：`emailVerified=false` 时不允许登录
- 邮件模板先用简单 HTML + text（不引入 React Email）
- `RESEND_FROM_EMAIL` 使用 `onboarding@resend.dev`
