# ECharts 演示 Demo — 工作计划

> 状态：阶段 0–2、阶段 1 已完成 · 下一步阶段 3（Showcase 骨架） | updated: 2026-07-01

## 一、任务背景

后续需求迭代需要用到 ECharts，需先完成学习与能力验证，以便后续在合同业务中落地。

1. **版本分析** — 不同 ECharts 大版本功能不一致，不同 Node / 构建环境对版本支持不同（需输出对比表与选型结论）
2. **基础功能学习** — 折线图、柱状图、饼图、散点图等，搭建可演示 Demo
3. **项目实战** — 模拟合同业务实际场景，搭建业务看板 Demo 以便汇报

## 二、任务目标

输出一个**可供演示、可汇报**的 ECharts 能力证明：

| 层次 | 受众 | 要回答的问题 |
|------|------|--------------|
| 决策层 | 领导 / 产品 | 用什么版本？能不能上？合同场景能做什么图？ |
| 执行层 | 研发 | 怎么 init？Vue 里怎么封装？常见坑怎么处理？ |

**最终交付物：**

- 文档：`tracks/echarts/notes/` 下版本对比、业务分析等笔记
- Demo：单页 **ECharts 演示中心**（方案 A），路由 `/demos/echarts/showcase`
- 元数据：`meta.yaml`、`registry.js`、`roadmap.md` 同步更新

## 三、已确认方案：演示中心（方案 A）

单路由、Tab 切换，汇报时一个 URL 即可演示全部能力。

```text
┌─────────────────────────────────────────────────┐
│  ECharts 演示中心                    [← 返回]   │
├──────────┬──────────┬──────────────────────────┤
│ 版本说明  │ 基础图表  │ 合同业务看板              │
├──────────┴──────────┴──────────────────────────┤
│   [根据 Tab 展示不同内容]                        │
└─────────────────────────────────────────────────┘
```

**默认假设（已拍板，可直接按此执行）：**

- 汇报对象：领导 + 技术 → 业务价值与技术可落地性分层叙事
- 技术栈：Vue 3 + **TypeScript** + Vite + ECharts 6.x（与 `playground/vue-playground` 一致）
- 数据：静态 mock，首版不做筛选器；虚拟部门名；类型侧重服务 35% + 框架 25%
- 合同看板 **7 图**（详见 `contract-charts-analysis.md`）
- **Tab 2 基础图表从简**（最小 option、通用 mock）；**Tab 3 业务看板做复杂**（贴合场景、展示 ECharts 能力）
- 框架额度：**TOP3 横向条形图**（双系列：已用 / 总额度）
- 保留 `BarBasic.vue` 路由占位（ECharts 代码在阶段 3 Showcase 重写）

### 阶段 0.5：TypeScript 迁移 ✅（ECharts 开发前完成）

- [x] `vue-playground` 全项目迁 TypeScript（`strict: true`）
- [x] ECharts demo 重置为占位页，避免迁移后重复改图表代码
- [x] `pnpm build` / `vue-tsc` 通过

---

### 阶段 0：对齐与准备 ✅

- [x] 确认合同业务补充信息 → 见 `contract-business-overview.md`、`contract-charts-analysis.md`
- [x] 阅读仓库规范：`_standards/lightweight-tiers.md`、`metadata-schema.md`
- [x] 本地启动 playground：`cd playground/vue-playground && pnpm install && pnpm dev`

**产出：** 业务与图表选型文档就绪；仓库规范已对齐；playground 环境可用。

---

### 阶段 1：版本分析（文档） ✅

- [x] 调研 ECharts 4.x / 5.x / 6.x 主要差异（API、引入方式、tree-shaking、TS、废弃项）
- [x] 调研 Node 版本与构建工具（Webpack / Vite）对 ECharts 各版本的支持情况
- [x] 输出对比表格与**选型结论**（推荐新项目 ECharts 6.x + Vue 3 + Vite）
- [x] 新建笔记 `notes/echarts-version-matrix.md`（含 **Demo 技术栈**，供 Tab 1「版本说明」使用）
- [x] 在 `meta.yaml` 的 `notes` 中登记该笔记

**产出：** `tracks/echarts/notes/echarts-version-matrix.md`

---

### 阶段 2：合同业务分析（文档）

- [x] 梳理合同业务常见可视化需求 → `contract-business-overview.md`
- [x] 确定 Showcase「合同业务看板」Tab 的 7 图清单与 mock 设计 → `contract-charts-analysis.md`
- [x] 新建笔记 `notes/contract-charts-analysis.md`
- [x] 在 `meta.yaml` 的 `notes` 中登记该笔记

**合同看板 7 图（含主流程阶段）：**

| # | 图表 | 主流程阶段 | ECharts 类型 |
|---|------|------------|--------------|
| 1 | 月度签约金额趋势 | ⑦ 管理复盘 | 折线 + 面积渐变 |
| 2 | 合同类型占比 | ⑦（类型源于 ② 起草） | 环形饼图 |
| 3 | 合同状态分布 | 横切面（偏 ③→④） | 柱状图 |
| 4 | 部门签约额对比 | ⑦ 管理复盘 | 横向条形图 |
| 5 | 框架额度 TOP3 | ④ 履约执行 | 横向条形图（已用/总额度） |
| 6 | 服务合同到期分布 | ⑥ 到期与风险 | 柱状 + markLine |
| 7 | 审批流程漏斗 | ③ 审批与签署 | funnel |

**产出：** `tracks/echarts/notes/contract-charts-analysis.md`

