# 练习 6 复盘 — 模拟面试 · 待办 v1.1

> 完成日期：2026-05-22 · **用时 35 min**（限时 60 min）  
> 需求：[`REQUIREMENTS.md`](./REQUIREMENTS.md) · Prompt：[`prompt.md`](./prompt.md)

---

## 交付情况

### P0（必做）— 全部通过

| # | 功能 | 状态 | 实现要点 |
|---|------|:----:|----------|
| F1 | 切换完成状态 | ✅ | `toggleTodo`；「完成」/「回退」+ 样式区分 |
| F2 | 编辑标题 | ✅ | 铅笔行内编辑；`validateTodoTitle` 共用；非空保存 |
| F3 | 空状态 | ✅ | `filteredTodos.length === 0` → 图标 +「暂无代办」 |
| F4 | 持久化兼容 | ✅ | toggle / update / clear 均 `persistTodos()` |

### P1（可选）— 全部完成

| # | 功能 | 状态 |
|---|------|:----:|
| O1 | 清除已完成 + 二次确认 | ✅ |
| O2 | Header 用户名 | ✅ `{{ username }}，您好！` |

### 回归

- [x] 增删、筛选、守卫、登录、`app-todos` 路径未破坏
- [x] `pnpm run build` 通过
- [x] 白名单：`todos.js` + `TodoList.vue` + `AppHeader.vue`

---

## 时间回顾

| 阶段 | 计划 | 实际 | 说明 |
|------|------|------|------|
| 总计 | 60 min | **35 min** | 显著优于 Phase 3 目标 |
| 推断 | 分析+Prompt+实现 | 一链完成 | 1 个 Prompt，增量清晰 |

---

## 需求处理

**做对的决策**

- 在 Prompt 里写清 F1/F2/F3 交互假设（按钮切换、铅笔、空状态绑 `filteredTodos`）
- `validateTodoTitle` 抽共用，避免 add/edit 两套校验
- P1 纳入同一 Prompt 但范围白名单明确

**模糊点如何处理**

- F1：按钮文案 + 颜色区分（与 REQUIREMENTS 实现思路一致）
- F2：仅鼠标、单行编辑态（Prompt 约束写清）
- F3：筛选结果为空即展示（不区分文案）

**小瑕疵（不挡验收）**

- 文案「代办」应为「待办」— 纯笔误
- 空标题编辑时静默失败，可加提示（可选）

---

## Prompt 复盘

**最有效的约束**

- 文件白名单三文件 + 保留段（不改 login/router/filter persist）
- 数据边界列出所有 persist 触发点

**可改进**

- 验收标准可再写 2 条「完成→回退」「清空 localStorage 后…」（你自测已过则可省略）

---

## 面试官追问（自答参考）

1. **为什么 toggle 放 store 不放在组件？** — 与增删同一数据源，持久化一处 `persistTodos()`，筛选列表自动联动。  
2. **接口慢怎么改？** — store action 内 async + loading；UI 乐观更新或 skeleton；Prompt 加错误态验收。  
3. **来不及做什么怎么取舍？** — 本次 P0 全做；若超时先 F1+F4，砍 O1/O2 和空状态动效。

---

## 教练评定

| 维度 | 评分 | 说明 |
|------|------|------|
| 时间管理 | 5 | 35/60 min，有余量 |
| P0 交付 | 5 | 四项齐全 |
| Prompt 质量 | 4.5 | 假设+边界清楚；验收略泛 |
| 范围控制 | 5 | 未乱改 router/user |
| 模拟合规 | 5 | 分步 Prompt，非整包 REQUIREMENTS |

**Phase 3 模拟结论：✅ 通过**（P0+P1 全交付，可演示）

**平均：4.9**

---

## 下一步

- 可选：**最终通关自评**（Phase 1–3 总回顾）  
- 真实面试：用同一流水线（需求拆解 → 短 Prompt → 实现 → 演示话术）
