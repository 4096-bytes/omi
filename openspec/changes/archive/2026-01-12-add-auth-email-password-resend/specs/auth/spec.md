# Auth

## ADDED Requirements

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
