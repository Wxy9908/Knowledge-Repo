## 本次只做

重构 App.vue 为通用布局：顶部 nav + RouterView

- 移除 logo、HelloWorld 等脚手架默认内容
- nav 保留 Home / Todos / About
- 不要改 TodoList、TodosView（任务 2 再做）

## 验收标准

- 任意路由下只有 nav + 当前页面内容
- /todos 页不再出现 logo 和 "You did it!"
- 控制台无报错
