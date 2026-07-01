# 加练 1 · Mock 接口层（练习 7）

> **Phase 3+ 附加题** · 补「真实接口：慢 / 失败 / loading」缺口  
> 建议限时 **45～60 min** · 半独立（需求拆解 → Prompt → 实现）  
> **前置**：练 5 持久化、练 6 v1.1 已完成

---

## 需求摘要（一句话）

把 Todo 的读写从 store **直接操作 localStorage**，改为经 **Mock API 模块**（Promise + 人工延迟）；UI 增加 **loading / 错误 / 重试**，刷新后数据仍正确。

---

## 1. 背景

当前 `stores/todos.js` 同步读写 `app-todos`。产品要接真接口前，先做 **API 层隔离**：store 只调 `api/todosApi.js`，由 API 模块模拟网络（延迟、失败），内部仍可用 localStorage 当「假后端 DB」（不要求 Vite proxy / 真 HTTP）。

---

## 2. 必做（P0）

| #   | 需求                                                                                                                                                      |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | 新建 **`src/api/todosApi.js`**（路径可自定，Prompt 写明白名单）                                                                                           |
| A2  | API 导出异步方法（建议）：`fetchTodos()`、`createTodo(title)`、`updateTodo(id, patch)`、`deleteTodo(id)`、`clearCompletedTodos()` — 与现有 store 能力对应 |
| A3  | 每个 API **模拟延迟** 300～800ms（固定或随机，Prompt 里写死一种）                                                                                         |
| A4  | API 内部仍用 **`app-todos` localStorage** 作持久化（模拟服务端 DB）；store **不再直接** `getItem/setItem`                                                 |
| A5  | Store 改为 **async action**；增加 `loading`、`error`（或等价状态）                                                                                        |
| A6  | **TodosView 或 TodoList** 在挂载时 `await` 拉列表（初始化 hydration 走 API）                                                                              |
| A7  | **Loading UI**：首次加载、提交操作期间有可见反馈（文案或简单占位，禁止空白傻等）                                                                          |
| A8  | **错误 UI**：任一 API 失败时展示可读错误 + **重试**（重试范围：最后一次失败的操作或整页刷新列表，Prompt 里二选一写清）                                    |
| A9  | 现有功能 **不退化**：增删改 toggle、编辑、筛选、空状态、清除已完成、持久化刷新后仍在                                                                      |

## 具体实现

- 第一步 基础搭建
  新增api文件夹，新增todosApi.js文件，用于语义化path常量，里面模拟todoList里涉及到相关需要后端操作的接口路径
  api文件夹里新增utils.js文件，统一处理接口字段的传输，包括使用get、post方法，变量传入的位置等等信息的定义，作为统一收敛层，通过promise模拟接口的调用
  给api模拟延迟，采用random随机数，范围是300～800ms
  接口调用相关方法改成async/await格式

- 第二步 相关loading展示及处理
  页面展示，按钮操作等凡是涉及到异步接口的，都需要有对应的loading状态及异常处理办法
  需要模拟接口异常情况，返回错误信息用toast展示出来，提示用户操作失败

---

## 3. 可选（P1）

| #   | 需求                                                                                     |
| --- | ---------------------------------------------------------------------------------------- |
| B1  | Mock **可配置失败率**（如 URL `?fail=1` 或常量 `SIMULATE_ERROR = true`）便于演示错误路径 |
| B2  | 操作级 loading（仅禁用当前行按钮，而非全页 loading）                                     |

---

## 4. 不做

- 不引入 axios / 新 npm 依赖（用原生 `fetch` 或直接 Promise 模拟均可；**推荐 Promise 模拟**，不建真 HTTP）
- 不改 `user` 登录 Mock、不改路由守卫
- 不把 `filter` 持久化
- 不做真后端、不做 Vite mock server（除非你在 Prompt 里明确且能 60min 内完成）

---

## 5. 故意留白（写进 Prompt · 假设）

1. **错误重试**：重试最后一次操作 vs 重新 `fetchTodos()` 整表？
2. **并发**：loading 用全局一个 flag 还是 `loadingCount`？
3. **乐观更新**：等 API 成功再改 UI，还是失败回滚？（建议 P0：**成功后更新**）
4. **init 调用点**：`TodosView onMounted` vs store 内 `init()` 谁调？
5. **文件白名单**：是否允许动 `TodosView.vue`？

---

## 6. 架构示意（帮助理解，非强制实现名）

```text
TodoList / TodosView
       ↓ dispatch
  stores/todos.js  (loading, error, async actions)
       ↓ await
  api/todosApi.js  (delay + try/catch + localStorage 读写)
       ↓
  localStorage app-todos
```

---

## 7. 验收清单

```
□ 进入 /todos 先见 loading，再出列表（或空状态）
□ 添加 / 删除 / toggle / 编辑 / 清除已完成 — 均有延迟感，成功后 UI 与持久化正确
□ 刷新页面 — 列表与练 6 一致（仍从 app-todos 恢复，经 API 拉取）
□ 模拟失败时 — 见错误提示，点重试可恢复
□ 筛选、空状态、登录守卫仍正常
□ 控制台无 blocker；pnpm dev 可演示
```

---

## 8. 理解验收（完成后）

□ 指出 store 里**哪一行不再碰 localStorage**  
□ API 失败时 store 的 `todos` 会不会被改坏？  
□ 手改：把 delay 调到 3s — loading 是否仍合理

---

## 9. 你的流程

1. **需求拆解 Agent** → 结构化分析（可选存 `analysis.md`）
2. 写 **`prompt.md`**（建议 1～2 个 Prompt；可先 API+store，再 UI loading/error）
3. Prompt 审 → 定稿 → 实现 → 验收 → 说「练习 7 提交」

---

## 10. 面试官追问（预习）

1. 为什么要有 api 层，store 直接 fetch 不行吗？
2. 真接口替换时你只改哪几个文件？
3. 接口慢时除了 loading 还会做什么（防抖、取消请求）？
