# 工具类型速查

> Phase 2 练习 9 用。每个工具类型写一个**业务例子**，不要只抄定义。

## 内置工具类型（先掌握这 5 个）

假设有：

```ts
interface Todo {
  id: number;
  title: string;
  done: boolean;
}
```

### `Partial<T>` — 全部变可选

```ts
type TodoPatch = Partial<Pick<Todo, 'title' | 'done'>>;
// 等价于本仓库 todo.ts 的思路：更新时只传部分字段
```

业务例子：编辑表单草稿、PATCH 请求体。

### `Pick<T, K>` — 只取部分键

```ts
type TodoCard = Pick<Todo, 'id' | 'title'>;
```

业务例子：列表卡片不需要全部字段。

### `Omit<T, K>` — 去掉部分键

```ts
type TodoCreate = Omit<Todo, 'id'>;
// 新建时 id 由后端/本地生成
```

### `Required<T>` — 全部变必填

```ts
type TodoStrict = Required<Partial<Todo>>;
```

业务例子：校验通过后的「完整对象」。

### `ReturnType<F>` — 取函数返回类型

```ts
function buildCatalog() {
  return { version: 1, tracks: [] as CatalogTrack[] };
}
type CatalogSnapshot = ReturnType<typeof buildCatalog>;
```

业务例子：不想重复写返回 interface 时，从实现推导。

---

## 另外两个常见

### `Record<K, V>`

```ts
const STATUS_META: Record<string, { label: string; class: string }> = {
  planned: { label: '计划中', class: 'planned' },
};
```

键集合更严时：

```ts
type Status = 'planned' | 'in_progress' | 'completed';
const META: Record<Status, string> = {
  planned: '计划中',
  in_progress: '进行中',
  completed: '已完结',
};
```

漏写某个 Status 会报错 —— 这就是类型的价值。

### `Readonly<T>` / 字段 `readonly`

防止误改配置对象、常量表。

---

## 练习 9 作业模板

在笔记或 STATUS 里各写一行业务例子：

| 工具类型 | 我的业务例子（一句话 + 类型别名） |
|----------|-----------------------------------|
| Partial | |
| Pick | |
| Omit | |
| Required | |
| ReturnType | |

---

## 先认后写（练习 13 可选）

看到 AI 写出下面这些时，知道「这是高级类型」即可，不必手写：

```ts
type NonNull<T> = T extends null | undefined ? never : T; // 条件类型
type Elem<T> = T extends (infer U)[] ? U : T;             // infer
const cfg = { port: 5173 } as const;
// satisfies：校验形状但保留更窄的字面量类型（能认即可）
```

简单替代思路：能拆成 `interface` + 联合 + 工具类型，就拆；可读性优先。

---

*配合练习：Phase 2 · 9、13*
