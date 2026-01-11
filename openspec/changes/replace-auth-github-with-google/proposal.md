# Change: 将 OAuth 从 GitHub 替换为 Google（better-auth）

## Why

当前仓库已接入 better-auth + Drizzle，并提供了 `/api/auth/*` 路由与 GitHub 社交登录入口。产品希望将社交登录提供方从 GitHub 替换为 Google，以符合渠道与运营需求。

## What Changes

- 将社交登录提供方从 GitHub 替换为 Google（包含配置、环境变量与 UI 文案/入口），并移除 GitHub 相关入口。
- 引入 `/login` 页面作为登录入口，将 Google 登录按钮放在 `/login`，为后续邮箱注册与登录做准备。
- 保持现有 better-auth + Drizzle 架构不变；仅在必要处补齐页面、调用链与配置。

## Impact

- Affected specs:
  - `auth`（Google OAuth 登录；不包含邮箱/密码登录与邮件能力，见独立提案）
- Affected code (implementation phase):
  - `src/server/better-auth/config.ts`
  - `src/app/api/auth/[...all]/route.ts`（保持；仅验证兼容性）
  - `src/env.js`, `.env.example`
  - `src/app/(auth)/login/page.tsx`（新增/更新：Google 登录入口）
  - `src/app/page.tsx`（移除直接 GitHub 登录；改为跳转/链接到 `/login`）

## Notes

- `/login` 将作为统一登录入口；后续邮箱注册/登录提案会在该页面补齐邮箱表单与相关文案。
