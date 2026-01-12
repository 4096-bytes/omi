# Auth

## ADDED Requirements

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