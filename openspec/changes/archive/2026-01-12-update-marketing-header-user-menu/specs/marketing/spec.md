# Marketing

## MODIFIED Requirements

### Requirement: 营销首页 Header（Auth 入口）
系统 SHALL 在营销首页（`/`）根据用户登录状态提供清晰可见的入口：

- 未登录态：`Sign in` 与 `Try Free`（注册）
- 已登录态：
  - Primary CTA：`Go to workspace`
  - 用户信息菜单：显示用户信息（优先 `name`，缺失则 fallback `email`），并提供 `Sign out` 操作

#### Scenario: 未登录用户从 Header 进入登录页
- **GIVEN** 用户访问 `/` 且处于未登录态
- **WHEN** 用户点击 Header 中的 `Sign in`
- **THEN** 系统将用户导航到 `/login`

#### Scenario: 未登录用户从 Header 进入注册页（Try Free）
- **GIVEN** 用户访问 `/` 且处于未登录态
- **WHEN** 用户点击 Header 中的 `Try Free`
- **THEN** 系统将用户导航到 `/register`

#### Scenario: 已登录用户从 Header 进入工作区
- **GIVEN** 用户访问 `/` 且处于已登录态
- **WHEN** 用户点击 Header 中的 `Go to workspace`
- **THEN** 系统将用户导航到 `/workspace`

#### Scenario: 已登录用户在 Header 执行登出
- **GIVEN** 用户访问 `/` 且处于已登录态
- **WHEN** 用户打开 Header 的用户信息菜单并点击 `Sign out`
- **THEN** 系统销毁会话并使用户处于未登录态
- **AND THEN** 系统将用户导航到 `/`
- **AND THEN** Header 显示未登录态入口（`Sign in` 与 `Try Free`）