**验收：** 每图含主流程阶段、业务含义、字段、双受众话术；Tab 2/3 复杂度分层已写明。

---

### 阶段 3：演示中心框架搭建（代码骨架）

- [ ] 设计目录结构（见下方「代码结构」）
- [ ] 实现 `useEcharts` composable（init / setOption / resize / dispose）
- [ ] 实现 `ChartCard.vue` 统一图表卡片（标题、容器、宽高、aria-label）
- [ ] 实现 `EchartsShowcase.vue` 主页面（Tab 切换 + 布局 + 返回链接）
- [ ] 在 `registry.js` 注册路由 `/demos/echarts/showcase`
- [ ] 在 `meta.yaml` 的 `artifacts` 中登记 Showcase
- [ ] Tab 1「版本说明」先放静态文案（引用阶段 1 文档要点）

**产出：**

```text
playground/vue-playground/src/demos/echarts/
├── BarBasic.vue                 # 占位页（阶段 3 起替换为 Showcase）
├── EchartsShowcase.vue          # 主入口
├── composables/useEcharts.ts
├── components/
│   ├── ChartCard.vue
│   ├── VersionPanel.vue         # Tab 1
│   ├── BasicChartsPanel.vue     # Tab 2（先占位）
│   └── ContractDashboardPanel.vue  # Tab 3（先占位）
└── mock/
    ├── basicChartData.ts
    └── contractData.ts
```

**验收：** 可访问 `/demos/echarts/showcase`，三个 Tab 可切换，样式与 Dashboard 统一（`--surface`、`--border` 等）。

---

### 阶段 4：基础图表演示（Tab 2 · 从简）

- [ ] 实现折线图、柱状图、饼图、散点图（2×2 网格）
- [ ] 使用**通用 mock**（与合同无关），**最小 option**（axis + series + tooltip + legend）
- [ ] 窗口 resize 时各图表正常自适应
- [ ] Tab 切换后对隐藏图表执行 resize（`v-show` + `nextTick` 或等效方案）

**产出：** `BasicChartsPanel.vue` + `mock/basicChartData.ts`（与 `contractData.ts` 分离）

**验收：** 四图同屏、配置从简；无内存泄漏；不与 Tab 3 业务数据耦合。

---

### 阶段 5：合同业务看板（Tab 3 · 做复杂）

- [ ] 实现 **7 张业务图表** + 顶部 KPI 条（见 `contract-charts-analysis.md`）
- [ ] 使用 `mock/contractData.js` 统一数据源与聚合函数
- [ ] 丰富 option：面积渐变、markLine、funnel、双系列横向条、tooltip 格式化等
- [ ] 每图配标题、单位、业务说明；布局按文档看板线框图
- [ ] 一屏适合汇报投屏；能讲清各图对应主流程哪一阶段

**产出：** `ContractDashboardPanel.vue` + `options/` 下各图 option 工厂 + `contractData.ts`

**验收：** 7 图 + KPI；框架 TOP3、服务到期预警、funnel 均可用；字段贴近真实合同场景。

---

### 阶段 6：收尾与同步

- [ ] 更新 `tracks/echarts/roadmap.md` 勾选已完成项
- [ ] 更新 `tracks/echarts/meta.yaml`（`notes`、`artifacts`、`updated`）
- [ ] 更新根目录 `STATUS.md` 中 echarts 下一步
- [ ] 运行 `npm run sync-catalog`（或 `pnpm dev` 自动同步）
- [ ] 本地走一遍汇报路径：Dashboard → 轨道详情 → Showcase → 三个 Tab
- [ ] 填写各笔记文末「复盘」与 `next_review`

**产出：** 元数据、索引、全局状态与文档闭环。

---

## 五、时间节奏（参考）

| 阶段 | 预估 | 累计 |
|------|------|------|
| 0 对齐准备 | 15 min | 0.25h |
| 1 版本分析 | 45 min | 1h |
| 2 业务分析 | 30 min | 1.5h |
| 3 框架搭建 | 45 min | 2.25h |
| 4 基础图表 | 45 min | 3h |
| 5 合同看板（7 图） | 90 min | 4.25h |
| 6 收尾同步 | 15 min | 4.5h |

**目标：** 约半天（4–5h）；时间紧时 Tab 2 可去掉散点图，Tab 3 保持 7 图不砍。

## 六、与知识库 roadmap 的关系

本次任务以**工作汇报交付**为主，同步推进 `roadmap.md` 各阶段：

- 阶段一（基础图表）→ 对应工作计划阶段 4
- 阶段二（交互 tooltip/legend 等）→ 在基础图表与合同看板中一并体现
- 阶段三（Vue 集成 / 多图表）→ 对应演示中心框架与 composable

任务完成后将 `roadmap.md` 勾选情况与 `meta.yaml` mastery 对齐。

## 七、决策与 AI 协作

1. 遇到有歧义、需讨论的内容，先提问再开发。
2. 本文档中**已拍板**的内容（方案 A、默认假设、阶段划分），实践 Agent 可直接按文档执行。
3. 用户补充合同业务细节后，更新阶段 2 图表清单与 mock 字段，再进入阶段 5 开发。

## 八、执行顺序（给实践 Agent 的 Brief）

```text
阶段 0 → 1（文档）→ 2（文档）→ 3（骨架）→ 4（Tab 2）→ 5（Tab 3）→ 6（收尾）
```

**当前进度：** 阶段 0 ✅ · 阶段 1 ✅ · 阶段 2 ✅ → **下一步：阶段 3 演示中心框架搭建**
