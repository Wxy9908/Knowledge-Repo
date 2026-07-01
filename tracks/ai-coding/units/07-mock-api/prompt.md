## 背景

Vue 3 + Vite + Vue Router, Composition API + script setup。
进行Mock API相关操作

## 需求

- 新建`todosApi.js`,语义化 path 常量（如 `GET /todos`、`POST /todos`）；封装 5 个异步方法；内部读写 `app-todos`
- 新建`request.js`,薄封装 `mockRequest(fn)`：随机延迟 300～800ms → 可选失败 → 执行 fn；**不做真 fetch/get/post 网络请求**
- 数据迁移，将 store 内 `loadTodosFromStorage`、`saveTodosToStorage`、`INITIAL_TODOS`、校验、`getNextId` **迁入 api 层**
- 修改store文件，`todos` 初始 `[]`；新增 `loading`、`error`、`initialized`；action 改 async/await，**API 成功后再更新 `todos`**
- 将原同步 action 改为 async，并统一管理 loading、error
- 刚进入todoList.vue页面时，挂载 `await fetchTodos()`
- 为异步操作建立Loading页面展示逻辑，`loading===true`时禁用相关按钮
- 为异步操作错误处理逻辑，可读错误文案 + 重试按钮，重试需要`fetchTodos()` 整表 


## 数据边界

- 保留：`{ id, title, done }` 不变
- 新建：非法 / 空 localStorage，api 层回退 `INITIAL_TODOS`，error文案：操作失败，请重试
- store 增加 `initialized`；仅 `initialized === true` 后展示列表/空状态
- 首屏：`!initialized && loading` 时显示「加载中…」

## 相关文件

- 新建：`src/api/request.js`，`src/api/todosApi.js`
- 修改：`src/stores/todos.js`，`src/components/TodoList.vue`
- 保留：`src/views/TodosView.vue`

## 保留

增删 toggle 编辑 筛选 空状态 清除已完成 刷新后仍在
不改 `user` 登录 Mock、不改路由守卫，不持久化 `filter`，不做真后端、不做 Vite mock server

## 范围与限制

- 使用 script setup;使用pinia；不引入新依赖
- 代码开发时补充必要注释信息
- 提供 `SIMULATE_ERROR`（默认 false）；为 true 时 mockRequest 抛错，用于演示错误路径


## 验收逻辑

- pnpm dev 能启动
- 控制台无报错
- 添加 / 删除 / toggle / 编辑 / 清除 — 有 loading 反馈，成功后 UI 正确
- 模拟失败 — 见错误 + 重试可恢复
- 筛选、空状态、守卫、退出登录仍正常
- 进入 `/todos` 先见 loading，再出列表或空状态
