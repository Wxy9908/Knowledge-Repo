# React Hooks 要点

> tags: react, hooks | updated: 2026-06-30 | mastery: practicing

## 是什么

Hooks 让函数组件拥有状态与副作用能力，无需 class 组件。

## useState

```js
const [count, setCount] = useState(0);
```

## useEffect（副作用）

```js
useEffect(() => {
  console.log('count changed', count);
}, [count]); // 依赖数组：空 [] 仅挂载；省略则每次渲染
```

用于：请求、订阅、同步 DOM。

## useMemo（缓存计算结果）

```js
const result = useMemo(() => expensiveCalc(value), [value]);
```

父组件无关 state 更新时，避免子树重复重算。

## useCallback（缓存函数引用）

配合 `memo` 子组件时，稳定 `onClick` 引用可避免子组件无意义重渲染：

```js
const handleClick = useCallback(() => { /* ... */ }, []);
const Button = memo(function Button({ onClick, children }) { /* ... */ });
```

若把变化的 `count` 传给 memo 子组件，memo 仍会放行重渲染。

## useRef

- 存可变值且不触发重渲染（如 `prevCountRef.current`）
- 引用 DOM：`inputRef.current.focus()`
- 引用子组件：`forwardRef` + `useImperativeHandle` 暴露方法

## useReducer

复杂 state 逻辑用 reducer 集中处理：

```js
const [count, dispatch] = useReducer(countReducer, 0);
dispatch({ type: 'increment' });
```

## useContext

跨层级传值，避免 props 逐层透传。典型模式：`createContext` + `Provider` + `useContext`。

示例：嵌套 `Section` 自动递增标题层级，内部 `Heading` 读取 context 渲染 `h1`~`h6`。

## Props 与 children

```js
function List({ children, title, footer = <div>No footer</div> }) {
  return (/* ... */);
}
```

`children` 是特殊 prop，用于组合式布局。

## 踩坑

- `useEffect` 不写依赖易导致无限循环或漏更新
- `useCallback`/`useMemo` 不是越多越好，有明确性能问题时再用
- Context 值变化会导致所有消费组件重渲染，大状态慎放 Context

## 复盘

- 能否讲清楚：useEffect 依赖数组、useCallback 与 memo 配合场景
- 何时使用：函数组件 + 局部状态为主流写法
- 原 demo 项目已删除，要点已沉淀至此
