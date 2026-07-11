# 前端 TypeScript — 学习路线

> **用途**：规划学习、按次推进、复盘沉淀、追踪进度  
> **进度打勾**：[`STATUS.md`](./STATUS.md) · **简介**：[`brief.md`](./brief.md)

## 本文档包含

| 章节 | 内容 |
|------|------|
| [目标与标准](#目标与标准) | 读 / 懂 / 写 |
| [能力地图](#一能力地图) | 6 项能力及掌握标志 |
| [学习原则](#二学习原则) | 真实代码、错误驱动、分层 |
| [每次 1 小时](#三每次-1-小时怎么用) | 时间盒 |
| [三阶段](#四三阶段学习规划) | Phase 0–2 练习与通关 |
| [刻意不学](#五刻意不学) | 范围边界 |
| [通关标准](#六轨道通关标准) | 最终验收 |
| [进度](#七当前进度--下一步) | 你现在在哪 |

---

## 目标与标准

**最终目标**：在 AI 为主的前端开发里，你能**读懂**生成的 TypeScript、**修对**类型报错、需要自己做时**写得出**类型（或用类型边界约束 AI）。

| 能力 | 掌握标志 |
|------|----------|
| 读 | 打开 `.ts` / `<script setup lang="ts">`，能说出每个类型在约束什么 |
| 懂 | 看到报错能定位「缺字段 / 联合收窄失败 / 泛型参数不对」 |
| 写 | 能独立写 `interface`、API 响应类型、简单泛型函数、常用工具类型 |

**节奏**：每周 3–4 次 × 约 1 小时 → **约 3–4 周**（12–14 次课）  
**前置**：Vue 3 基础 + [`ai-coding`](../ai-coding/meta.yaml) 已完成

**核心方法**：每次练习固定三步 —— **读一段真实代码 → 让 AI 解释你标出的疑问 → 你亲手改/补类型并跑通**。禁止只看不写。

---

## 一、能力地图

| # | 能力 | 说明 | 掌握标志 |
|---|------|------|----------|
| 1 | 读对象类型 | `interface` / `type`、可选、只读、嵌套 | 能口述 `catalog.ts` 里每个 interface 的形状 |
| 2 | 联合与窄化 | 字面量联合、`if`/`in`、类型守卫、判别联合 | 能写出「这段为什么能收窄」 |
| 3 | 函数类型 | 参数、返回值、`void`/`never` 直觉 | 能标清 util 函数的入参/返回 |
| 4 | 泛型入门 | `<T>`、`extends`、在 composable 里出现的形态 | 能读懂 `UseAsyncContractChartConfig<T>` |
| 5 | Vue + TS | props / emit / ref / `import type` | 能给小组件补全 props 且编译通过 |
| 6 | 约束 AI | Prompt 写清类型边界；少用 `any`/`as` 糊弄 | 能写「只改类型 + 验收编译」的 Prompt |

---

## 二、学习原则

1. **以仓库代码为教材**，少开空 demo。优先读：

| 文件 | 练什么 |
|------|--------|
| [`playground/.../types/catalog.ts`](../../playground/vue-playground/src/types/catalog.ts) | interface / 嵌套 |
| [`playground/.../utils/renderMarkdown.ts`](../../playground/vue-playground/src/utils/renderMarkdown.ts) | 函数类型 |
| [`playground/.../useAsyncContractChart.ts`](../../playground/vue-playground/src/demos/echarts/composables/useAsyncContractChart.ts) | 泛型 composable |
| [`playground/.../TrackCard.vue`](../../playground/vue-playground/src/components/dashboard/TrackCard.vue) | `import type`、`Record`、props |
| [`playground/.../types/todo.ts`](../../playground/vue-playground/src/types/todo.ts) + [`todosApi.ts`](../../playground/vue-playground/src/demos/ai-coding/api/todosApi.ts) | API 类型、类型守卫 |

2. **错误驱动**：故意改坏类型 → 读报错 → 修好（比看文档快）。
3. **分层掌握**：先「能读」→「能改」→「能设计」；条件类型 / `infer` 只要求「能认」。
4. **与 AI Coding 衔接**：审 diff 时多问一句——「这个类型约束对不对、会不会骗过编译器？」

速查笔记：[`type-basics.md`](./notes/type-basics.md) · [`vue-ts-patterns.md`](./notes/vue-ts-patterns.md) · [`utility-types-cheatsheet.md`](./notes/utility-types-cheatsheet.md) · [`ai-ts-workflow.md`](./notes/ai-ts-workflow.md)

---

## 三、每次 1 小时怎么用

| 分钟 | 做什么 |
|------|--------|
| 0–10 | 打开今日主题 + 对应真实文件，先自己读 |
| 10–25 | 标疑问；必要时问 AI「只解释，不改代码」 |
| 25–50 | **动手**：注释 / 改类型 / 修报错 / 写小片段 |
| 50–60 | 记 3 条到笔记或 [`STATUS.md`](./STATUS.md)（坑、口诀、下次要练的） |

---

## 四、三阶段学习规划

```
Phase 0 读得懂 → Phase 1 改得动 → Phase 2 写得出 → 通关
```

### Phase 0 — 读得懂（第 1 周，3–4 次）

**目标**：看到常见语法不慌。

| 次 | 主题 | 练习 |
|----|------|------|
| 1 | `type` vs `interface`、对象类型、可选/只读 | 精读 `catalog.ts`，用自己的话注释每个 interface |
| 2 | 联合 / 字面量 / 窄化（`if`、`in`、判别联合） | 在笔记里写 5 个「这段代码为什么能收窄」 |
| 3 | 函数类型、返回值、`void`/`never` 直觉 | 精读 `renderMarkdown.ts`，标出每个函数的入参/返回 |
| 4 | `import type`、模块边界、`as` 何时危险 | 对比 `TrackNote.vue` 的 `as Catalog`：何时该改成更安全写法 |

**Phase 0 通关**：任选 playground 一个 `.ts` 文件，口头/笔记讲清「有哪些类型、约束了什么」。

---

### Phase 1 — 改得动（第 2 周，3–4 次）

**目标**：类型报错能自己修；能给现有 JS 味代码补类型。

| 次 | 主题 | 练习 |
|----|------|------|
| 5 | 数组 / `Record` / 索引签名 | 给一段 mock 数据补完整类型（可参考 echarts mock） |
| 6 | 泛型入门：`<T>`、约束 `extends` | 读懂 `UseAsyncContractChartConfig<T>`，改一个参数看报错变化 |
| 7 | Vue + TS：`props` / `emit` / `ref` / `computed` | 给一个小组件补全 props 类型 |
| 8 | 修 5 个真实/模拟报错 | 记录「报错原文 → 原因 → 修法」到 [`STATUS.md`](./STATUS.md) |

**Phase 1 通关**：不靠 AI 直接贴答案，能独立修掉 3 个中等类型错误。

---

### Phase 2 — 写得出（第 3–4 周，4–5 次）

**目标**：需要自己做时，能先定类型再写实现（或约束 AI）。

| 次 | 主题 | 练习 |
|----|------|------|
| 9 | 工具类型：`Partial` / `Pick` / `Omit` / `Required` / `ReturnType` | 对照 [cheatsheet](./notes/utility-types-cheatsheet.md)，各写 1 个业务例子 |
| 10 | API 层类型：请求 / 响应 / 错误联合 | 仿 `todosApi` 为假接口写完整类型 + 一个调用方 |
| 11 | 用类型约束 AI | 写一条「只改类型文件 + 验收编译通过」的 Prompt 并跑通（模板见 [ai-ts-workflow](./notes/ai-ts-workflow.md)） |
| 12 | 综合小作业 | **手写**一个小模块：`types/*.ts` + 一个 util + 一个 Vue 组件消费（主题自选） |
| 13（可选） | 认一认：条件类型 / `infer` / `satisfies` | 只要求「在 AI 代码里能认出」，不要求会写 |

---

## 五、刻意不学

- 不深挖 TS 编译器原理、装饰器实验特性
- 不把后端 Fastify 类型当主线（留给 [`fullstack-transition`](../fullstack-transition/meta.yaml)）
- 不追求「手写复杂条件类型」；能读、能换简单写法即可

---

## 六、轨道通关标准

1. 能解释 playground 中任选 **2 个** TS 文件的类型设计
2. 能独立写出一组 **API + 组件 props** 类型并编译通过
3. 能向「面试官」用 1 分钟说清：`interface` vs `type`、为何少用 `any`、`unknown` 怎么收窄

全部满足 → 在 [`STATUS.md`](./STATUS.md) 勾选轨道通关，并把 `meta.yaml` 的 `status` 改为 `completed`、更新 `mastery`。

---

## 七、当前进度 · 下一步

| 项 | 值 |
|----|-----|
| 状态 | 轨道已创建，**尚未开始练习** |
| 下一步 | 打开 [`STATUS.md`](./STATUS.md) → 做 **练习 1**：精读 `catalog.ts` |
| 配套 | 读时打开 [`notes/type-basics.md`](./notes/type-basics.md) |

---

*创建：2026-07-11*
