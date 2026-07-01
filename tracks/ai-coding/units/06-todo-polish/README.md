# 练习 6 · 待办 v1.1

> **Phase 3 模拟面试** · 限时 **60 分钟** · 面试题见 [`REQUIREMENTS.md`](./REQUIREMENTS.md)  
> 建议 Prompt 数：**2 个** · 本文档为结构化拆解，供撰写 `prompt.md` 使用

---

## 需求摘要（一句话）

在现有 Todo 应用上增量交付 **v1.1**：完成状态可切换、行内编辑标题、筛选为空时空状态提示，改动仍持久化到 `app-todos`。

---

## 必须做（P0）

| # | 功能 | 要点 |
|---|------|------|
| F1 | 切换完成状态 | `done` 可在 true/false 间切换 |
| F2 | 编辑标题 | 非空才保存，规则与新增一致 |
| F3 | 空状态 | 当前筛选下无条目时，列表区有可见提示 |
| F4 | 持久化兼容 | F1/F2 后写入 `app-todos`，刷新正确 |

---

## 可选（P1）

| # | 功能 | 要点 |
|---|------|------|
| O1 | 清除已完成 | 一键删除所有 `done: true` 项，需防误触 |
| O2 | Header 显示用户名 | 已登录时展示 `currentUser.username` |

---

## 不做

- 不改登录 Mock、不加真实接口
- 不持久化 `filter` / `user`
- 不新增 npm 依赖
- 不做拖拽排序、截止日期、标签

---

## 实现思路（已定稿）

| # | 方案 |
|---|------|
| F1 | 将 `completeTodo` 改为切换逻辑；未完成显示「完成」，已完成显示「回退」；按钮颜色区分 |
| F2 | 标题右侧铅笔图标 → 行内可输入；再次点击铅笔保存；校验与新增一致（共用一套逻辑）；**仅鼠标操作，不支持 Esc / Enter** |
| F3 | 对 `todo-list` 做空状态包裹（类似 el-empty，不引依赖）；无数据时展示「暂无代办」+ 空图标 |
| F4 | 新操作写在 `src/stores/todos.js`，mutation 后 `persistTodos()` |

---

## 不明确（已确认假设 · 写进 Prompt）

| # | 留白项 | 选择 |
|---|--------|------|
| 1 | F1 交互 | 保留按钮；未完成「完成」、已完成「回退」；颜色用 CSS 变量区分 |
| 2 | F2 交互 | 行内编辑 + 铅笔；再点铅笔保存；**无 Esc / Enter**；失焦不保存，须再点铅笔 |
| 3 | F3 范围 | 基于 **`filteredTodos.length === 0`** 判空；统一文案「暂无代办」 |
| 4 | 文件范围 | **仅改** `src/stores/todos.js`、`src/components/TodoList.vue` |
| 5 | Prompt 拆步 | **2 步**：Step1 store + F1；Step2 F2 + F3 UI |
| 6 | 校验复用 | store 内抽取 `trimAndValidateTitle`（或等价），`addTodo` 与 `updateTodoTitle` 共用 |
| 7 | 编辑并发 | 同时最多一行编辑；点另一行铅笔时先取消当前编辑 |

---

## 涉及文件

| 文件 | 操作 | 内容 |
|------|------|------|
| `src/stores/todos.js` | 修改 | `completeTodo` → `toggleTodoDone`；新增 `updateTodoTitle`；共用标题校验；persist |
| `src/components/TodoList.vue` | 修改 | F1 双态按钮；F2 铅笔 + 行内编辑；F3 空状态块 |
| `src/views/TodosView.vue` | 不改 | 仅容器 |
| 鉴权 / 路由 | 不改 | 保持现有行为 |

---

## 数据边界

| 项 | 约定 |
|----|------|
| 结构 | `{ id: number, title: string, done: boolean }` 不变 |
| 持久化 key | `app-todos` |
| 触发 persist | `toggleTodoDone`、`updateTodoTitle`、`addTodo`、`removeTodo` 后均调用 |
| filter | 仍内存，刷新回 `all` |
| user | 仍内存 |
| 标题规则 | `trim()` 后非空才写入；空串不更新 |

---

## 建议 Prompt 拆步

### Step 1 — Store：F1 + F4

**做什么：**

- `toggleTodoDone(id)`：`todo.done = !todo.done`，`persistTodos()`
- 移除单向完成逻辑
- 抽取标题校验 helper（供 Step 2）

**验收：**

- [ ] 未完成 →「完成」→ 已完成；再点「回退」→ 未完成
- [ ] 刷新后 `done` 正确
- [ ] 增删、筛选、守卫仍正常

### Step 2 — UI：F1 按钮 + F2 编辑 + F3 空状态

**做什么：**

- 已完成也显示操作按钮；完成/回退样式区分（CSS 变量）
- 铅笔 + 行内编辑 + `updateTodoTitle`；仅鼠标保存
- `filteredTodos.length === 0` → 空状态（文案 + 图标）
- 不引新依赖、不硬编码色值

**验收：**

- [ ] 改标题 → 刷新 → 标题仍在
- [ ] 「已完成」筛选且无项 → 见空状态
- [ ] 筛选下变空 → 空状态即时更新
- [ ] 控制台无 blocker；`pnpm dev` 可演示

---

## 验收清单

```
□ pnpm dev 能启动
□ 登录后进 /todos
□ F1：未完成 ↔ 已完成可切换
□ F2：编辑标题，空标题不保存
□ F2：刷新后新标题仍在（F4）
□ F3：筛选结果为空时列表区有可见提示（非空白）
□ F3：「未完成」下操作导致列表变空 → 空状态更新
□ 原有：新增、删除、三档筛选正常
□ 退出登录 / 守卫 / 重新登录后持久化数据仍在
□ 样式用 CSS 变量，无硬编码色值
□ （P1）O1 清除已完成 + 刷新一致
□ （P1）O2 Header 显示用户名
```

---

## 与现有代码衔接

| 现有 | 衔接方式 |
|------|----------|
| `completeTodo` 仅设 `done=true` | 改为 toggle；去掉 `v-if="!todo.done"` 限制 |
| `persistTodos` / `loadTodosFromStorage` | F1/F2 继续调用，不改 key 或结构 |
| `addTodo` 的 trim + 非空 | F2 共用同一校验 |
| `filteredTodos` computed | F3 判其 `length` |
| `btn--toggle` + status-tag | F1 复用 success 系；回退用 warning 或 mute 系变量 |

---

*下一步：根据本文档撰写 `prompt.md`（及 `prompt2.md` 若拆步），定稿后交 Prompt 审阅 / 实现 Agent。*
