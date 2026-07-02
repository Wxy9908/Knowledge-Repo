# ECharts 版本选型矩阵

> tags: echarts, version, vite, vue | updated: 2026-07-01 | mastery: learning

## 是什么 / 解决什么问题

对比 ECharts 4.x / 5.x / 6.x 的差异，说明 Node 与构建工具兼容性，并给出本仓库 Demo 的技术栈与选型结论。

用途：

- Showcase **Tab 1「版本说明」** 的内容来源
- 向技术领导汇报「用什么版本、能不能上、老项目怎么迁」
- 新项目选型参考

## 本 Demo 技术栈（版本说明 Tab 展示用）

> 以下与 `playground/vue-playground/package.json` 保持一致，开发时以 lock 文件实际解析版本为准。

| 类别 | 依赖 | 版本声明 | 说明 |
|------|------|----------|------|
| **图表库** | `echarts` | **^6.1.0** | 全量引入，Demo 主依赖 |
| 框架 | `vue` | ^3.5.13 | Composition API + `<script setup lang="ts">` |
| 语言 | `typescript` | ^5.8 | 全项目 TypeScript（`vue-tsc` 类型检查） |
| 路由 | `vue-router` | ^4.5.0 | Demo 路由注册 |
| 状态 | `pinia` | ^3.0.4 | 仅 ai-coding 等模块使用 |
| 构建 | `vite` | ^6.2.0 | 开发服务器与打包 |
| Vue 插件 | `@vitejs/plugin-vue` | ^5.2.1 | SFC 编译 |
| 包管理 | `pnpm` | ^10.34.4 | 推荐安装与启动方式 |
| 模块类型 | `"type": "module"` | — | ESM 项目 |

**启动命令：**

```bash
cd playground/vue-playground
pnpm install
pnpm dev    # http://localhost:5173/
```

**本 Demo 引入方式（阶段 3 起在 `.vue` / `.ts` 中编写）：**

```ts
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

const option: EChartsOption = { /* ... */ };
chart.setOption(option);
```

> Showcase 已搭建，基础图表见 Tab 2；完整引入方式见 `EchartsShowcase.vue` 与各 `Basic*Chart.vue`。

首版 Showcase 沿用**全量引入**，优先保证功能覆盖与开发效率；生产环境可按需改为按需引入（见下文 tree-shaking）。

**选型结论（一句话）：** 本 Demo 与推荐新项目均使用 **ECharts 6.x + Vue 3 + TypeScript + Vite 6**。

---

## ECharts 大版本对比

| 维度 | ECharts 4.x | ECharts 5.x | ECharts 6.x |
|------|-------------|-------------|-------------|
| 发布时间线 | 2018–2021 主力 | 2021–2025 主力 | 2025+ 当前最新 |
| 源码语言 | JavaScript | TypeScript 重写 | TypeScript |
| 默认导出 | 支持 `import echarts from 'echarts'` | **仅 named**，需 `import * as echarts` | 同 5.x |
| Tree-shaking | 弱，主要靠路径引入 `echarts/lib/chart/*` | **正式 API**：`echarts/core` + `echarts.use()` | 同 5.x，持续完善 |
| 包格式 | 以 CJS/UMD 为主 | 5.5+ **默认 ESM**（`package.json` exports） | 同 5.x |
| 默认主题 | v4 配色 | v5 新主题 | **v6 新主题**（图例默认底部等） |
| 内置地图 GeoJSON | 有 `echarts/map` | **已移除**，需自行 `registerMap` | 同 5.x |
| IE8 | 支持（VML） | **不再支持** | 不再支持 |
| TypeScript | 社区 @types | 官方类型内置 | 官方类型，ESM/CJS 入口分离 |
| 新特性示例 | — | 数据集 dataset、按需加载成熟 | 主题升级、防溢出布局、矩阵坐标等 |
| 升级难度 | — | 4→5：中等（引入方式、主题、visualMap 优先级） | 5→6：**较低**（多数 API 兼容，注意主题与布局微调） |

### 各版本核心变化摘要

#### 4.x → 5.x（变动最大）

- 引入方式：`import echarts from 'echarts'` **失效**，改为 `import * as echarts from 'echarts'`
- 新增 tree-shaking 路径：`echarts/core` + `echarts/charts` + `echarts/components` + `echarts/renderers`
- 不再支持 `echarts/src/*` 路径
- 内置地图数据移除
- `visualMap` 与 `itemStyle` 的样式优先级**反转**
- Y 轴 `axisLine` / `axisTick` 默认隐藏

