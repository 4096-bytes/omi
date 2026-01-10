# 项目概览（omi / OMI AI）

## 目的
OMI AI（Oh-My-Interior）是一个面向室内设计师的“对话即生产”工作台：通过语义化对话 + 画布坐标点引导（Point-to-Edit）实现更可控的无蒙版编辑体验，并配套按 Token 计费的 Credits 商业底座。

## 当前状态
- 仓库基于 T3 Stack 脚手架搭建（Next.js + NextAuth + tRPC + Prisma）。
- README 标注为 v0.0.1（MVP），多数功能处于规划/WIP。

## 技术栈
- Web：Next.js（App Router）+ React + TypeScript
- UI：Tailwind CSS + Prettier（含 Tailwind class 排序插件）
- API：tRPC v11 + TanStack React Query
- Auth：NextAuth v5（beta）+ Prisma Adapter
- DB：PostgreSQL + Prisma（生成客户端输出到 `generated/prisma/`）
- Env：`@t3-oss/env-nextjs` + Zod（`src/env.js`）

## 业务约束（设计说明 / WIP）
- Credits 计费：`Credits = (Base_Token_Cost * (1 + Y%)) + X`，并包含 Min/Max 阈值保护。
- 结算一致性：成功回调后扣费；失败/拦截全额退款。
- 合规：生成图片需包含 SynthID 水印（设计约束）。
