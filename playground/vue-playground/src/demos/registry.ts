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
    id: 'showcase',
    title: 'ECharts 演示中心',
    path: '/demos/echarts/showcase',
    component: () => import('./echarts/EchartsShowcase.vue'),
  },
];
