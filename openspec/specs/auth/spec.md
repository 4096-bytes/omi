# auth Specification

## Purpose
TBD - created by archiving change replace-auth-github-with-google. Update Purpose after archive.
## Requirements
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

### Requirement: Email/Password 注册
系统 SHALL 支持用户通过邮箱与密码完成注册，并创建可用会话。

#### Scenario: 用户成功注册
- **GIVEN** 用户未登录
- **WHEN** 用户提交 `email` 与 `password` 完成注册
- **THEN** 系统创建用户记录
- **AND THEN** 系统创建会话并使用户处于已登录态
- **AND THEN** 系统将用户跳转到 `/`

#### Scenario: 注册信息不合法
- **GIVEN** 用户未登录
- **WHEN** 用户提交缺失字段或不合法字段（例如邮箱格式不正确、密码不满足最小要求）
- **THEN** 系统拒绝注册并返回可读错误信息
- **AND THEN** 系统不应创建用户记录与会话

### Requirement: Email/Password 登录
系统 SHALL 支持用户通过邮箱与密码登录并创建会话。

#### Scenario: 用户成功登录
- **GIVEN** 用户未登录且已存在账号
- **WHEN** 用户提交正确的 `email` 与 `password`
- **THEN** 系统创建会话并使用户处于已登录态
- **AND THEN** 系统将用户跳转到 `/`

#### Scenario: 密码错误
- **GIVEN** 用户未登录且已存在账号
- **WHEN** 用户提交正确邮箱但密码错误
- **THEN** 系统拒绝登录并返回可读错误信息
- **AND THEN** 系统不应创建会话

#### Scenario: 邮箱未验证禁止登录
- **GIVEN** 用户未登录且账号 `emailVerified=false`
- **WHEN** 用户提交正确的 `email` 与 `password`
- **THEN** 系统拒绝登录并返回“邮箱未验证”的可读错误信息
- **AND THEN** 系统不应创建会话

### Requirement: 邮箱验证邮件（Resend）
系统 SHALL 在用户注册后发送邮箱验证邮件，并通过 Resend 完成投递；未验证邮箱不允许登录。

#### Scenario: 注册后发送验证邮件
- **GIVEN** 用户完成邮箱注册
- **WHEN** 系统进入发送验证邮件流程
- **THEN** 系统通过 Resend 向该邮箱发送包含验证链接的邮件
- **AND THEN** `emailVerified` SHALL 保持为 `false` 直到用户完成验证

#### Scenario: 用户完成邮箱验证
- **GIVEN** 用户收到验证邮件且 `emailVerified=false`
- **WHEN** 用户点击验证链接并完成验证回调
- **THEN** 系统将 `emailVerified` 更新为 `true`

### Requirement: 退出登录
系统 SHALL 支持已登录用户退出登录并销毁会话。

#### Scenario: 用户成功退出
- **GIVEN** 用户已登录
- **WHEN** 用户执行退出操作
- **THEN** 系统销毁会话并使用户处于未登录态
- **AND THEN** 系统将用户跳转到 `/`

### Requirement: Email/Password 注册（强制邮箱验证）
系统 SHALL 支持用户通过邮箱与密码提交注册，并触发邮箱验证流程；在邮箱验证完成之前用户不应处于已登录态。

#### Scenario: 用户提交注册后显示验证提示
- **GIVEN** 用户未登录
- **WHEN** 用户在 `/register` 提交 `email` 与 `password` 完成注册
- **THEN** 系统创建用户记录
- **AND THEN** 系统发送包含验证链接的邮件
- **AND THEN** 系统在 `/register` 展示 “Check your email” 提示
- **AND THEN** 系统不应创建可用会话（直到验证完成）

#### Scenario: 用户完成邮箱验证后进入工作区
- **GIVEN** 用户已完成注册且 `emailVerified=false`
- **WHEN** 用户点击验证链接并完成验证回调
- **THEN** 系统将 `emailVerified` 更新为 `true`
- **AND THEN** 系统创建会话并使用户处于已登录态
- **AND THEN** 系统将用户跳转到 `/workspace`

### Requirement: 登录成功后进入工作区（Email/Password）
系统 SHALL 在用户通过邮箱与密码登录成功后，将其跳转到 `/workspace`。

#### Scenario: 用户成功登录后跳转到 `/workspace`
- **GIVEN** 用户未登录且已存在账号且 `emailVerified=true`
- **WHEN** 用户在 `/login` 提交正确的 `email` 与 `password`
- **THEN** 系统创建会话并使用户处于已登录态
- **AND THEN** 系统将用户跳转到 `/workspace`

### Requirement: 登录成功后进入工作区（Google OAuth）
系统 SHALL 在用户通过 Google OAuth 登录成功后，将其跳转到 `/workspace`。

#### Scenario: 用户通过 Google 登录成功后跳转到 `/workspace`
- **GIVEN** 用户未登录
- **WHEN** 用户在 `/login` 选择 Google 登录并完成授权
- **THEN** 系统创建会话并使用户处于已登录态
- **AND THEN** 系统将用户跳转到 `/workspace`

### Requirement: 已登录用户访问认证页重定向到工作区
系统 SHALL 在用户已登录时阻止其访问认证页面，并将其重定向到 `/workspace`。

#### Scenario: 已登录用户访问 `/login` 时被重定向
- **GIVEN** 用户已登录
- **WHEN** 用户访问 `/login`
- **THEN** 系统将用户重定向到 `/workspace`

#### Scenario: 已登录用户访问 `/register` 时被重定向
- **GIVEN** 用户已登录
- **WHEN** 用户访问 `/register`
- **THEN** 系统将用户重定向到 `/workspace`

