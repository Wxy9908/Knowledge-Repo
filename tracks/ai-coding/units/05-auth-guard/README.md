# 练习 5 · Todo localStorage 持久化

> **Phase 2 半独立** · 教练给骨架，**你**写 `prompt.md`  
> 建议 Prompt 数：**1 个** · 目标时长：**30～45 分钟**

---

## 需求摘要（一句话）

Todo 列表写入 **localStorage**，**刷新页面后**增删改的结果仍在；**登录态仍不持久化**（练 4 行为保持）。

---

## 必须做（教练定范围）

1. **持久化对象**：`todos` 数组（`{ id, title, done }[]`）
2. **触发时机**：增 / 删 / 标记完成 后，localStorage 与 store 同步
3. **初始化（hydration）**：store 创建时从 localStorage **读取**；无数据或非法数据时用 **初始 3 条** 兜底
4. **保留**：筛选 `filter`、登录 `user`、路由守卫、TodoList UI **逻辑不变**（除非 Persist 必须动 store 结构）

---

## 不做

- 登录态 localStorage（`user` store 仍内存，刷新需重新登录）
- 接口、IndexedDB、pinia 插件
- 改 `package.json` / 新依赖
- 持久化 `filter` tab 选中态（默认：**不持久化**，除非你在 Prompt 里明确要做）

---

## 现有代码锚点

| 文件                          | 现状                                                            |
| ----------------------------- | --------------------------------------------------------------- |
| `src/stores/todos.js`         | `INITIAL_TODOS` 3 条；`addTodo` / `removeTodo` / `completeTodo` |
| `src/stores/user.js`          | 内存登录，刷新丢失                                              |
| `src/components/TodoList.vue` | 消费 store，无需大改（若只改 store）                            |

---

## 你需要先回答（写进 Prompt · 数据边界）

1. **localStorage 的 key** 叫什么？（例：`todos` 或 `app-todos`）  
   app-todos
2. **存什么 JSON 结构**？建议只存 `todos` 数组，不存 `filter`
   todos字段
3. **localStorage 为空** → 用 `INITIAL_TODOS` 还是空数组？（建议：**初始 3 条**）
   INITIAL_TODOS，一进来有默认数据
4. **JSON 解析失败 / 数据格式不对** → 怎么处理？（建议：回退 `INITIAL_TODOS`，可选 `console.warn`）
   弹出console.warn然后用INITIAL_TODOS去填充数据
5. **保存方式**：每个 action 末尾手动 `save()`，还是 `watch(todos)` / `$subscribe` 自动存？（写进 Prompt 二选一）
   数据触发操作后并比对数据发生变化后 存入新的
6. **文件白名单**：是否只改 `todos.js`？要不要抽 `utils/storage.js`？（建议：小项目可全在 store）
   是

---

## 验收清单（Prompt 里请精简改写）

```
□ 登录后进 /todos，添加一条 → 刷新 → 新条仍在
□ 删除 / 完成 后刷新 → 状态保持
□ 筛选 tab 刷新后恢复默认「全部」（若你不持久化 filter）
□ 刷新后仍须重新登录（user 无 localStorage）
□ localStorage 被清空后首次进入 → 显示初始 3 条（或你 Prompt 写的兜底）
□ 控制台无报错；不改登录守卫行为
```

---

## 理解验收（练 5 承重墙）

□ **hydration**：打开页面时谁读 localStorage、何时写入 `todos` ref  
□ **保存链**：点「添加」→ store 变 → 哪一行代码写 localStorage  
□ **手改实验**：DevTools → Application → Local Storage 手动改 JSON → 刷新看列表是否变化

---

## 和练 4 的对比（写 Prompt 时可引用）

|       | 练 4                   | 练 5                      |
| ----- | ---------------------- | ------------------------- |
| user  | 内存                   | **仍内存**                |
| todos | 内存                   | **localStorage**          |
| 刷新  | 登录丢失；Todo 回 3 条 | 登录仍丢失；**Todo 保留** |

---

## 你的任务

1. 新建 **`prompt.md`**（需求 → 数据边界 → 文件 → 约束与范围 → 验收）
2. → Prompt 审阅 → 定稿 → 实现 Agent
3. 验收 + 理解验收 → 教练复盘

---

## 面试官自答（预习）

1. 为什么持久化放 store 里而不是组件？
2. `watch` 深度监听 todos 和每个 action 里 save，各有什么坑？
3. 若练 6 要「登录也持久化」，你会改哪几个文件？
