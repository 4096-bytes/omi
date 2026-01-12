# Tasks: 实现邮箱注册/登录并集成 Resend

> 说明：本文件为实现阶段的可执行清单；在提案批准前不进行代码改动。

- [x] 增加环境变量与校验：`RESEND_API_KEY`、`RESEND_FROM_EMAIL`（`src/env.js`、`.env.example`）。
- [x] 设计并实现 server-only 邮件模块（Resend SDK 封装），提供最小 `sendEmail()` 能力与 auth 专用邮件函数。
- [x] 在 better-auth 中接入邮件发送：启用 `requireEmailVerification`；注册后发送验证邮件；验证回调后更新 `emailVerified`；未验证不允许登录（`src/server/better-auth/config.ts`）。
- [x] 新增注册页：邮箱/密码注册；注册成功后跳转 `/` 并提示已发送验证邮件（如启用验证）。
- [x] 新增/扩展 `/login` 页面：邮箱/密码登录；登录成功跳转 `/`（若 `/login` 已由 `replace-auth-github-with-google` 提案提供，则在同页面追加邮箱表单并保持 Google 入口可用）。
- [x] 退出登录：提供可见的退出入口（可复用首页/布局/登录页）。
- [x] DB 一致性检查：确认 Drizzle schema 覆盖 better-auth 邮件验证所需的表结构（`user/account/session/verification`）；必要时生成并提交迁移。
- [x] 质量门槛：`npm run check`；并补充最小本地验证步骤（文档化）。
