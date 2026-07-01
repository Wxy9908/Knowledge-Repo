## 背景

Vue 3 + Vite + Vue Router, Composition API + script setup。
步骤一已完成：user store、/login、App Header。本步只加路由守卫。

## 需求（步骤二）

- `/todos`增加meta.requiresAuth:true，`/home`、`/about`不拦截
- router.beforeEach:新增路由守卫，需要验证鉴权状态，未登录访问需健全路由->跳转/login
- 已登录访问 /login -> 重定向/todos
- 不改 user store 的login/logout 逻辑，不改todos

## 相关文档

- 修改：src/router/index.js
- 不改：src/stores/user.js、src/stores/todos.js等
- 参考文件： src/stores/todos.js，components.css

## 数据边界

- 守卫只读useUserStore().isLoggedIn
- 不在守卫里写 localStorage

## 约束与范围

- 使用 script setup;使用pinia；不引入新依赖
- 代码开发时补充必要注释信息
- 复用 components.css / base.css，禁止 inline style、硬编码色值

- 检测beforeEach、meta.requiresAuth、未登录拦截 /todos等是否完成
- 不做localStorage持久化登录

## 验收标准

- pnpm dev 能启动
- 控制台无报错
- pinia数据相关信息无异常
- 页面切换及相关展示逻辑无异常
- 未登录直接访问 /todos → /login
- 登录后进 /todos 正常
- 已登录访问 /login → /todos
- 退出后再访问 /todos → /login
- 刷新后未登录（无持久化）→ /todos 被拦
