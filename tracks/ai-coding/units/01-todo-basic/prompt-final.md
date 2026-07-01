# 练习 1 · 合并总 Prompt（学习用）

> **用途**：回顾练习 1 时，对照「分步 Prompt」与「合并 Prompt」的差异。  
> **场景**：若从头再做一遍练习 1，优先用下方 **§三 合并版**（1 个 Prompt，约 20 分钟）。  
> **分步记录**：`prompt_1.md` → `prompt_1.5.md` → `prompt_2.md`

---

## 一、原始需求文档

**需求 v1.0 — Todo 列表页（静态展示）**

1. **概述**  
   新增「我的待办」页面，展示待办列表（只读，不支持增删改）。

2. **路由**  
   - 路径：`/todos`  
   - 导航：顶部 nav 增加 Todos 链接（放在最后，顺序：Home | About | Todos）

3. **页面**  
   - 标题：「我的待办」  
   - 列表：至少 3 条静态数据  
   - 每条：标题 + 完成状态（true →「已完成」，false →「未完成」）

4. **布局**  
   - `App.vue` 作为通用壳：顶部 nav + `<RouterView />`  
   - 移除脚手架默认内容（logo、HelloWorld 等）

5. **技术要求**  
   - Vue 3 Composition API + `<script setup>`  
   - 页面：`src/views/TodosView.vue`  
   - 组件：`src/components/TodoList.vue`  
   - 不引入新依赖  

6. **不在范围**  
   - 添加 / 删除 / 编辑  
   - Pinia、接口请求  
   - 精致样式（基本可读即可，一条一行）

---

## 二、需求分析（Step 1 摘要）

| 分类 | 内容 |
|------|------|
| **必须做** | 通用 App 布局、/todos 路由、nav、TodosView、TodoList、3 条静态数据 |
| **不做** | 增删改、Pinia、接口、精致 UI |
| **涉及文件** | 新建 `TodosView.vue`、`TodoList.vue`；改 `App.vue`、`router/index.js` |

---

## 三、合并版 Prompt（推荐 · 一次完成）

> 从 **Vue 脚手架初始状态** 出发，复制下方整块发给 AI。

```markdown
## 背景
Vue 3 + Vite + Vue Router 项目，Composition API + script setup。
当前为脚手架默认结构（App.vue 含 logo、HelloWorld）。

## 需求
1. 重构 App.vue 为通用布局：顶部 nav + main + RouterView，移除 logo、HelloWorld
2. nav 链接顺序：Home | About | Todos（Todos 放最后，便于后续扩展）
3. nav 样式统一：所有项同色文字，当前页灰色块高亮，不要继承全局绿色链接样式
4. 新增路由 /todos → TodosView.vue，页面标题「我的待办」
5. 新建 src/components/TodoList.vue，组件内 3 条静态 todo
6. 在 TodosView 中引入 TodoList 展示列表

## 数据
- 字段：id(number), title(string), done(boolean)
- done 为 true 显示「已完成」，false 显示「未完成」
- 至少 3 条，含已完成和未完成

## 约束
- 使用 script setup，不引入新依赖
- 只新增：src/views/TodosView.vue、src/components/TodoList.vue
- 只修改：src/App.vue、src/router/index.js、src/assets/main.css（若需修复 nav 全局样式或脚手架双栏布局）
- 禁止改动：main.js、package.json、HomeView / About 等业务页面内容

## 验收标准
- pnpm dev 能启动，控制台无报错
- 任意页面仅 nav + 当前页内容，无 logo、"You did it!"
- 访问 /todos：见标题 + 3 条 todo，一条一行，有「已完成」/「未完成」
- 切换 Home / About / Todos，nav 高亮与样式一致
```

---

## 四、分步版 Prompt 索引（跟练用）

练习 1 实际走了 **3 步**（学边界控制），合并版等价于下面三步的结果。

| 步骤 | 文件 | 核心范围 | 验收 |
|------|------|----------|------|
| 任务 1 | `prompt_1.md` | 路由 + TodosView 骨架 + nav 链接 | /todos 见标题 |
| 任务 1.5 | `prompt_1.5.md` | 重构 App.vue 通用布局 | 无 logo、HelloWorld |
| 任务 2 | `prompt_2.md` | TodoList 组件 + TodosView 引入 | /todos 见完整列表 |

### 何时用分步 / 何时用合并

| 方式 | 适合 | Prompt 数 | 时间 |
|------|------|-----------|------|
| **分步** | Phase 1 跟练、学边界、AI 曾跑偏 | 2～3 | 40～60 min |
| **合并** | 熟练后重做、模拟面试简单题 | 1 | 15～25 min |

---

## 五、全量验收清单

```
□ pnpm dev 能启动（或热更新无报错）
□ 访问 /todos 见「我的待办」+ 3 条 todo
□ 每条有标题 + 「已完成」或「未完成」
□ 列表一条一行，基本可读
□ nav 顺序：Home | About | Todos
□ 切换菜单，样式与高亮一致
□ 控制台无报错
□ 未引入新依赖（package.json 未变）
```

---

## 六、学习要点（练习 1 沉淀）

1. **简单题一个 Prompt 够** — 合并版是练习 1 的最优效率形态。  
2. **分步的价值** — 理解「一个 Prompt 一件事」；App 布局与 Todo 功能应分开时就不合并。  
3. **有效约束三板斧** — 只新增 / 只修改 / 禁止改动。  
4. **数据边界** — 一行 `{ id, title, done }` 即可，不必写长文档。  
5. **验收小修** — nav 样式、布局问题可对话直接修，不必新建 prompt 文件。  
6. **Prompt 留存** — 本文件 + 复盘即可；分步草稿练完可归档或删除。

---

## 七、与分步 Prompt 的对照

| 合并版条目 | 来自哪一步 |
|------------|------------|
| 重构 App.vue | 任务 1.5 |
| /todos 路由 + TodosView 标题 | 任务 1 |
| TodoList + 引入 | 任务 2 |
| nav 顺序 Todos 最后 | 任务 1.5 验收修复 |
| nav 样式统一 | 验收修复（对话） |
| main.css 双栏布局 | 验收修复（可选写入合并版） |
