# React 项目搭建

> tags: react | updated: 2026-06-30 | mastery: proficient

## 是什么

React 单页应用常用 Create React App 或 Vite 脚手架。学习阶段了解目录结构即可，不必为每个知识点单独建项目。

## 怎么用

```bash
# Vite（推荐）
npm create vite@latest my-app -- --template react

# Create React App（旧项目常见）
npx create-react-app my-app
```

典型 `src/` 结构：

```text
src/
├── App.js          # 根组件
├── index.js        # 入口
├── components/     # 可复用组件
└── views/          # 页面级组件
```

## 踩坑

- CRA 已不推荐用于新项目，已有 CRA 项目可继续维护
- 学习 Hooks 时用一个 App 切换不同 demo 即可，不必多开项目

## 复盘

- 能否讲清楚：入口如何挂载 React、组件即函数
- 何时使用：需要 React 生态的 SPA 时
