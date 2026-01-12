# Tasks: 将 OAuth 从 GitHub 替换为 Google（better-auth）

> 说明：本文件为实现阶段的可执行清单；在提案批准前不进行代码改动。

- [x] 更新 better-auth OAuth provider：`github` → `google`（`src/server/better-auth/config.ts`、`src/app/page.tsx`）。
- [x] 更新环境变量与校验：新增/替换 `BETTER_AUTH_GOOGLE_CLIENT_ID/SECRET`，移除 GitHub 变量依赖（`src/env.js`、`.env.example`）。
- [x] 在 Google 控制台配置 OAuth（本地）：Authorized JavaScript origins=`http://localhost:3000`；Authorized redirect URIs=`http://localhost:3000/api/auth/callback/google`（生产环境按域名追加）。
- [x] 新增/更新 `/login` 页面：提供 “Sign in with Google” 入口（客户端调用 `authClient.signIn.social({ provider: \"google\" })`，由 better-auth 的 redirect plugin 执行跳转），成功后跳转 `/`。
- [x] 首页登录入口调整：未登录时不直接展示社交登录按钮，改为链接/跳转到 `/login`；已登录态保持不变（展示用户信息与退出）。
- [x] 确认首次 Google 登录会创建用户/账户记录；并确保 `user.name` 可被可靠填充（来自 Google profile；缺失时生成默认值）。
- [x] DB 迁移与一致性检查：确认 Drizzle schema 覆盖 better-auth 所需表结构（`user/account/session/verification`），必要时补齐迁移并提交。
- [x] 修复 drizzle-kit `tablesFilter` 配置，确保 `db:push` 会创建 better-auth 所需表（`drizzle.config.ts`）。
- [x] 基础校验：`npm run check`；必要时补充最小的运行验证步骤（本仓库暂无测试框架）。
- [x] 更新文档：同步 `README.md`/`openspec/project.md` 中与 OAuth provider、env 相关的说明（如有新增约束）。
