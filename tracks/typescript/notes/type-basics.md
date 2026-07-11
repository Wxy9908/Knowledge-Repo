# TypeScript 基础速查

> 读代码时对照用。不求背完，求「看到能认、能说清」。

## 1. `type` vs `interface`

| | `interface` | `type` |
|---|-------------|--------|
| 对象形状 | ✅ 首选 | ✅ 也可以 |
| 联合 / 交叉 | ❌ 不能直接写联合 | ✅ `A \| B`、`A & B` |
| 扩展 | `extends` | 交叉 `&` 或再包一层 |
| 声明合并 | 同名可合并 | 不可 |

**本仓库习惯**：对象形状多用 `interface`（如 `CatalogTrack`）；联合用 `type`（如 `TodoFilter = 'all' | 'active' | 'done'`）。

```ts
interface Todo {
  id: number;
  title: string;
  done: boolean;
}

type TodoFilter = 'all' | 'active' | 'done';
```

## 2. 对象字段修饰

```ts
interface Example {
  id: number;          // 必填
  title?: string;      // 可选 —— 可能是 undefined
  readonly created: string; // 只读 —— 赋值后再改会报错
}
```

嵌套：字段类型可以是另一个 interface（见 `catalog.ts` 里 `Catalog` → `CatalogTrack[]`）。

## 3. 联合、字面量、窄化

```ts
type Status = 'planned' | 'in_progress' | 'completed';

function label(status: Status): string {
  if (status === 'planned') {
    // 这里 status 被窄化为 'planned'
    return '计划中';
  }
  return status; // 'in_progress' | 'completed'
}
```

常见窄化手段：

- `===` / `!==` 与字面量比较
- `typeof x === 'string'`
- `Array.isArray(x)`
- `'key' in obj`
- 自定义类型守卫：`item is Todo`（见 `todosApi.ts` 的 `isValidTodo`）

**判别联合**（有共同字段区分分支）：

```ts
type Result =
  | { ok: true; data: string }
  | { ok: false; error: string };

function handle(r: Result) {
  if (r.ok) return r.data; // 知道有 data
  return r.error;          // 知道有 error
}
```

## 4. 函数类型

```ts
const escapeHtml = (text: string): string => { /* ... */ };

// 无有意义返回值
function log(msg: string): void { console.log(msg); }

// 永不返回（抛错或死循环）—— 少见，能认即可
function fail(msg: string): never {
  throw new Error(msg);
}
```

练习 3 精读 `renderMarkdown.ts`：标每个函数的**入参类型**和**返回类型**。

## 5. `any` / `unknown` / `as`

| 写法 | 含义 | 建议 |
|------|------|------|
| `any` | 关闭检查 | 尽量不用 |
| `unknown` | 「我还不知道」—— 用前必须窄化 | 处理外部 JSON 时首选 |
| `as T` | 断言「就是 T」 | 仅在你比编译器更确定时；滥用会骗过检查 |

```ts
function parseTodo(raw: unknown): Todo | null {
  if (!raw || typeof raw !== 'object') return null;
  // 继续用字段检查或类型守卫，而不是 raw as Todo
}
```

`import type`：只引入类型，编译后擦除，避免运行时循环依赖。见 `TrackCard.vue`：`import type { CatalogTrack } from '@/types/catalog'`。

## 6. 数组与 Record

```ts
const ids: number[] = [1, 2, 3];
const map: Record<string, number> = { a: 1 }; // 键 string → 值 number
```

`Record<K, V>` =「键是 K、值是 V 的对象」。`TrackCard.vue` 里 `STATUS_META: Record<string, { label: string; class: string }>` 就是典型用法。

## 7. 教材对照

| 概念 | 去哪看 |
|------|--------|
| 多层 interface | `src/types/catalog.ts` |
| 字面量联合 | `src/types/todo.ts` → `TodoFilter` |
| 类型守卫 | `demos/ai-coding/api/todosApi.ts` → `isValidTodo` |
| 函数链 | `src/utils/renderMarkdown.ts` |

---

*配合练习：Phase 0 · 1–4*
