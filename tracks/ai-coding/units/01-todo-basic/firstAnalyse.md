任务：静态Todo列表页

Step 1：读需求（快速确认）
分类	内容
必须做
/todos 路由、nav 链接、TodosView.vue、TodoList.vue、3 条静态数据、标题+完成状态
不做
增删改、Pinia、接口、精致样式
文件
新建 TodosView.vue、TodoList.vue；改 router/index.js、App.vue

Step 2：拆任务
任务	内容	验收
任务 1
路由 + 页面骨架 + nav
访问 /todos 看到标题「我的待办」
任务 2
TodoList.vue 静态列表
组件内 3 条数据，显示标题和状态
任务 3
在 TodosView 引入 TodoList
页面完整展示列表
任务 4
全量验收
5 项必查清单通过



练习	在练习 1 基础上增加
练习 2
添加 / 删除 todo
练习 3
Pinia + 筛选（全部/已完成/未完成）
练习 4
登录 Mock + 路由守卫
练习 5
localStorage 持久化
练习 6
完整需求文档，限时独立完成
