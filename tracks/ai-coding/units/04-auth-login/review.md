# 练习 4 复盘 — Mock 登录 + 路由守卫

> 完成日期：2026-05-22  
> 关联 Prompt：[`prompt1.md`](./prompt1.md) · [`prompt2.md`](./prompt2.md) · 骨架：[`README.md`](./README.md)

---

## 交付情况

### 步骤一（登录 + layout）

- [x] `stores/user.js` — `currentUser` / `isLoggedIn` / `login` / `logout`
- [x] Mock：用户名非空 + 密码 ≥6
- [x] `LoginView.vue` + `/login`；登录成功 → `/todos`
- [x] `AppHeader` sticky + 退出 → `/login`
- [x] `/login` 不展示 layout header（`App.vue` 白名单）
- [x] `/` → `/login`；Home → `/home`
- [x] Todo 逻辑未改；无 localStorage

### 步骤二（路由守卫）

- [x] `/todos` 设 `meta.requiresAuth: true`
- [x] `beforeEach`：未登录 → `/login`；已登录访问 `/login` → `/todos`
- [x] `/home`、`/about` 保持公开
- [x] 守卫只读 `isLoggedIn`，不改 user/todos 业务

### 理解验收

- [x] 注释 `beforeEach` 后未登录可进 `/todos` → 证明守卫是鉴权承重墙

---

## 做得好的

1. **自主拆两步 Prompt** — 先登录链路再守卫，debug 边界清晰  
2. **数据边界步骤一定好** — `currentUser` 结构、Mock 规则在 prompt1 写全  
3. **Phase 2 假设写法** — 路由权限不熟时，用「仅保护 /todos + 验收清单」推进  
4. **守卫实现干净** — meta + beforeEach + 注释，顺序合理  
5. **理解验收真的做了** — 注释守卫验证因果，不是只点功能

---

## 需要改进的

| 问题 | 下次做法 |
|------|----------|
| prompt2 初稿验收偏泛 | 步骤二也写 5 条「操作 → 结果」 |
| 「健全」等笔误 | 定稿前通读一遍 |
| 路由权限逻辑不熟 | Prompt 里固定写「不明确（假设）」段；验收清单从 README 抄 |

---

## AI 跑偏记录

- **步骤一/二**：基本未跑偏；白名单与「本步不做守卫」分步约束有效  
- **有效约束**：「只改 router」「不改 user store」

---

## Prompt 进化

- Phase 2 复杂练可 **2 Prompt**：步骤一禁做守卫，步骤二只做守卫  
- 路由权限 Prompt 必备：**meta 哪条路由、beforeEach 两个分支、公开路由列表**  
- 理解验收写进习惯：注释承重墙代码 → 观察行为反转

---

## 自评（1–5 分 · 教练参考）

| 维度 | 评分 | 说明 |
|------|------|------|
| 需求分析 | 4 | README 骨架 + 5 问；步骤二假设写得出来 |
| Prompt 质量 | 4 | 两步拆分好；prompt2 验收可更具体 |
| 架构理解 | 4.5 | 理解验收通过，守卫因果清楚 |
| 验收意识 | 5 | 功能 + 手改守卫验证 |
| 整体效率 | 4 | 2 Prompt 略多一步但稳 |

**平均：4.3** — 可进入练习 5

---

## 练习 3 → 4 成长

| 维度 | 练习 3 | 练习 4 |
|------|--------|--------|
| 阶段 | Phase 1 跟练 | **Phase 2 半独立** |
| 需求来源 | 教练完整 README | 骨架 + 你补 Prompt |
| 新能力 | Pinia todos | user store + **beforeEach** |
| Prompt 数 | 1 | **2**（自拆） |
| 理解深度 | storeToRefs | **守卫 ↔ store 读关系** |

---

## 下一步：练习 5 预告

- **Todo localStorage 持久化** — 刷新不丢失列表  
- 与练 4 对比：练 4 故意不持久化登录；练 5 持久化 **todos**（登录是否持久化你 Prompt 里定）  
- 建议仍 **1 个 Prompt**，数据边界写清 hydration 时机
