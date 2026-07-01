# 练习 5 复盘 — Todo localStorage 持久化

> 完成日期：2026-05-22  
> 关联 Prompt：[`prompt.md`](./prompt.md) · 骨架：[`README.md`](./README.md)

---

## 交付情况

- [x] `localStorage` key：`app-todos`
- [x] 仅存 `todos` 数组 `{ id, title, done }`，**不存 filter**
- [x] 启动 hydration：`loadTodosFromStorage()` → `todos` ref
- [x] 增 / 删 / 完成后 `persistTodos()` 同步
- [x] 无数据 / 解析失败 / 格式无效 → `console.warn` + 回退 `INITIAL_TODOS`
- [x] 数据校验 `isValidTodo` / `isValidTodos`
- [x] 只改 `stores/todos.js`（白名单内）
- [x] user 登录仍内存；守卫行为不变
- [x] 用户浏览器验收通过

---

## 做得好的

1. **Prompt 数据边界完整** — key、value 结构、不存 filter、兜底规则一次写清  
2. **1 个 Prompt 交付** — Phase 2 目标节奏  
3. **实现稳健** — try/catch、格式校验、warn 提示，超出最低要求  
4. **保存策略清晰** — action 末尾 `persistTodos()`，比 watch 更易追踪（理解验收友好）  
5. **README 6 问已落 Prompt** — Phase 2 半独立流程跑通

---

## 需要改进的

| 问题 | 说明 |
|------|------|
| Prompt「不改 TodoList」与「可能需要改」略矛盾 | 最终只改 store，Prompt 可写「仅 todos.js」 |
| 删光全部 todo 后刷新 | `isValidTodos` 要求 `length > 0`，空数组会回退初始 3 条 — 若产品要「允许空列表」，需改校验 |

---

## AI 跑偏记录

- **本次**：未跑偏；单文件 + 数据边界有效

---

## 理解验收（建议补做）

- [ ] DevTools → Application → 改 `app-todos` JSON → 刷新看列表  
- [ ] 口述：hydration 在 store 哪一行；`addTodo` 哪一行写 storage  

---

## 自评（1–5 分 · 教练参考）

| 维度 | 评分 | 说明 |
|------|------|------|
| Prompt 质量 | 4.5 | 数据边界好；文件白名单可更干脆 |
| 需求覆盖 | 5 | 与 README / 验收一致 |
| 实现质量 | 4.5 | 校验 + 兜底完整 |
| 验收意识 | 5 | 用户自测通过 |
| Phase 2 独立度 | 4.5 | 自主 Prompt + 1 步实现 |

**平均：4.6**

---

## 练习 4 → 5 成长

| 维度 | 练习 4 | 练习 5 |
|------|--------|--------|
| 主题 | 鉴权 + 守卫 | **持久化 + hydration** |
| Prompt | 2 步 | **1 步** |
| 数据边界 | isLoggedIn / meta | **localStorage key + JSON + 兜底** |
| 改动面 | 多文件 | **单 store 文件** |

---

## 下一步

- **Phase 2 通关自评**（练 4–5 完成）  
- 或进入 **Phase 3 练习 6** — 限时模拟面试
