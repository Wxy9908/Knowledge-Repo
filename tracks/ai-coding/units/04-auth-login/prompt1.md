## 背景

Vue 3 + Vite + Vue Router, Composition API + script setup。

## 需求（步骤一）

- 新建LoginView.vue页面，路由保存在/login里，按照基础登录页的样式进行设计，需要支持“用户名”“密码”和“登录按钮”
- 新建`user`, pinia store：`login`/`logout`,`isLoggedIn`（可参考todo.js）;登录成功 -> `/todos`
- 新建`src/layout` 固定 header（sticky），右侧【退出登录】-> `logout()`并跳转/login
- 新建白名单，不展示layout header，将/login放进去（其他业务侧展示）

## 数据边界

- `user` store (setup store, 参考 todo.js)
  - `currentUser`:`{userId: number, username: string} | null`(未登录为null)
  - `isLoggedIn`: computed
  - `login()`:登录，本地Mock校验，通过后写入`currentUser`,不请求接口
  - `logout()`：退出登录,同时清除`currentUser`
- Mock 规则：用户名非空+密码长度>=6

## 相关文件

- 新建：`src/stores/user.js`, `src/views/LoginView.vue`, `src/layout/header`
- 修改：src/router/index.js,src/App.vue
- 保留不改： src/views/TodosView.vue，src/stores/todos.js
- 参考文件： src/stores/todos.js，components.css

## 保留

Todos相关 store 与 组件逻辑不改，仅加登录与 layout

## 约束及范围

- 使用 script setup;不引入新依赖
- 复用 components.css / base.css，禁止 inline style、硬编码色值
- 使用pinia
- login页面相关样式不用写在全局

- 不做localStorage持久化登录
- 本步不做beforeEach、meta.requiresAuth、未登录拦截 /todos

## 验收标准

- pnpm dev 能启动
- 控制台无报错
- 登录、退出登录等操作无异常
- 登录页、导航栏等展示无异常
- pinia数据相关信息无异常
- 对用户名密码进行基础校验，密码至少6位数，用户名非空
- layout的header是在app层级，不随着页面滚动而消失
- 区分是否展示 layout header的白名单
- 合法输入可登录并进入/todos
- 退出后回/login,store 已清空

## 验收问题

- 给原来Home页相关信息放在路由`/home`里（参考/about）
- 路由`/`应默认跳转到`/login`
