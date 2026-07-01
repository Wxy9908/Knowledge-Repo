<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineOptions({ name: 'BarBasic' });
</script>

<template>
  <div class="demo-page">
    <RouterLink to="/demos" class="back-link">← 返回 Demo 列表</RouterLink>
    <h1 class="page-title">ECharts 演示</h1>
    <p class="page-subtitle">tracks/echarts · 开发中</p>
    <div class="placeholder panel">
      <p>ECharts Showcase 将在此搭建（阶段 3 起）。</p>
      <p class="hint">技术栈：Vue 3 + TypeScript + ECharts 6.x</p>
    </div>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 900px;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.placeholder {
  padding: 2rem;
  text-align: center;
  color: var(--muted);
}

.hint {
  margin-top: 0.75rem;
  font-size: 0.85rem;
}
</style>
