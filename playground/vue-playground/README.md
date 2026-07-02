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

`predev` / `prebuild` 会自动运行 `../../scripts/sync-catalog.mjs` 同步 tracks 数据。

## 路由

- `/` — 知识库总览 Dashboard
- `/tracks/:id` — 轨道详情
- `/demos` — 技术 Demo 列表

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
