# 文件夹结构

```text
tracks/{id}/
├── meta.yaml       # 必填
├── notes/          # 默认笔记位置
├── roadmap.md      # standard/deep 可选
├── brief.md        # work-assignment 可选
├── STATUS.md       # 活跃 track 可选
├── units/          # deep 可选（仅文档）
└── demos/          # 已废弃：Vue 项目放 playground/

playground/
└── vue-playground/   # Dashboard + 所有 demo（含 /todos、ECharts 等）
```

## 命名

- track id：kebab-case（如 `ai-coding`）
- 笔记文件：kebab-case.md
- unit 目录：`01-xxx` 序号前缀
