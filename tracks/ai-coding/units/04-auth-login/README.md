# 练习 4 · Mock 登录 + 路由守卫

> **Phase 2 半独立** · 教练给骨架，**你**补分析 + 写 `prompt.md`  
> 建议 Prompt 数：**1 个** · 目标时长：**45 分钟内**（含 Prompt）

---

## 需求摘要（一句话）

未登录用户不能访问 `/todos`；提供 **Mock 登录页**，登录态用 **Pinia** 管理，用 **路由守卫** 拦截并跳转。

---

## 必须做（教练定范围）

1. **登录页** `/login`  
   - 至少：用户名输入 + 登录按钮（Mock：不请求真实接口）  
   - 非空用户名即可视为登录成功（或你在分析里写清规则）

2. **Pinia `user` store**（新建，Setup Store，风格参考 `todos.js` / `counter.js`）  
   - 存登录用户标识（字段名你在 Prompt **数据边界**里定）  
   - 提供 `login` / `logout`（或等价 action）  
   - 有 **`isLoggedIn`**（或等价 computed/getter）

3. **路由守卫**  
   - 访问 **`/todos`** 时：未登录 → 跳转 **`/login`**  
   - 已登录 → 正常进入  
   - 使用 `router.beforeEach`（或等价写法）

4. **登录成功行为**  
   - 登录成功后进入 **`/todos`**（或你在分析里写「跳回原目标页」）

5. **保留**  
   - 现有 Todo 功能（`todos` store、`TodoList`）**逻辑不改**，仅加鉴权

---

## 不做

- 真实接口、JWT、刷新 token  
- **localStorage 持久化登录**（刷新后登录态丢失 = 预期；持久化在练习 5）  
- 注册、找回密码、权限角色  
- 改 `package.json` / 新依赖

---

## 现有代码锚点（帮你少猜）

| 文件 | 现状 |
|------|------|
| `src/router/index.js` | 已有 `/`、`/todos`、`/about`，**无守卫** |
| `src/App.vue` | nav：Home · About · Todos |
| `src/stores/todos.js` | Todo 业务，与 user 分离 |
| `main.js` | 已 `app.use(createPinia())` |

---

## 你需要先回答（Step 1 · 写进分析或 Prompt）

1. **`user` store 字段**用什么？（例：`username: string`）空用户名能否登录？ 
[{userId: number，username:string, password：string }]

2. **哪些路由要保护**？仅 `/todos` 还是 Home/About 也保护？（建议：仅 `/todos`）  

仅todos

3. **已登录时访问 `/login`** 要不要重定向走？（建议：重定向到 `/todos`）
重定向到/todos

4. **nav 要不要**显示「退出」/ 用户名？（建议：要，否则无法测 logout）  

要，有退出按钮

5. **文件白名单**列哪些？（至少：`user.js`、`LoginView.vue`、`router/index.js`；nav 改不改 `App.vue` 你定）

---

## Step 2 任务拆分（参考，可合并成 1 Prompt）

| 步 | 内容 | 验收 |
|----|------|------|
| 1 | `user` store + LoginView | 点登录后 store 有用户、能跳 `/todos` |
| 2 | `beforeEach` + `meta.requiresAuth` | 未登录直进 `/todos` → `/login` |
| 3 | nav 退出（若做） | 退出后再进 `/todos` → 回登录页 |

---

## 验收清单（Prompt 里请精简改写）

```
□ 未登录直接访问 /todos → 跳转 /login
□ /login 输入非空用户名 → 登录成功 → 进入 /todos，Todo 功能正常
□ 已登录可正常使用增删筛选完成
□ 退出登录（若有）→ 再访问 /todos → 回 /login
□ 刷新页面 → 登录态丢失，/todos 需重新登录（无 localStorage）
□ 控制台无报错；样式用 components.css / CSS 变量
```

---

## 理解验收（功能 OK 后 · 练 4 承重墙）

□ 数据流：`login()` 改了 store 什么 → 守卫读什么 → 为什么能/不能进 `/todos`  
□ 守卫写在哪个文件、为什么要在 `router/index.js` 里 `useUserStore()`  
□ 手改实验：守卫里暂时 `return true` → 未登录也能进 `/todos`，再改回

---

## 你的任务（Phase 2 流程）

1. 在本目录新建 **`prompt.md`**（用你的顺序：需求 → 数据边界 → 文件 → 约束与范围 → 验收）  
2. 可选：先在本 README 下方或单独笔记写 **Step 1 分析**（5 个必答题）  
3. → **Prompt 审阅 Agent** → 定稿 → **实现 Agent**

---

## 面试官自答（预习）

1. 登录态为什么放 Pinia 而不是只放 `localStorage`？  
2. `beforeEach` 里 `return '/login'` 和 `next('/login')` 在 Vue Router 4 的区别？  
3. 若练 5 要「刷新仍登录」，你会改哪一层？
