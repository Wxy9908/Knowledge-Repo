## 背景
Vue 3 + Vite + Vue Router，Composition API + script setup。
参考 HomeView.vue 的写法。

## 当前相关文件
- src/views/TodosView.vue

## 需求
- 新增TodoList.vue 静态列表
- TodoList.vue 加入3条数据，显示标题和状态

## 约束
- 使用 script setup
- 不引入新依赖
- 只新增：src/components/TodoList.vue
- 禁止改动：main.js、package.json

## 本次只做

新增TodoList.vue 静态列表，需要页面及相关数据
在TodosView里面引入TodoList.vue

## 验收标准
- pnpm dev 能启动
- 控制台无报错
- TodoList.vue组件内有3条静态todo
- 每条显示标题 + ‘已完成’/'未完成'
- 在/todos页面展示，引入验收

## 数据边界
- 数据结构： {id：number， title： string， done： boolean}
done 为 true 显示 ‘已完成’ false 显示 ‘未完成’
