import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    demoTitle?: string;
    demoTrack?: string;
  }
}
