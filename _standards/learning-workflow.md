# 统一学习工作流

```text
立项 → 学习 → 产出 → 复盘 → 更新 catalog → 间隔复习
```

1. 从 `_templates/` 复制脚手架，填写 `meta.yaml`
2. 笔记写入 `tracks/{id}/notes/`
3. 可运行 demo 写入 `playground/vue-playground/src/demos/`
4. 复盘写在 md 文末或 `units/xx/review.md`
5. 运行 `npm run sync-catalog` 更新 Dashboard 数据
6. 按 `meta.yaml` 中 `next_review` 定期回顾