官方升级指南：[v4 → v5](https://echarts.apache.org/handbook/en/basics/release-note/v5-upgrade-guide/)

#### 5.x → 6.x（相对平滑）

- **默认主题与组件位置变化**（如图例默认在画布底部）→ 可用 `import 'echarts/theme/v5.js'` 恢复 v5 视觉
- 坐标轴防溢出、防 label 重叠默认开启，极端布局可能微调
- `geo` / `map` / `graph` / `tree` 的 `center` 百分比基准修正
- `rich` 文本样式继承 plain label 行为变化
- 柱状图等默认不再溢出 grid 区域

官方升级指南：[v5 → v6](https://echarts.apache.org/handbook/en/basics/release-note/v6-upgrade-guide/)

---

## Node 与构建工具兼容性

> ECharts 本身不绑定 Node 版本；实际限制来自 **构建工具** 与 **包 ESM/CJS 格式**。

| 环境 | ECharts 4.x | ECharts 5.0–5.4 | ECharts 5.5+ / 6.x | 说明 |
|------|-------------|-----------------|---------------------|------|
| Node 14 | ✅ 常见 | ✅ 可用 | ⚠️ 不推荐 | 5.5+ 默认 ESM，旧 Node 易踩坑 |
| Node 16 | ✅ | ✅ | ⚠️ 边缘 | Vite 5+ 官方已提高 Node 要求 |
| **Node 18 LTS** | ✅ | ✅ | **✅ 推荐** | 与本 Demo（Vite 6）兼容 |
| **Node 20 / 22 LTS** | ✅ | ✅ | **✅ 推荐** | 生产环境首选 |
| Webpack 4 | ✅ 老项目 | ⚠️ | ⚠️ | 建议升级 Webpack 5 |
| **Webpack 5** | ✅ | ✅ | ✅ | 企业老项目常见 |
| **Vite 5 / 6** | ⚠️ 需配置 | ✅ | **✅ 本 Demo** | Vue 3 新项目首选 |
| Vue 2 + echarts 4/5 | ✅ | ✅ | ⚠️ | Vue 2 项目可暂留 5.x |
| **Vue 3** | — | ✅ | **✅ 本 Demo** | 与 6.x 搭配最佳 |

### 引入方式与打包体积

| 方式 | 适用版本 | 代码示例 | 体积 | 本 Demo |
|------|----------|----------|------|---------|
| 全量引入 | 4 / 5 / 6 | `import * as echarts from 'echarts'` | 大（~数百 KB gzip 前） | **✅ 当前采用** |
| 按需引入 | 5 / 6 | `echarts/core` + `echarts.use([...])` | 小 | 二期优化 |
| 路径引入（旧） | 4 / 5 | `echarts/lib/chart/bar` | 中 | 不推荐新项目 |

**按需引入示例（生产推荐，Demo 二期可用）：**

```js
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
]);
```

---

## 场景选型建议

| 场景 | 推荐版本 | 理由 |
|------|----------|------|
| **本仓库 Demo / 新 Vue 3 项目** | **ECharts 6.x** | 与 Vite 6、Vue 3.5 一致；功能最新；5→6 迁移成本低 |
| 已有 Vue 3 项目（ECharts 5.4+） | 5.x 或升到 6.x | 5→6 可渐进；注意主题与布局差异 |
| 老 Vue 2 / Webpack 4 项目 | 暂留 5.4.x 或评估升级 | 先解决构建链，再升 6 |
| 强依赖内置地图 | 4.x 或自行 `registerMap` | 5+ 无内置 map JSON |
| 必须 IE8/9 | 最高 4.x | 5+ 已移除 VML |

---

## 与合同业务 Demo 的关系

| 图表能力 | 最低版本 | 本 Demo 6.1 是否支持 |
|----------|----------|----------------------|
| 折线 / 柱 / 饼 / 散点 | 4+ | ✅ |
| 漏斗图 `funnel` | 4+ | ✅ |
| `markLine` 预警线 | 4+ | ✅ |
| 面积渐变 `areaStyle` | 4+ | ✅ |
| 双系列横向条形对比 | 4+ | ✅ |
| 主题 `v5.js` 回退 | 6+ | ✅（若需与旧项目视觉一致） |

合同看板 7 图所用能力均在 ECharts 5/6 稳定支持范围内，**无需为业务 Demo 降级版本**。

---

## Showcase Tab 1「版本说明」展示提纲

开发 `VersionPanel.vue` 时可按此结构渲染（文案摘自本文档）：

1. **本 Demo 技术栈表** — 见上文「本 Demo 技术栈」
2. **选型结论** — ECharts 6.x + Vue 3 + Vite 6
3. **大版本对比简表** — 4 / 5 / 6 核心差异（可折叠详情）
4. **老项目迁移提示** — 4→5 改 import；5→6 注意主题与图例位置
5. **文档链接** — [官方 Handbook](https://echarts.apache.org/handbook/en/get-started)、[v5→v6 升级指南](https://echarts.apache.org/handbook/en/basics/release-note/v6-upgrade-guide/)

---

## 踩坑

| 问题 | 原因 | 处理 |
|------|------|------|
| `import echarts from 'echarts'` 报错 | 5+ 移除 default export | 改为 `import * as echarts from 'echarts'` |
| 图表不显示 | 容器无宽高 | 给 div 明确 `width` / `height` |
| 升级 6 后图例跑到底部 | v6 默认主题变化 | 接受新默认，或 `echarts/theme/v5.js` |
| 按需引入后图表空白 | 未 `use` 对应 chart/component/renderer | 对照官方示例补全 `echarts.use` |
| Vite 下主题/ i18n 路径报错 | 5.5+ ESM 需完整扩展名 | 使用 `import 'echarts/theme/v5.js'` |
| 内存泄漏 | 路由切换未 `dispose` | `onBeforeUnmount` 中 `chart.dispose()` |

---

## 复盘

- 能否讲清楚：4 / 5 / 6 最大差异是什么？本 Demo 为什么选 6.1？ → **能**（6.x 与 Vue 3 + Vite 生态匹配，Tab 1 已说明）
- 何时使用：汇报前技术选型、老项目评估升级、Showcase Tab 1 文案
- 沉淀去向：`VersionPanel.vue`、选型结论 **ECharts 6.1.x**
