# 练习 3 复盘 — Pinia + 筛选 + 完成

> 完成日期：2026-05-22  
> 关联 Prompt：[`prompt.md`](./prompt.md) · 需求：[`README.md`](./README.md)

---

## 交付情况

- [x] `src/stores/todos.js` — Setup Store（`todos` / `filter` / `filteredTodos`）
- [x] 增删迁入 Pinia（`addTodo` / `removeTodo`，置顶、空标题校验保留）
- [x] 筛选 tab：全部 / 已完成 / 未完成（`setFilter` + `filteredTodos`）
- [x] 「完成」按钮（删除左侧），`done` 与 `status-tag` 同步
- [x] `TodoList.vue` 用 `storeToRefs`，列表绑定 `filteredTodos`
- [x] 样式用 CSS 变量，无硬编码 hex；筛选与完成按钮 scoped 扩展
- [x] 无 localStorage，刷新恢复初始 3 条
- [x] 白名单内：`todos.js`（新建）+ `TodoList.vue`

**与 README v1.1 的差异（你已验收接受）**

- README 写了「双向切换 done」；定稿 Prompt / 实现为 **单向「完成」**（`completeTodo` 仅 `false → true`，已完成项不显示完成按钮）。功能闭环足够验证 Pinia + 筛选，下次若要 toggle 需在 Prompt 写清 `toggleTodo`。

---

## 做得好的

1. **Prompt 结构进化** — 需求 → 相关文件 → 数据边界 → 约束与范围；比「先列文件」更控 scope  
2. **1 个 Prompt 交付** — Pinia 迁移 + 筛选 + 完成，未过度拆步  
3. **约束落地** — 引用 `base.css` / `components.css`、禁止 inline style / 硬编码色值，实现遵守良好  
4. **Store 设计清晰** — 与 `counter.js` 同风格；`INITIAL_TODOS` 常量；筛选逻辑集中在 `computed`  
5. **UI 超 baseline** — 分段筛选条与标题同行、grid 对齐状态列，体验优于「三个 plain 按钮」  
6. **三 Agent 流水线跑通** — 教练需求 → 你写 Prompt → 审阅定稿 → 实现 → 验收，角色边界有效  

---

## 需要改进的

| 问题 | 下次做法 |
|------|----------|
| README 与 Prompt「完成 vs toggle」不一致 | 需求变更后同步改 README，或 Prompt 写「以 Prompt 为准」 |
| 验收标准偏笼统 | 加 2～3 条可观察句（如「未完成筛选项下点完成 → 行消失」） |
| 未写「无持久化、刷新 3 条」 | 有 store 后更该写，防 AI 顺手 localStorage |
| `completeTodo` 命名 vs `toggleTodo` | 单向用 `markComplete` / 双向用 `toggleTodo`，Prompt 数据边界里点名 |

---

## AI 跑偏记录

- **本次**：基本未跑偏；文件白名单与 Pinia 约束生效  
- **有效约束**：「新建 todos.js + 只改 TodoList」「filter 三态 + filteredTodos computed」

---

## Prompt 进化（可写入 AI coding.md § 个人约束清单）

- 代码生成 Prompt 推荐顺序：**背景 → 需求 → 数据边界 → 相关文件 → 约束与范围 → 验收**  
- 涉及 store 时，数据边界写清：**state 字段、computed 名、action 名**  
- 有 design system 后：**禁止 inline style / 硬编码色值** 写进约束（练习 3 已做到）

---

## 自评（1–5 分 · 教练参考）

| 维度 | 评分 | 说明 |
|------|------|------|
| 需求理解 | 5 | README + Prompt 对齐主路径；完成 vs toggle 小偏差已接受 |
| 任务拆分 | 5 | 1 Prompt，合适 |
| Prompt 质量 | 4.5 | 结构好；验收可再具体 |
| 验收意识 | 5 | 用户完成浏览器验收 |
| 实现质量 | 4.5 | Store/组件清晰；单向完成与 README 略异 |
| 整体效率 | 4.5 | 三 Agent 串行有价值，非冗余切换 |

**平均：4.8** — 可进入练习 4（Phase 2 半独立）

---

## 练习 2 → 3 成长对比

| 维度 | 练习 2 | 练习 3 |
|------|--------|--------|
| 状态 | 组件 `ref` | Pinia Setup Store |
| 新能力 | 增删 | 增删 + 筛选 + 完成 |
| Prompt | 背景→文件→需求 | **需求→文件→数据边界** |
| 约束 | 不用 Pinia | 用 Pinia + design tokens |
| Agent | 实现为主 | **教练 / 审 / 实现** 全流程 |

---

## 下一步：练习 4 预告

- **Mock 登录** + Pinia 存 `user` + **路由守卫**（未登录跳转）  
- Phase 2：**你主导 Prompt**，教练关键点纠正  
- 建议先开教练对话拿需求骨架，再自行写 `practice 4/prompt.md`
