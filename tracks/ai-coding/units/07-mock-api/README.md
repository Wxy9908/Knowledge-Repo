# 练习 7 · Mock 接口层

> **Phase 3+ 加练** · 建议 **45～60 分钟** · 面试题见 [`REQUIREMENTS.md`](./REQUIREMENTS.md)  
> 建议 Prompt 数：**2 个** · 本文档为结构化拆解，供撰写 `prompt.md` 使用

---

## 需求摘要（一句话）

Todo 读写从 store 直连 localStorage，改为经 **Mock API**（Promise + 随机延迟）；store 改为 async action 并管理 **loading / error**；UI 增加加载反馈、错误提示与重试，刷新后数据仍正确。

---

## 必须做（P0）

| # | 需求 | 要点 |
|---|------|------|
| A1 | 新建 API 模块 | `src/api/todosApi.js` |
| A2 | 异步方法 | `fetchTodos`、`createTodo`、`updateTodo(id, patch)`、`deleteTodo`、`clearCompletedTodos` |
| A3 | 模拟延迟 | 随机 **300～800ms** |
| A4 | 持久化隔离 | API 内读写 `app-todos`；store **不再** `getItem/setItem` |
| A5 | async store | `loading`、`error`；action 全部 async |
| A6 | 初始化 | 挂载时 `await fetchTodos()` 拉列表 |
| A7 | Loading UI | 首屏 + 操作期间有可见反馈 |
| A8 | 错误 + 重试 | 可读错误文案 + 重试按钮（非仅 toast） |
| A9 | 功能不退化 | 增删 toggle 编辑 筛选 空状态 清除已完成 刷新后仍在 |

---

## 可选（P1）

| # | 需求 | 要点 |
|---|------|------|
| B1 | 可配置失败 | `SIMULATE_ERROR = true` 或 URL `?fail=1` |
| B2 | 行级 loading | 仅禁用当前行按钮，非全页锁死 |

---

## 不做

- 不引入 axios / 新 npm 依赖（**Promise 模拟**，不建真 HTTP）
- 不改 `user` 登录 Mock、不改路由守卫
- 不持久化 `filter`
- 不做真后端、不做 Vite mock server

---

## 实现思路（已定稿 · 优化后）

### 第一步 — API + Store 基础

| 项 | 方案 |
|----|------|
| 目录 | 新建 `src/api/` |
| `todosApi.js` | 语义化 path 常量（如 `GET /todos`、`POST /todos`）；封装 5 个异步方法；内部读写 `app-todos` |
| `request.js` | 薄封装 `mockRequest(fn)`：随机延迟 300～800ms → 可选失败 → 执行 fn；**不做真 fetch/get/post 网络请求** |
| 数据迁移 | 将 store 内 `loadTodosFromStorage`、`saveTodosToStorage`、`INITIAL_TODOS`、校验、`getNextId` **迁入 api 层** |
| Store | `todos` 初始 `[]`；新增 `loading`、`error`、`initialized`；action 改 async/await，**API 成功后再更新 `todos`** |
| 映射关系 | `toggleTodo` → `updateTodo(id, { done })`；`updateTodoTitle` → `updateTodo(id, { title })` |

### 第二步 — Loading / Error UI

| 项 | 方案 |
|----|------|
| 初始化 | `TodoList` `onMounted` → `fetchTodos()`（**不改** `TodosView.vue`） |
| 首屏 | `!initialized && loading` 时显示「加载中…」；**避免**拉取前误显示空状态 |
| 操作 loading | `loading` 为 true 时禁用添加 / 完成 / 回退 / 删除 / 铅笔 / 清除按钮 |
| 错误展示 | 列表上方 **error 条**（文案 + 「重试」按钮）；可选轻量 toast 作补充 |
| 重试 | 点击重试 → 重新 `fetchTodos()` 整表 |
| 失败模拟 | `request.js` 或 `todosApi.js` 顶部 `SIMULATE_ERROR = false`，演示时改 `true` |

---

## 不明确（已确认假设 · 写进 Prompt）

| # | 留白项 | 选择 |
|---|--------|------|
| 1 | 错误重试 | 重试 = 重新 **`fetchTodos()`** 整表 |
| 2 | loading 粒度 | 单一布尔 **`loading`**（P0）；并发操作时简单够用 |
| 3 | 乐观更新 | **API 成功后再改 UI**；失败时 `todos` 不变 |
| 4 | init 调用点 | **`TodoList` `onMounted`**；不动 TodosView |
| 5 | 错误 UI | **error 条 + 重试** 为主；toast 可选、不替代重试 |
| 6 | 延迟 | 随机 `300 + Math.random() * 500` ms |
| 7 | 失败开关 | P0 用常量 **`SIMULATE_ERROR`**；P1 可加 `?fail=1` |

---

## 涉及文件

