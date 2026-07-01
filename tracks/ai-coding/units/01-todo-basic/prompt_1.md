## 背景
Vue 3 + Vite + Vue Router，Composition API + script setup。
参考 HomeView.vue 的写法。

## 当前相关文件
- src/router/index.js
- src/App.vue
- src/views/HomeView.vue

## 需求（任务 1 - 仅骨架）
- 新增路由 /todos，对应 TodosView.vue
- TodosView 页面只显示标题「我的待办」
- 在 App.vue 的 nav 增加 Todos 链接

## 约束
- 使用 script setup
- 不引入新依赖
- 只新增：src/views/TodosView.vue
- 只修改：src/router/index.js、src/App.vue
- 禁止改动：main.js、package.json、其他 views/components

## 本次只做
路由 + 空页面骨架 + 导航链接。不要创建 TodoList，不要静态数据。

## 验收标准
- pnpm dev 能启动
- 点击 Todos 或访问 /todos 能看到「我的待办」
- 控制台无报错
