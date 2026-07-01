# AI Coding 工作状态（Agent 同步用）

> **单一事实来源**：换 Agent / 换对话前读此文件。  
> **更新权限**：**需求拆解 Agent**（本步任务、启动拆解）· **用户**（定稿、验收、代码现状）· Prompt 审 / 实现只读

---

## 当前阶段

| 项 | 值 |
|----|-----|
| Phase | **Phase 3+ 加练** |
| 练习 | 练习 7 ✅ Mock 接口层 · 复盘 [`units/07-mock-api/review.md`](./units/07-mock-api/review.md) |
| 上次完成 | 练习 7 — `api/` + async store + loading/error（2026-05-22） |
| 当前 Agent 建议 | **加练 2** 新域表格页；或 **最终通关自评** |

---

## 代码现状（简要）

- **API 层**：`src/api/request.js`（mockRequest + SIMULATE_ERROR）、`src/api/todosApi.js`（localStorage 假后端）
- **Store**：async actions；`loading` / `error` / `initialized`；无直连 localStorage
- **UI**：首屏 loading、操作期 loading、错误 banner + 重试 `fetchTodos`
- **Todo v1.1 + 鉴权 + filter**：经 API 保持

---

## 本步任务

| 项 | 值 |
|----|-----|
| 可选下一步 | 加练 2 题 B · 或最终通关 |
| prompt_status | `未开始` |

---

## 有效约束（沉淀）

- 业务经 **api 层** async；store 不直连 localStorage
- user / 守卫 / filter 规则不变；Prompt 五段式

---

*最后更新：练习 7 验收通过 · 加练 1 Mock API 完成*
