# 练习 2 复盘 — 添加 / 删除 Todo

> 完成日期：2026-05-21  
> 关联 Prompt：[`prompt.md`](./prompt.md)

---

## 交付情况

- [x] 输入框 + 添加按钮
- [x] 每条 todo 有删除按钮
- [x] 组件内 `ref` 管理状态（未用 Pinia）
- [x] 新 todo 默认 `done: false`
- [x] 空标题不添加
- [x] id 自增不重复
- [x] 新 todo 置顶（`unshift`）
- [x] UI 迭代：系统色、全局 `.btn` / `.input` / `.status-tag`
- [x] 只改 `TodoList.vue` + 全局样式资产（base.css、components.css）

---

## 做得好的

1. **Prompt 更精简** — 一个 Prompt 完成添加/删除，没有过度拆步
2. **数据边界有效** — `{ id, title, done }` + id 防重复，AI 一次生成正确
3. **约束清晰** — 「只改 TodoList.vue」「不用 Pinia」控住了范围
4. **验收驱动 UI** — 功能 OK 后通过对话迭代样式，并沉淀为 design system
5. **主动追问** — 约束 vs 本次只做、验收标准、UI 是否写进 Prompt，形成方法论

---

## 需要改进的

| 问题 | 下次做法 |
|------|----------|
| Prompt 未引用 design system | 功能 Prompt 加一句 UI 约束（引用 components.css） |
| 「刷新还是三条」表述易歧义 | 写清「无持久化，刷新恢复初始 3 条」 |
| 约束与「本次只做」可合并 | 简单题用「约束与范围」一段即可 |
| UI 迭代分多轮对话 | 可接受；熟练后用 [UI Pass 模板](../../notes/ai-coding-prompts.md#7-uiux-pass功能验收后--体验层) 一轮完成 |

---

## AI 跑偏记录

- **本次**：基本未跑偏，一次生成即满足功能验收
- **有效约束**：「只改动 TodoList.vue」「不使用 pinia」「输入为空时无法新增」

---

## Prompt 进化（写入 AI coding.md § 个人约束清单）

- 练习 2：功能 Prompt 聚焦逻辑；UI 走 UI Pass 或对话
- 有 design system 后，功能 Prompt 引用 `.btn` / `.input`，禁止硬编码色值
- UX 行为（空标题、置顶）写 Prompt；视觉细节引用规范

---

## 时间分配（回顾）

| 阶段 | 说明 |
|------|------|
| 读需求 + 写 Prompt | 含模板概念讨论，略长于纯编码 |
| 功能生成 + 验收 | 1 个 Prompt，效率高 |
| UI/UX 迭代 | 按钮色 → 系统色 → 输入框，多轮但沉淀为资产 |
| **总体** | 比练习 1 分步更贴近真实开发节奏 |

---

## 自评（1–5 分）

| 维度 | 评分 | 说明 |
|------|------|------|
| 需求理解 | 4 | 功能点清晰，刷新那条曾略歧义 |
| 任务拆分 | 5 | 1 Prompt 完成，粒度合适 |
| Prompt 质量 | 4 | 简洁有效，可加 UI 约束引用 |
| 验收意识 | 5 | 功能 + 体验 + 设计系统 |
| 整体效率 | 4 | 功能快，UI 迭代花时间但有价值 |

**平均：4.4** — 可进入练习 3

---

## 练习 1 → 2 成长对比

| 维度 | 练习 1 | 练习 2 |
|------|--------|--------|
| Prompt 数 | 3（跟练） | 1（功能） |
| 范围控制 | 从拆很细到合并 | 一开始就合并 |
| UI | 后期 App/nav 修复 | 功能后 UI Pass + 系统色 |
| 文档 | 分步 prompt | prompt + 方法论进 AI coding.md |

---

## 下一步：练习 3 预告

- **Pinia** 管理 todo 状态（从组件 ref 迁到 store）
- **筛选**：全部 / 已完成 / 未完成
- **建议**：1～2 个 Prompt；功能 Prompt 引用现有 `{ id, title, done }` 与 design system
