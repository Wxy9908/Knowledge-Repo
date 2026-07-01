## 背景

Vue 3 + Vite + Vue Router, Composition API + script setup。

## 需求

- 将`Todos`列表改动写入localStorage
- 刷新页面后，监听app-todos是否存在且能被正常解析，能则使用，反之使用INITIAL_TODOS

## 数据边界

- localStorage定义app-todos，存入todos数组
- key：`app-todos`
- value：`JSON.stringify(todos数组)`，每项 `{ id, title, done }`；**不存 filter**


## 相关文件

- 修改： `src/stores/todos.js` 
- 可能需要修改：`src/components/TodoList.vue`
- 不改 `src/stores/user.js` ，`filter`、路由守卫、TodoList等

## 约束与范围

- 使用 script setup;使用pinia；不引入新依赖
- 代码开发时补充必要注释信息
- 不做localStorage持久化登录

- app-todos解析失败时，console.warn提示

## 验收标准

- pnpm dev 能启动
- 控制台无报错
- pinia数据相关信息无异常
- 页面切换及相关展示逻辑无异常

- 在增 / 删 / 标记完成 后，localStorage 能与 store 同步，刷新后，数据改动能保持
- 筛选按钮没有被持久化
- localStorage清空后，展示逻辑恢复初始状态
- 刷新后仍需重新登录
