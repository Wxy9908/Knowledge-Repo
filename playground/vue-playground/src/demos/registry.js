export const demoRegistry = [
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
    title: '基础柱状图',
    path: '/demos/echarts/bar-basic',
    component: () => import('./echarts/BarBasic.vue'),
  },
];
