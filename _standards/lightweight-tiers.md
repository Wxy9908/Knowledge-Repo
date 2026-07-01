# 轻量分级原则

## 默认规则

- 新建 track 默认 `depth: light`
- 一个知识点默认 **一篇 md**
- 代码示例优先写在 md 代码块内

## 三级 depth

| depth | 结构 |
|-------|------|
| light | `meta.yaml` + `notes/*.md` |
| standard | + `roadmap.md` 或 `brief.md` |
| deep | + `units/`（文档与复盘）；代码项目在 `playground/` |

## Demo 放哪

| 场景 | 位置 |
|------|------|
| 独立知识点（ECharts 等） | `playground/vue-playground/src/demos/{track}/` |
| 课程型练习页面 | `playground/vue-playground` 内路由，如 `/todos` |

**tracks/ 下不保留任何 Vue 项目。** 全库仅一个 node 项目：`playground/vue-playground`。

## 升级条件

仅当需要多轮动手验收时，才从 `notes/` 拆出 `units/` 或建 demo 项目。
