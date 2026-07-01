## 背景

Vue 3 + Vite + Vue Router, Composition API + script setup。
根据产品需求进行项目优化

## 需求

- 修改`completeTodo`为切换逻辑，未完成显示「完成」，已完成显示「回退」；按钮颜色区分（回退与未完成状态颜色保存一致）
- 新增`标题编辑逻辑`，标题右侧铅笔图标 → 行内可输入；再次点击铅笔保存；校验与新增一致（共用一套逻辑）；**仅鼠标操作，不支持 Esc / Enter**
- 抽离`addTodo`相关校验逻辑，新增\编辑代办使用一套校验逻辑
- 对 `todo-list` 做空状态包裹（类似 el-empty，不引依赖）；无数据时展示「暂无代办」+ 空图标

- 新增`一键清除`按钮，放在新增待办标题，添加按钮右侧，支持清除所有`已完成代办`，点击弹出二次确认弹窗`确定要一键清除已完成代办吗？`,二次确认后进行操作
- 新增登录用户名显示，展示在`退出登录`按钮左侧，内容为`{{ username }}，您好！`
- 对上述新增操作，要支持持久化兼容

## 数据边界

- 不变： `{ id: number, title: string, done: boolean }`
- 标题规则 | `trim()` 后非空才写入；空串不更新
- 以下操作后调用既有 persist：`addTodo`、`removeTodo`、切换完成、更新标题、清除已完成

## 相关文件

- 修改：`src/stores/todos.js`， `src/components/TodoList.vue`，`src/layout/AppHeader.vue`
- 不变：`src/views/TodosView.vue`、`src/stores/user.js`、`src/router/index.js`

## 保留

- 不改登录 Mock、不加真实接口
- 不持久化 `filter` / `user`
- 增删、三档筛选、app-todos 读写逻辑保持可用。

## 约束与范围

- 使用 script setup;使用pinia；不引入新依赖
- 代码开发时补充必要注释信息
- 复用 components.css / base.css，禁止 inline style、硬编码色值

- 同时仅一行处于编辑态；点另一行铅笔先取消当前编辑。（铅笔图标存在未编辑、已编辑两者状态）

## 验收标准

- pnpm dev 能启动
- 控制台无报错
- 状态切换无异常，筛选无异常
- 新增\修改操作无异常
- 筛选时，空状态展示无异常
- 刷新页面后，相关操作结果被保存
- 用户名展示正常
- 守卫、退出登录、重新登录后 Todo 仍在
