# Marketing

## ADDED Requirements

### Requirement: 营销首页 Header（Auth 入口）
系统 SHALL 在营销首页（`/`）根据用户登录状态提供清晰可见的入口：

- 未登录态：`Sign in` 与 `Try Free`（注册）
- 已登录态：`Go to workspace`

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

### Requirement: 营销首页不包含脚手架 Demo 内容
系统 SHALL 确保 `/` 不展示任何脚手架示例内容（例如 “Create T3 App”、tRPC 示例文案、以及 demo 外链），以避免用户误解与品牌噪声。

#### Scenario: 用户访问 `/` 时不应看到脚手架示例
- **GIVEN** 用户访问 `/`
- **WHEN** 页面完成渲染
- **THEN** 页面不应包含 “Create T3 App” 等脚手架示例文案或相关 demo 外链
