# vue-playground

知识库 Dashboard + 技术 Demo 沙盒。

## 命令

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build
```

`predev` / `prebuild` 会自动运行 `../../scripts/sync-catalog.mjs` 同步 tracks 数据。

## 路由

- `/` — 知识库总览 Dashboard
- `/tracks/:id` — 轨道详情
- `/demos` — 技术 Demo 列表

## 新增 Demo

在 `src/demos/{track}/` 添加 `.vue` 组件，并在 router 注册。