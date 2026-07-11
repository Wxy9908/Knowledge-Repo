# Vue 里常见 TS 写法

> 面向 `<script setup lang="ts">`。对照 playground 组件练。

## 1. `import type`

只用于类型时加 `type`，运行时不会留下 import：

```ts
import type { CatalogTrack } from '@/types/catalog';
```

值 + 类型可混写：

```ts
import { useEcharts, type EchartsLoadingOpts } from './useEcharts';
```

## 2. Props

**推荐**：`defineProps` + 泛型对象类型（本仓库 `TrackCard.vue` 写法）：

```ts
defineProps<{
  track: CatalogTrack;
}>();
```

需要默认值时用 `withDefaults`：

```ts
const props = withDefaults(
  defineProps<{ title?: string; count?: number }>(),
  { title: '', count: 0 },
);
```

## 3. Emit

```ts
const emit = defineEmits<{
  select: [id: string];
  close: [];
}>();

emit('select', track.id);
```

元组写法 `[id: string]` 表示该事件的参数列表。

## 4. `ref` / `computed`

```ts
import { ref, computed } from 'vue';
import type { Todo } from '@/types/todo';

const todos = ref<Todo[]>([]);           // 显式泛型，避免推成 never[]
const activeCount = computed(() =>
  todos.value.filter((t) => !t.done).length,
);
```

空数组一定要写 `ref<Todo[]>([])`，否则 TypeScript 可能推成 `never[]`。

## 5. 模板里的类型

模板会用 props / 脚本里的类型做检查（取决于 IDE / `vue-tsc`）。复杂对象优先在 `types/` 里定义，组件只 `import type`。

## 6. Composable 里的泛型

见 `useAsyncContractChart.ts`：

```ts
export interface UseAsyncContractChartConfig<T> {
  buildEmptyOption: () => EChartsOption;
  setDataOption: (data: T) => EChartsOption;
  fetchData: () => Promise<T>;
  emptyData: T;
  hasData?: (data: T) => boolean;
}
```

`T` =「这次图表的数据形状」。调用方传入具体 `T`（如某图表的数据项数组），函数内部用同一 `T` 串起 fetch 与 option。

练习 6：改 `fetchData` 的返回类型与 `emptyData` 不一致，看报错；再改回。

## 7. `as` 在 Vue 里何时危险

例如 `TrackNote.vue`：

```ts
const catalog = catalogData as Catalog;
```

JSON / 生成物没有经过运行时校验时，`as` 只骗过编译器。更稳的方向：

- 生成脚本保证形状，并在类型文件与 JSON 同步（本仓库 catalog sync）
- 或对关键字段做运行时校验 / 类型守卫后再用

**原则**：能靠推断或显式标注解决的，不用 `as`；必须用时，在旁边注释「为什么安全」。

## 8. 教材对照

| 写法 | 文件 |
|------|------|
| props + `import type` + `Record` | `components/dashboard/TrackCard.vue` |
| `as Catalog` | `views/TrackNote.vue` |
| 泛型 composable | `demos/echarts/composables/useAsyncContractChart.ts` |
| API + 类型守卫 | `demos/ai-coding/api/todosApi.ts` |

---

*配合练习：Phase 0 · 4 · Phase 1 · 6–7*
