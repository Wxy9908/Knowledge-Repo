# Flowable 前端对接 · 21 天学习计划

> 弹性节奏 · 打卡自测 · 薄弱点次日巩固 · ~1h（可视情况增减）

**平台打开（推荐）**：Dashboard → Flowable 轨道 → [21 天学习计划](/tracks/flowable/schedule)

---

## 概念期（Day 1–5）
> 看懂 BPMN、搞清术语、明确前后端分工

## 接口期（Day 6–10）
> 搞懂审批流 API 契约，Mock/Postman 走通

## 实战期（Day 11–19）
> Vue 发起/待办/审批/时间线页面

## 通关期（Day 20–21）
> 模拟对接 + 综合自测

---

## 每日清单

### Day 1 · 工作流解决什么问题
- **阶段**：概念期
- **时长**：45min
- **目标**：
  - 理解审批类业务为何常用流程引擎
  - 能对比 if/else 硬编码的局限
- **资源**：
  - 【必读】[Camunda — What is BPMN?](https://camunda.com/bpmn/)
  - [Flowable 开源文档首页](https://www.flowable.com/open-source/docs/)
- **任务**：
  - [ ] 阅读 Camunda BPMN 页「Introduction」部分（不必学建模深度）
  - [ ] 写下你经历过的一个审批场景（请假/报销/工单均可）
  - [ ] 对比：该场景用 if/else 写 vs 用流程引擎，各 3 个优缺点
- **自测**：
  - [ ] 流程引擎最适合解决哪类问题？举 2 个例子。
  - [ ] 「会读流程图」和「会搭流程」对前端来说为何不同？
  - [ ] （实操）30 秒向同事解释「我学 Flowable 是为了对接，不是为了替后端搭流程」

### Day 2 · BPMN 基础元素（阅读向）
- **阶段**：概念期
- **时长**：50min
- **目标**：
  - 识别开始/结束事件、用户任务、顺序流
  - 能在 bpmn.io 打开示例图并读懂走向
- **资源**：
  - 【必读】[bpmn.io — 在线建模](https://bpmn.io/)
  - 【必读】[Camunda BPMN 2.0 Tutorial](https://camunda.com/bpmn/reference/)
- **任务**：
  - [ ] 打开 bpmn.io，新建图：开始 → 用户任务 → 结束
  - [ ] 对照 Reference，记录 5 个最常见元素的图标与含义
  - [ ] 笔记写入 tracks/flowable/notes/bpmn-basics.md（可先写骨架）
- **自测**：
  - [ ] 圆圈细边框 vs 粗边框分别代表什么事件？
  - [ ] 用户任务（人形图标）和服务任务对前端有何不同？
  - [ ] （实操）手绘一张 3 节点的 BPMN 草图并拍照/留存

### Day 3 · 网关与用户任务
- **阶段**：概念期
- **时长**：55min
- **目标**：
  - 读懂排他网关（同意/驳回分支）
  - 理解用户任务节点即「待办产生的位置」
- **资源**：
  - 【必读】[Camunda — Exclusive Gateway](https://camunda.com/bpmn/reference/#gateways)
  - [bpmn.io 示例流程（可导入练习）](https://demo.bpmn.io/)
- **任务**：
  - [ ] 在 bpmn.io 画：提交 → 审批 → 网关 →（同意/驳回）→ 两个结束
  - [ ] 标出：哪个节点会产生「经理的待办」
  - [ ] 思考：驳回后是「结束流程」还是「回到提交人」— 两种产品规则
- **自测**：
  - [ ] 排他网关和多路分支在前端展示上有何影响？
  - [ ] 一个流程实例在同一时刻可以有多个待办任务吗？
  - [ ] （实操）解读一张含网关的请假流程图，口述两条路径

### Day 4 · 核心术语四件套
- **阶段**：概念期
- **时长**：50min
- **目标**：
  - 辨析流程定义、流程实例、用户任务、流程变量
  - 避免与「业务单」混用
- **资源**：
  - 【必读】[Flowable — Process Instance](https://www.flowable.com/open-source/docs/bpmn/ch02-GettingStarted/#process-definitions-and-process-instances)
  - 【必读】本轨道 roadmap — 能力地图 `./roadmap.md`
- **任务**：
  - [ ] 为四个术语各写一个定义 + 一个请假例子
  - [ ] 笔记写入 notes/flowable-architecture.md 术语章节
  - [ ] 填空练习：员工点提交后，创建了___，产生了___，等待___来处理
- **自测**：
  - [ ] 「流程定义更新部署」会影响已运行的实例吗？
  - [ ] taskId 和 processInstanceId 分别用在什么 API？
  - [ ] （实操）30 秒内不看资料解释四术语

### Day 5 · businessKey 与前后端职责
- **阶段**：概念期
- **时长**：45min
- **目标**：
  - 理解业务单与流程实例的关联
  - 明确前端主责与不必背锅的边界
- **资源**：
  - [Flowable REST — Start a process instance](https://www.flowable.com/open-source/docs/bpmn/ch14-REST/#start-a-process-instance)
  - 【必读】本轨道 roadmap — 职责边界表 `./roadmap.md#前后端职责边界`
- **任务**：
  - [ ] 画示意图：leaveId ↔ businessKey ↔ processInstanceId
  - [ ] 列出 5 条「联调时要问后端」的问题（可参考 roadmap）
  - [ ] Phase 0 小结：在 roadmap 进度区勾选 Phase 0 项
- **自测**：
  - [ ] 从待办点进详情，优先用 businessKey 还是 taskId？为什么？
  - [ ] 办理人配错了导致待办为空，是谁的问题？
  - [ ] （实操）Phase 0 通关：解读完整请假 BPMN + 解释四术语 + 职责边界

### Day 6 · 审批流接口全景
- **阶段**：接口期
- **时长**：55min
- **目标**：
  - 建立发起/待办/审批/历史/详情 接口地图
  - 理解前端通常调业务 API 而非裸调引擎
- **资源**：
  - 【必读】[Flowable REST API 概览](https://www.flowable.com/open-source/docs/bpmn/ch14-REST/)
  - 【必读】本轨道 roadmap — 典型接口清单 `./roadmap.md#phase-1接口期--搞懂你要调什么`
- **任务**：
  - [ ] 画「页面 → 接口」矩阵：发起页/待办/详情/时间线各调什么
  - [ ] 区分：业务封装 API vs Flowable 原生 REST（前端一般调哪个）
  - [ ] 笔记：接口全景图写入 notes/api-contract-checklist.md 骨架
- **自测**：
  - [ ] 列出至少 5 个审批流相关接口语义
  - [ ] 为什么多数项目不让前端直接调 Flowable REST？
  - [ ] （实操）给「请假模块」写 1 页纸接口清单（字段可先 Mock）

### Day 7 · 发起接口与流程变量
- **阶段**：接口期
- **时长**：60min
- **目标**：
  - 设计发起请求体：业务字段 + 流程变量
  - 理解变量如何影响后续网关
- **资源**：
  - 【必读】[Flowable — Variables](https://www.flowable.com/open-source/docs/bpmn/ch02-GettingStarted/#variables)
- **任务**：
  - [ ] 定义 LeaveStartDTO：days, reason, startDate 等
  - [ ] 标注哪些字段进业务表、哪些进流程变量
  - [ ] 写 Mock POST /api/leave 请求/响应 JSON 样例
- **自测**：
  - [ ] days > 3 分支依赖谁、在何时传入？
  - [ ] 发起成功后前端应跳转哪里？需要保存哪些 id？
  - [ ] （实操）用 Postman/curl 或 JSON 文件模拟一次发起

### Day 8 · 待办与审批接口
- **阶段**：接口期
- **时长**：60min
- **目标**：
  - 搞清待办列表与 complete 任务接口
  - 设计同意/驳回参数
- **资源**：
  - [Flowable REST — Tasks](https://www.flowable.com/open-source/docs/bpmn/ch14-REST/#tasks)
- **任务**：
  - [ ] 定义 TodoItem 与 CompleteTaskDTO 类型
  - [ ] Mock GET /tasks/todo 与 POST /tasks/:id/complete
  - [ ] 列出待办为空的 3 种原因及谁排查
- **自测**：
  - [ ] complete 接口必传字段有哪些？
  - [ ] taskId 失效时前端如何表现？
  - [ ] （实操）Mock 环境走通：查待办 → 审批一条

### Day 9 · 详情与审批历史
- **阶段**：接口期
- **时长**：55min
- **目标**：
  - 设计详情合并接口或分接口策略
  - 时间线所需字段清单
- **资源**：
  - [Flowable REST — History](https://www.flowable.com/open-source/docs/bpmn/ch14-REST/#history)
- **任务**：
  - [ ] 定义 LeaveDetail 与 ApprovalHistoryItem 类型
  - [ ] Mock 详情 + 历史接口 JSON
  - [ ] 画时间线 UI 线框（纸笔即可）
- **自测**：
  - [ ] 历史记录按时间正序还是倒序展示？谁决定？
  - [ ] 详情里「当前节点」字段从哪来？
  - [ ] （实操）根据 Mock 数据写出时间线组件 props 设计

### Day 10 · 状态映射与联调清单
- **阶段**：接口期
- **时长**：60min
- **目标**：
  - 业务状态 ↔ UI 文案 ↔ 按钮显隐
  - 完成 api-contract-checklist 笔记
- **资源**：
  - 【必读】本轨道 roadmap — 联调协作 `./roadmap.md#与后端协作说什么话`
- **任务**：
  - [ ] 完成「状态映射表」：草稿/审批中/通过/驳回
  - [ ] 完善 notes/api-contract-checklist.md
  - [ ] Phase 1 小结：Postman/Mock 完整走通主流程
- **自测**：
  - [ ] 驳回后按钮「重新编辑」显示条件是什么？
  - [ ] 联调时 5 个必问后端的问题你能脱口而出吗？
  - [ ] （实操）Phase 1 通关：无 UI 仅用 Mock/Postman 演示全流程

### Day 11 · Vue 骨架与 Mock 接入
- **阶段**：实战期
- **时长**：60min
- **目标**：
  - 在 playground 或独立目录搭审批模块骨架
  - 接入 Mock API 层
- **资源**：
  - 本库 ai-coding — 接口请求模式 `../ai-coding/notes/ai-coding-prompts.md`
- **任务**：
  - [ ] 创建 demos/flowable 目录结构：views, api, types, mock
  - [ ] 注册路由 /demos/flowable（或学习计划内嵌预览）
  - [ ] 接入 Day 7–9 的 Mock 数据，console 能调通
- **自测**：
  - [ ] api / types / views 分层职责是否清晰？
  - [ ] （实操）pnpm dev 启动无报错，Mock 发起接口返回 200

### Day 12 · 发起页
- **阶段**：实战期
- **时长**：75min
- **目标**：
  - 请假表单 + 校验 + 提交
  - 提交后跳转或提示
- **任务**：
  - [ ] 实现 LeaveStartForm：days, reason 等字段
  - [ ] loading / 成功 / 失败反馈
  - [ ] 提交成功后跳转「我发起的」或详情
- **自测**：
  - [ ] 表单校验失败时是否阻止提交？
  - [ ] （实操）浏览器演示：填写并提交一条请假

### Day 13 · 待办列表
- **阶段**：实战期
- **时长**：70min
- **目标**：
  - 待办列表展示与进入审批入口
- **任务**：
  - [ ] TodoList 组件：标题、发起人、时间
  - [ ] 空状态与加载态
  - [ ] 点击进入审批页/抽屉
- **自测**：
  - [ ] （实操）切换 Mock 用户能看到对应待办

### Day 14 · 审批操作
- **阶段**：实战期
- **时长**：70min
- **目标**：
  - 同意/驳回 + 审批意见
- **任务**：
  - [ ] ApprovePanel：同意/驳回按钮 + comment
  - [ ] 调用 complete 接口并刷新列表
  - [ ] 处理任务已被处理的情况
- **自测**：
  - [ ] （实操）完成一条同意 + 一条驳回，列表状态正确

### Day 15 · 详情页（业务信息）
- **阶段**：实战期
- **时长**：60min
- **目标**：
  - 业务字段只读展示 + 当前状态
- **任务**：
  - [ ] LeaveDetail 页面布局
  - [ ] 展示流程状态 badge
  - [ ] 根据状态控制操作按钮显隐
- **自测**：
  - [ ] （实操）三种状态（审批中/通过/驳回）展示正确

### Day 16 · 审批时间线
- **阶段**：实战期
- **时长**：75min
- **目标**：
  - 时间线组件展示历史节点
- **任务**：
  - [ ] ApprovalTimeline 组件
  - [ ] 接入历史 Mock 数据
  - [ ] 与详情页组合布局
- **自测**：
  - [ ] （实操）多级审批后时间线节点数正确

### Day 17 · 我发起的 / 已办 Tab
- **阶段**：实战期
- **时长**：60min
- **目标**：
  - Tab 切换与列表复用
- **任务**：
  - [ ] Tab：待办 / 已办 / 我发起的
  - [ ] 列表组件 props 复用
- **自测**：
  - [ ] （实操）三个 Tab 数据互不串

### Day 18 · 边界态与错误处理
- **阶段**：实战期
- **时长**：55min
- **目标**：
  - 空、错、无权限、已处理等状态
- **任务**：
  - [ ] 网络错误 Toast / 重试
  - [ ] 无权限、任务不存在提示
  - [ ] 对照 roadmap 前端踩坑表逐条自检
- **自测**：
  - [ ] （实操）故意传错 taskId，界面有友好提示

### Day 19 · 体验打磨与联调复盘
- **阶段**：实战期
- **时长**：60min
- **目标**：
  - UI Pass + 联调问题清单
- **任务**：
  - [ ] 走一遍 UI Pass（间距、按钮、loading 一致）
  - [ ] 写联调复盘：3 个搞清的问题 + 1 个待确认
  - [ ] Phase 2 通关：浏览器完整演示
- **自测**：
  - [ ] （实操）录制或口述 2 分钟演示主流程

### Day 20 · 模拟对接（报销审批）
- **阶段**：通关期
- **时长**：90min
- **目标**：
  - 限时交付：换业务域复用模式
- **任务**：
  - [ ] 自拟报销 PRD 摘要（金额分支）
  - [ ] 调整 Mock + 表单字段 + 网关条件说明
  - [ ] 限时完成发起→审批→时间线（可复用组件）
- **自测**：
  - [ ] 换业务域时哪些代码可复用、哪些要改？
  - [ ] （实操）3 小时内可演示报销主流程

### Day 21 · 综合自测与复盘
- **阶段**：通关期
- **时长**：60min
- **目标**：
  - 闭环检验 + 个人速查沉淀
- **任务**：
  - [ ] 重做所有标「不熟」的自测项
  - [ ] 写「审批流前端对接速查」5–10 条
  - [ ] 更新 meta.yaml status / mastery，schedule 打卡归档
- **自测**：
  - [ ] 后端说实例卡在经理节点 — 你前端如何协助排查？
  - [ ] 流程版本升级对已发起单据有何影响？
  - [ ] 为什么用 businessKey？
  - [ ] （实操）通关演示 + 更新 STATUS.md 轨道进度

---

## 定制化说明

在平台学习计划页中：

1. 自测项可标记 **掌握 / 不熟 / 跳过**
2. 标记「不熟」的项会在 **后续聚焦日** 自动生成「针对性巩固」区块
3. 打卡后可在「明日预告」看到将巩固的内容
4. 进度保存在浏览器 localStorage，可随时跳天学习
