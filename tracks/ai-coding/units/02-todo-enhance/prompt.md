## 背景

Vue 3 + Vite + Vue Router, Composition API + script setup。

## 当前相关文件

TodoList.vue

## 需求

- 新增输入框+ 添加按钮
- 每条数据新增删除按钮

## 约束

- 使用 script setup
- 不引入新依赖
- 不使用pinia
- 只改动TodoList.vue文件

## 本次只做

满足todo列表的添加/删除功能

## 验收标准

- pnpm dev 能启动
- 控制台无报错
- 新增todo默认done：false
- 输入为空时无法新增
- 无持久化，刷新恢复初始3条

## 数据边界

todos从静态数据变成ref数据，注意操作时候的id重复情况
