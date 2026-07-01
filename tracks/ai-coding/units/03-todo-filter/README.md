# 练习 3 · Pinia 管理 Todo + 筛选

> 在练习 2 基础上，把列表状态迁到 Pinia，并支持按完成状态筛选。  
> 建议 Prompt 数：**1 个**（预计 25～40 分钟）

---

## 需求文档 v1.1

**1. 概述**  
将 Todo 的增删、**切换完成状态**与列表数据从 `TodoList.vue` 内的 `ref` 迁到 **Pinia store**；在列表上方增加 **筛选**（全部 / 已完成 / 未完成），列表只展示当前筛选结果。

**2. 保留行为（与练习 2 一致）**  
- 输入框 +「添加」：非空标题 → 新条 `done: false`，**置顶**（`unshift`）  
- 每条右侧「删除」：从 store 移除  
- **标题为空不添加**（静默忽略）  
- `id` 自增不重复（沿用现有 `getNextId` 思路）  
- **无持久化**：刷新恢复初始 3 条

**3. 切换完成状态（`done`）**  
- 每条 todo 支持 **切换 `done`**（按钮或 checkbox，实现自定；Prompt 可约定具体交互）  
- 切换后右侧 **状态标签** 同步更新（`status-tag`：已完成 / 未完成）  
- 操作针对 store 中的真实数据；在某一筛选下切换后，若不再符合当前筛选，**该项应从当前列表消失**（例如在「未完成」下标记完成 → 立刻不再显示）

**4. Pinia Store**  
- 新建 `src/stores/todos.js`（或 `todos.ts`，与项目一致即可）  
- 使用 **Setup Store** 风格（与现有 `counter.js` 一致：`defineStore` + `ref` / `computed`）  
- 建议职责划分：

| 内容 | 说明 |
|------|------|
| `todos` | 完整列表，`{ id, title, done }[]` |
| `filter` | 当前筛选：`'all'` \| `'done'` \| `'active'`（命名可自定，语义固定即可） |
| `filteredTodos` | `computed`：按 `filter` 返回子集 |
| `addTodo` / `removeTodo` | 对应原 `handleAdd` / `handleDelete` 逻辑 |
| `toggleTodo` | 按 `id` 切换对应项的 `done` |
| `setFilter` | 切换筛选（可选，也可在组件里直接改 `filter`） |

- 初始数据与练习 2 相同 3 条（可放在 store 内或抽常量，实现自定）

**5. 筛选 UI**  
- 列表**上方**提供三个可切换项：**全部** / **已完成** / **未完成**  
- 当前选中项需有可见区分（用现有 `.btn` 变体或文字样式均可，**禁止硬编码色值**，用 `var(--*)` 或 `components.css`）  
- 切换筛选后，下方列表立即只显示对应条目  
- 添加、删除针对**完整列表**操作；切换筛选后，新加条目应符合当前筛选规则（例如「未完成」下添加 → 应出现在列表中）

**6. 组件改动**  
- `TodoList.vue`：改为消费 Pinia（`storeToRefs` 等），`v-for` 绑定 **筛选后的列表**  
- `TodosView.vue`：若无必要可不改  
- `main.js`：项目已 `app.use(createPinia())`，**一般无需再改**

**7. 技术要求**  
- 字段统一：`{ id, title, done }`  
- 复用 `src/assets/components.css`（`.btn`、`.input`、`.status-tag`）  
- Composition API + `<script setup>`  
- **不引入新依赖**（Pinia 已安装）

**8. 不在范围**  
- localStorage、接口、登录守卫  
- 编辑标题、确认弹窗、精致动效

---

## Step 1 需求分析（教练）

| 分类 | 内容 |
|------|------|
| **必须做** | Pinia store、增删迁入 store、切换 `done`、三档筛选、`filteredTodos` computed |
| **不做** | 持久化、Pinia 以外的状态方案 |
| **文件（白名单预估）** | `src/stores/todos.js`（新建）、`src/components/TodoList.vue` |
| **不明确（实现可自定）** | 筛选控件用 button 组还是 tab；`filter` 枚举命名；空筛选结果是否显示「暂无」文案（可选，不强制） |

---

## Step 2 任务拆分（建议）

| 方式 | 说明 |
|------|------|
| **推荐：1 个 Prompt** | Store + 切换 done + 筛选 + 组件接线一次完成，`/todos` 一次验收 |
| 备选：2 步 | 先迁 Pinia 保持「全部」视图，再加筛选（仅当单 Prompt 经常漏筛选时） |

---

## 你的任务（Step 3）

在本单元目录新建 **`prompt.md`**（可参考练习 2 结构，**20～35 行**）。

**Prompt 必须引用**（见 `STATUS.md` · 有效约束）：

- 数据结构 `{ id, title, done }`  
- 复用 `components.css`，禁止硬编码色值  
- 无持久化、刷新恢复 3 条  
- 文件白名单写清  

写完后 → **Prompt 审阅 Agent** 点评 → 你定稿 → `prompt_status: 已定稿` → **实现 Agent**。

---

## 验收清单

```
□ pnpm dev 启动，/todos 无控制台报错
□ 初始 3 条正常显示；「全部」可见 3 条
□ 点「已完成」→ 只显示 done: true 的项（初始应为 1 条）
□ 点「未完成」→ 只显示 done: false 的项
□ 切换某条的完成状态 → `done` 与状态标签更新；在「未完成」下标为完成 → 该项从当前列表消失
□ 在「已完成」下改回未完成 → 该项从当前列表消失；切到「未完成」可见
□ 在「未完成」下添加一条 → 列表出现新条；切到「已完成」不应出现该条
□ 删除任意可见项 → 从 store 移除；切筛选后数据一致
□ 刷新页面 → 恢复初始 3 条（无 localStorage）
□ 增删逻辑在 Pinia，TodoList 无本地 todos ref（可有 newTitle 等 UI 局部 state）
□ 样式使用全局 class / CSS 变量，无硬编码 hex
```

---

## 面试官自答（预习）

1. **为什么从组件 ref 迁到 Pinia？** — 多组件共享、筛选与列表同源、为后续持久化/登录铺路。  
2. **`filteredTodos` 放 store 还是组件？** — 放 store 便于复用与测试；仅 UI 专用可放组件 computed。  
3. **筛选变更是不是 mutation？** — `filter` 是 UI 状态，用 `ref` + 改值即可，不必过度模仿 Vuex mutation 仪式。
