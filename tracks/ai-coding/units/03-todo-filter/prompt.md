## 背景

Vue 3 + Vite + Vue Router, Composition API + script setup。

## 需求

- 新增切换完成状态按钮，放在删除左边（同时新增配套样式，参考删除按钮）
- 将 Todo的操作和列表数据从TodoList迁入Pinia
- 新增状态筛选tab，放在添加按钮上面，与标题在同一水平线

## 当前相关文件

- `src/components/TodoList.vue`（必改）
- `src/stores/todos.js`（新建）
- `src/stores/counter.js`（风格参考，只读）

## 保留

将 TodoList.vue 里现有增删与列表逻辑原样迁入 Pinia，除本 Prompt 写明的新能力外，不改动已有交互与边界。

## 约束和范围

- 使用 script setup;不引入新依赖
- 复用 components.css / base.css，禁止 inline style、硬编码色值


- 样式禁止硬编码，新增按钮样式参考原有仓库的base.css、components.css
- 使用pinia
- 修改TodoList.vue文件
- 新建todos.js文件

## 数据边界

todos 数据列表：[{ id, title, done }]
filter 筛选字段 all\done\active
filteredTodos 采用计算属性

## 验收标准

- pnpm dev 能启动
- 控制台无报错
- 新增完成操作使用无异常
- 数据迁入pinia后展示无异常
- 筛选逻辑无异常
