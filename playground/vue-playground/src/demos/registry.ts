import type { Component } from 'vue';
import type { RouteMeta } from 'vue-router';

export interface DemoEntry {
  track: string;
  id: string;
  title: string;
  path: string;
  meta?: RouteMeta;
  component: () => Promise<{ default: Component }>;
}

export const demoRegistry: DemoEntry[] = [
  {
    track: 'ai-coding',
    id: 'todos',
    title: 'Todo + Mock API',
    path: '/todos',
    meta: { requiresAuth: true },
    component: () => import('./ai-coding/TodosView.vue'),
  },
  {
    track: 'echarts',
    id: 'bar-basic',
    title: 'ECharts 演示（开发中）',
    path: '/demos/echarts/bar-basic',
    component: () => import('./echarts/BarBasic.vue'),
  },
];
