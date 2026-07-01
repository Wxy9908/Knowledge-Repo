import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import TrackDetail from '@/views/TrackDetail.vue';
import DemoIndex from '@/views/DemoIndex.vue';
import { demoRegistry } from '@/demos/registry.js';
import { useUserStore } from '@/demos/ai-coding/stores/user';

const demoRoutes = demoRegistry.map((demo) => ({
  path: demo.path,
  name: `demo-${demo.track}-${demo.id}`,
  component: demo.component,
  meta: { demoTitle: demo.title, demoTrack: demo.track, ...demo.meta },
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/tracks/:id', name: 'track-detail', component: TrackDetail, props: true },
    { path: '/demos', name: 'demos', component: DemoIndex },
    { path: '/login', name: 'login', component: () => import('@/demos/ai-coding/LoginView.vue') },
    ...demoRoutes,
  ],
});

router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.path === '/login' && userStore.isLoggedIn) {
    return '/todos';
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return '/login';
  }

  return true;
});

export default router;
