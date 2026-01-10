# OMI AI (Oh-My-Interior) — v0.0.1 (MVP)

OMI AI 是一个面向室内设计师的 **“对话即生产”** 工作台：通过语义化对话 + 画布坐标点引导（Point-to-Edit）来实现更可控的无蒙版编辑体验，并配套按 Token 计费的 Credits 商业底座。

> 说明：当前仓库基于 T3 Stack（Next.js + NextAuth + tRPC + Prisma）脚手架搭建，功能会按 PRD 逐步落地。

## 目标（MVP）
- **交互闭环验证**：对话 + 坐标点引导，替代传统蒙版涂抹的学习成本。
- **商业底座落地**：基于 Token 的弹性计费，公式 `Credits = (Base * (1+Y%)) + X`，并具备 Min/Max 阈值保护。
- **效能验证**：支持 1K 预览快速迭代，并规划 4K 生产结果导出。

## 功能范围（按 PRD）
- **账号体系**：邮箱注册/登录（NextAuth），新用户初始化 50 Credits（规划）。
- **对话式渲染**：支持 `Text + Image` 初始生图；会话维护 `thought_signature`（规划）。
- **Point-Guided 编辑**：点击画布获取 `(x, y)`，结合指令触发局部重绘（规划）。
- **多参考图混合**：最多 14 张参考图，支持权重/风格迁移/物件替换（规划）。
- **Thinking Process 展示**：前端实时展示 `Thought Parts`（规划）。
- **计费一致性**：成功回调后扣费；失败/拦截 100% 退款（设计约束）。
- **合规**：生成图片需包含 SynthID 水印（设计约束）。

## 技术栈
- **Web**：Next.js (App Router) + React + TypeScript
- **UI**：Tailwind CSS + Prettier（含 Tailwind class 排序插件）
- **API**：tRPC v11 + TanStack React Query
- **Auth**：NextAuth v5 + Prisma Adapter
- **DB**：PostgreSQL + Prisma（生成客户端输出到 `generated/prisma/`）

## 快速开始（本地开发）
1) 准备环境变量：复制并填写 `.env`（参考 `.env.example`，并同步 `src/env.js` 的 schema）。
2) 启动本地数据库（需要 Docker 或 Podman）：
   - `./start-database.sh`
3) 安装依赖并初始化 Prisma：
   - `npm install`
   - `npm run db:push`（或按需要使用 `npm run db:generate` / `npm run db:migrate`）
4) 启动开发服务：
   - `npm run dev`

## 常用命令
- `npm run check`：`next lint` + `tsc --noEmit`
- `npm run lint` / `npm run lint:fix`：代码检查 / 自动修复
- `npm run format:check` / `npm run format:write`：格式校验 / 格式化
- `npm run db:studio`：打开 Prisma Studio
- `npm run build` / `npm run start` / `npm run preview`：构建与本地运行

## 目录结构（核心）
- `src/app/`：页面与路由（含 `src/app/api/`）
- `src/app/_components/`：UI 组件
- `src/server/`：服务端代码（NextAuth、Prisma、tRPC routers）
- `src/trpc/`：tRPC/React Query 客户端与服务端工具
- `prisma/schema.prisma`：数据模型与生成配置

## Credits 计费模型（设计说明 / WIP）
- 计费公式：`Credits = (Base_Token_Cost * (1 + Y%)) + X`；1K 图片基数按 `1290 tokens/张` 计算（PRD 假设）。
- 状态机：`PENDING` 预扣 → 任务成功按实际 `totalTokens` 结算（`SUCCESS`）→ 失败/超时/安全拦截全额返还（`FAIL`）。
- 流水账单：按任务维度记录时间、任务 ID、消耗明细（规划）。

## 贡献与 PR 约定
请先阅读 `AGENTS.md`（仓库贡献者指南）。建议遵循：
- Conventional Commits（如 `feat: ...` / `fix(auth): ...`）
- PR 描述包含：变更动机、影响范围、UI 截图（如适用）、迁移说明（如涉及 Prisma）
- 严禁提交 `.env` 与任何密钥；新增环境变量需更新 `.env.example` 与 `src/env.js`
