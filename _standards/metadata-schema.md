# 元数据 schema（meta.yaml）

```yaml
id: track-id              # 必填，与目录名一致
depth: light              # light | standard | deep
category: tech-learning   # tech-learning | work-assignment | exploration
title: 显示标题
status: in_progress       # planned | in_progress | paused | completed | archived
tags: [tag1, tag2]
mastery: 0.5              # 0-1，可选
started: 2026-01-01
updated: 2026-06-30
last_reviewed: 2026-06-30
next_review: 2026-07-30
notes:                    # 可选，笔记索引
  - path: notes/xxx.md
    title: 标题
artifacts:                # 可选，可运行 demo（路由在 playground）
  - type: demo
    route: /demos/echarts/showcase
    title: 显示标题
    description: 简短说明
related: [other-track]
```

运行 `npm run sync-catalog` 后数据会同步到 Dashboard。
