# Auth

## ADDED Requirements

### Requirement: /login 登录入口页
系统 SHALL 提供 `/login` 页面作为登录入口，并在该页面提供 Google 登录入口；系统 SHALL 移除 GitHub 登录入口。

#### Scenario: 访问 /login
- **GIVEN** 用户未登录
- **WHEN** 用户访问 `/login`
- **THEN** 系统展示 “Sign in with Google” 入口

#### Scenario: 未登录状态显示 Google 登录
- **GIVEN** 用户未登录
- **WHEN** 用户访问任意需要展示登录入口的页面
- **THEN** 系统提供跳转到 `/login` 的入口（而非直接展示社交登录按钮）

### Requirement: Google OAuth 登录
系统 SHALL 支持用户使用 Google OAuth 完成注册/登录，并在 UI 中仅提供 Google（不提供 GitHub）作为社交登录入口。

#### Scenario: 用户通过 Google OAuth 成功登录
- **GIVEN** 用户未登录
- **WHEN** 用户发起 Google OAuth 登录并完成授权回调
- **THEN** 系统创建或关联用户记录
- **AND THEN** 系统创建会话并使用户处于已登录态
- **AND THEN** 系统将用户跳转到 `/`

#### Scenario: 用户首次使用 Google 登录（自动注册）
- **GIVEN** 用户未登录且系统中不存在该 Google 账号对应的用户
- **WHEN** 用户完成 Google OAuth 授权回调
- **THEN** 系统创建用户与账号关联记录
- **AND THEN** 系统为用户生成非空 `name`（优先使用 Google profile；缺失时生成默认值）
- **AND THEN** 系统创建会话并使用户处于已登录态
