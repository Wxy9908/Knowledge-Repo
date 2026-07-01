# Knowledge Repo

个人学习知识库：轻量文档沉淀 + 可视化 Dashboard + 技术 Demo 沙盒。

## 快速开始

```bash
# 同步索引数据并启动 Dashboard
cd playground/vue-playground
pnpm install
pnpm dev
```

浏览器打开 `http://localhost:5173/` 查看知识库总览。

## 目录说明

| 路径 | 用途 |
|------|------|
| `tracks/` | 学习轨道（文档 + 元数据） |
| `catalog.yaml` | 全局索引（机器可读） |
| `STATUS.md` | 当前学习状态 |
| `_standards/` | 规范文档 |
| `_templates/` | 新建轨道/笔记模板 |
| `playground/vue-playground/` | Dashboard + 全部 demo（路由如 `/todos`） |
| `scripts/` | 工具脚本（catalog 同步等） |

## 新增学习内容

1. 复制 `_templates/track-light/` 到 `tracks/your-track/`
2. 填写 `meta.yaml`，在 `notes/` 写笔记
3. 更新 `catalog.yaml`（或运行 `node scripts/sync-catalog.mjs` 自动扫描）
4. 需可运行 demo 时，在 `playground/vue-playground/src/demos/` 添加组件

详见 [`_standards/lightweight-tiers.md`](_standards/lightweight-tiers.md)。
