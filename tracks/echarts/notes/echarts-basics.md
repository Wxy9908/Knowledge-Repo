# ECharts 基础

> tags: echarts, visualization | updated: 2026-06-30 | mastery: learning

## 是什么

ECharts 是 Apache 开源的可视化图表库，通过 `option` 配置即可渲染折线、柱状、饼图等。

## 核心概念

| 概念 | 说明 |
|------|------|
| `init(dom)` | 在 DOM 容器上初始化实例 |
| `setOption(option)` | 传入配置渲染/更新图表 |
| `dispose()` | 组件销毁时释放实例 |
| `series` | 数据系列（type: bar / line / pie …） |
| `xAxis` / `yAxis` | 直角坐标系轴配置 |

## 最小柱状图

```js
import * as echarts from 'echarts';

const chart = echarts.init(document.getElementById('main'));
chart.setOption({
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150] }],
});
```

## 在 Vue 3 中使用

1. 模板里放 `ref` 容器 div
2. `onMounted` 里 `echarts.init(ref.value)`
3. `onBeforeUnmount` 里 `chart.dispose()`
4. 窗口 resize 时调用 `chart.resize()`

## 动手

本地：`cd playground/vue-playground && pnpm dev` → 打开 `/demos/echarts/bar-basic`（当前为占位页）

代码：`playground/vue-playground/src/demos/echarts/BarBasic.vue`（阶段 3 起搭建 Showcase）

## 踩坑

- 容器必须有宽高，否则图表不显示
- 忘记 `dispose()` 会导致内存泄漏
- 数据更新用 `setOption(newOption)` 或 `setOption(partial, { notMerge: false })`

## 复盘

- 能否讲清楚：init → setOption → dispose 生命周期
- 何时使用：Dashboard、报表、大屏数据展示