| 文件 | 操作 | 内容 |
|------|------|------|
| `src/api/request.js` | **新建** | `mockRequest`、延迟、失败模拟 |
| `src/api/todosApi.js` | **新建** | 5 个 API 方法 + localStorage 读写 + 校验 |
| `src/stores/todos.js` | **修改** | 移除 localStorage；async action；`loading` / `error` / `initialized` |
| `src/components/TodoList.vue` | **修改** | onMounted init；loading / error / retry UI；handler 改 async |
| `src/views/TodosView.vue` | 不改 | 仅容器 |
| 鉴权 / 路由 / AppHeader | 不改 | 保持练 6 行为 |

---

## 数据边界

| 项 | 约定 |
|----|------|
| 结构 | `{ id, title, done }` 不变 |
| 持久化 key | `app-todos`（**仅 api 层**读写） |
| filter | 仍内存，刷新回 `all` |
| user | 仍内存 |
| 标题规则 | store 或 api 内 `trim()` 后非空（与练 6 一致） |
| 非法 / 空 localStorage | api 层回退 `INITIAL_TODOS`（逻辑从 store 迁入） |
| error 文案 | 字符串，如「操作失败，请重试」 |

---

## 架构示意

```text
TodoList (onMounted → fetchTodos)
       ↓ dispatch async action
  stores/todos.js  (todos, loading, error, initialized)
       ↓ await
  api/todosApi.js  (CRUD + localStorage)
       ↓ await
  api/request.js   (delay + SIMULATE_ERROR)
       ↓
  localStorage app-todos
```

---

## 建议 Prompt 拆步

### Step 1 — API + Store

**做什么：**

- 新建 `request.js`、`todosApi.js`（5 方法 + localStorage + 校验）
- store：`todos = []`；移除全部 `localStorage` 直接访问
- async：`fetchTodos`、`addTodo`、`removeTodo`、`toggleTodo`、`updateTodoTitle`、`clearCompletedTodos`
- 暴露 `loading`、`error`、`initialized`

**验收：**

- [ ] store 内无 `localStorage.getItem/setItem`
- [ ] 控制台手动调 action 有 300～800ms 延迟感
- [ ] `SIMULATE_ERROR = true` 时 action 抛错且 `todos` 不被改坏
- [ ] `SIMULATE_ERROR = false` 时增删改与练 6 行为一致，刷新数据仍在

### Step 2 — Loading / Error UI

**做什么：**

- `TodoList` `onMounted` → `fetchTodos()`
- 首屏 loading；`initialized` 后才显示列表或空状态
- 操作期间禁用相关按钮
- error 条 + 「重试」→ `fetchTodos()`
- 复用 CSS 变量，不引新依赖

**验收：**

- [ ] 进入 `/todos` 先见 loading，再出列表或空状态
- [ ] 添加 / 删除 / toggle / 编辑 / 清除 — 有 loading 反馈，成功后 UI 正确
- [ ] 模拟失败 — 见错误 + 重试可恢复
- [ ] 筛选、空状态、守卫、退出登录仍正常

---

## 验收清单

```
□ pnpm dev 能启动
□ 登录后进 /todos — 先 loading，再列表或空状态
□ 添加 / 删除 / toggle / 编辑 / 清除已完成 — 有延迟，成功后 UI 与持久化正确
□ 刷新页面 — 经 API 拉取，数据与练 6 一致
□ SIMULATE_ERROR 开启 — 见错误提示，点重试可 fetchTodos 恢复
□ 筛选、空状态、登录守卫仍正常
□ store 不再直接碰 localStorage
□ API 失败时 todos 列表不被改坏
□ 控制台无 blocker
□ （P1）?fail=1 或行级 loading
```

---

## 与现有代码衔接

| 现有 | 衔接方式 |
|------|----------|
| `todos = ref(loadTodosFromStorage())` | 改为 `ref([])` + `onMounted` 调 `fetchTodos()` |
| `persistTodos()` 在每次 mutation 后 | 删除；改由 api 写 localStorage |
| 同步 `addTodo` / `toggleTodo` 等 | 改 async；组件 `await` + 根据 `loading` 禁用按钮 |
| `filteredTodos` computed | 不变；空状态加 `initialized` 条件 |
| 练 6 编辑 / 清除 / 空状态 UI | 保留；仅接 async store |

---

## 理解验收（完成后自答）

1. store 里**哪一行不再碰 localStorage**？→ 全部移除，仅 api 层读写  
2. API 失败时 `todos` 会不会被改坏？→ 成功后更新策略，失败不改  
3. delay 调到 3s — loading 是否仍合理？→ 首屏与按钮 disabled 应覆盖等待期  

---

*下一步：根据本文档撰写 `prompt.md`（及 `prompt2.md` 若拆步），定稿后交 Prompt 审阅 / 实现 Agent。*
