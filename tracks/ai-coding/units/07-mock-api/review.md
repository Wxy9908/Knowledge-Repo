# 练习 7 复盘 — 加练 1 Mock 接口层

> 完成日期：2026-05-22  
> 需求：[`REQUIREMENTS.md`](./REQUIREMENTS.md) · Prompt：[`prompt.md`](./prompt.md)

---

## 交付情况

### P0 — 全部通过

| # | 需求 | 状态 | 实现 |
|---|------|:----:|------|
| A1 | `todosApi.js` | ✅ | + `API_PATHS` 语义化 |
| A2 | 5 个 async API | ✅ | fetch/create/update/delete/clearCompleted |
| A3 | 延迟 300～800ms | ✅ | `request.js` `randomDelay()` |
| A4 | localStorage 仅在 API 层 | ✅ | store 无 `localStorage` |
| A5 | store async + loading/error | ✅ | + `initialized` |
| A6 | 挂载拉列表 | ✅ | `TodoList` `onMounted` → `fetchTodos` |
| A7 | Loading UI | ✅ | 首屏 + 操作期 inline + 按钮 `:disabled` |
| A8 | 错误 + 重试 | ✅ | banner；重试 `fetchTodos()` 整表 |
| A9 | 练 6 功能不退化 | ✅ | 架构上 API 成功后再改 `todos` |

### P1

| # | 需求 | 状态 |
|---|------|:----:|
| B1 | `SIMULATE_ERROR` | ✅ `request.js` |
| B2 | 操作级 loading | ⚠️ 全局 `loading` 禁用按钮（可接受，未做行级） |

### 架构

```text
TodoList → store (async) → todosApi → mockRequest → localStorage
```

- 新增：`src/api/request.js`、`src/api/todosApi.js`
- 修改：`stores/todos.js`、`TodoList.vue`
- `pnpm run build` ✅

---

## 做得好的

1. **分层清晰** — 校验/INITIAL_TODOS/持久化迁入 API，store 变薄  
2. **Prompt 假设落地** — `initialized`、成功后更新、重试整表、非乐观更新  
3. **`mockRequest` 收敛** — 延迟 + 可开关失败，换真接口时改点集中  
4. **错误不污染列表** — `runMutation` 失败时不改 `todos`  
5. **补上了练 6 缺的「接口感」** — 延迟 + loading + 失败路径

---

## 小差异 / 可改进

| 点 | 说明 |
|----|------|
| Prompt 写 toast | 实现为 **banner**，可读性 OK |
| 重试仅 `fetchTodos` | 变异失败会丢「重试最后一次写操作」，面试可口述增强 |
| `toggleTodo` 用内存 `done` 算 patch | 并发极端情况可能偏；单用户可接受 |

---

## 理解验收（请你自证）

- [ ] store 里已无 `localStorage` — 持久化在 `todosApi.js`  
- [ ] `SIMULATE_ERROR = true` → 见错误 → 重试恢复  
- [ ] 口述：换真 HTTP 时主要改 `todosApi.js` / `request.js`

---

## 自评（教练）

| 维度 | 评分 |
|------|------|
| 架构分层 | 5 |
| async / 错误处理 | 4.5 |
| Prompt 对齐 | 5 |
| UI loading/error | 4.5 |
| 加练目标达成 | 5 |

**练习 7 结论：✅ 通过** — 已补上 Mock 接口层缺口

---

## 下一步

- **加练 2**：新域页面（题 B 表格 + 搜索 + 分页）  
- 或 **最终通关自评**（Phase 1–3 + 加练 1）
