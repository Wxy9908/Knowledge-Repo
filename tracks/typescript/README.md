# 前端 TypeScript

目标：**读得懂 AI 生成的 TS、改得动类型报错、需要时写得出类型**。教材优先用本仓库 `vue-playground` 真实代码。

## 快速入口

| 文档 | 说明 |
|------|------|
| [学习路线](./roadmap.md) | 能力地图、三阶段、通关标准、每次 1h 流程 |
| [进度打勾](./STATUS.md) | 当前阶段、练习清单、报错修炼记录 |
| [轨道简介](./brief.md) | 一句话定位 |

> Dashboard：`pnpm dev` 后首页 → TypeScript 卡片 → 轨道详情 → 打开笔记。

## 怎么学

1. 打开 `roadmap.md` 今日主题 + 对应真实文件，**先自己读**
2. 标疑问；必要时问 AI「只解释，不改代码」
3. **动手**：注释 / 改类型 / 修报错 / 写小片段
4. 在 `STATUS.md` 打勾，记 3 条坑或口诀

核心方法：**读真实代码 → AI 解释疑问 → 你亲手改并跑通**。禁止只看不写。

## 笔记目录

- `notes/type-basics.md` — 基础速查（读时用）
- `notes/vue-ts-patterns.md` — Vue 里常见 TS 写法
- `notes/utility-types-cheatsheet.md` — 工具类型速查
- `notes/ai-ts-workflow.md` — 用 AI 学/审 TS 的 Prompt 模板

## 教材文件（playground）

| 文件 | 练什么 |
|------|--------|
| `src/types/catalog.ts` | interface / 嵌套类型 |
| `src/utils/renderMarkdown.ts` | 函数类型、纯逻辑 |
| `src/demos/echarts/composables/useAsyncContractChart.ts` | 泛型 composable |
| `src/components/dashboard/TrackCard.vue` | `import type`、`Record`、props |
| `src/types/todo.ts` + `demos/ai-coding/api/todosApi.ts` | API 层类型、类型守卫 |
