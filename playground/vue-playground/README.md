# vue-playground

知识库 Dashboard + 技术 Demo 沙盒（**Vue 3 + TypeScript + Vite**）。

## 命令

```bash
cd playground\vue-playground
pnpm install   # 或 npm install
pnpm dev       # http://localhost:5173/
pnpm build     # vue-tsc + vite build
pnpm typecheck # 仅类型检查
```

`pnpm dev` 启动后会**自动监听** `tracks/` 与 `catalog.yaml` 的变更并同步到 `src/generated/`（保存 md / meta.yaml 后约 0.5s 内刷新数据）。终端会看到 `[sync-catalog] sync after change: …`。

未开 dev 时，可在仓库根目录运行：

```bash
npm run sync-catalog:watch
```

**笔记同步**：…

- `/` — 知识库总览 Dashboard
- `/tracks/:id` — 轨道详情
- `/tracks/:id/schedule` — 学习计划（打卡进度在浏览器 localStorage）
- `/tracks/:id/notes/:slug` — 笔记正文（由 `sync-catalog` 从 `tracks/*/notes/*.md` 同步）
- `/demos` — 技术 Demo 列表

**笔记同步**：在仓库根目录运行 `npm run sync-catalog`（`pnpm dev` 前会自动执行）。笔记是否在网页展示由 `meta.yaml` 里每条笔记的 `platform: true/false` 控制；`platform: false` 的仅保留在仓库本地。

## 新增 Demo

在 `src/demos/{track}/` 添加 `.vue` 组件（`<script setup lang="ts">`），在 `src/demos/registry.ts` 注册路由。

## 目录约定

```text
src/
├── types/          # 共享 TS 类型（catalog、todo 等）
├── demos/registry.ts
├── router/index.ts
└── main.ts
```
