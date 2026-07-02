<script setup lang="ts">
defineOptions({ name: 'DashboardLoadingSkeleton' });
</script>

<template>
  <div class="dashboard-skeleton" aria-busy="true" aria-label="合同看板加载中">
    <div class="skeleton-toolbar">
      <span class="skeleton-spinner" aria-hidden="true" />
      <span class="skeleton-message">正在加载合同看板数据…</span>
    </div>

    <div class="kpi-row">
      <div v-for="index in 4" :key="`kpi-${index}`" class="skeleton-card kpi-skeleton" />
    </div>

    <div class="dashboard-grid">
      <div v-for="index in 6" :key="`chart-${index}`" class="skeleton-card chart-skeleton" />
      <div class="skeleton-card chart-skeleton chart-skeleton--wide" />
    </div>
  </div>
</template>

<style scoped>
.dashboard-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-toolbar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--muted);
  font-size: 0.85rem;
}

.skeleton-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.skeleton-message {
  color: var(--muted);
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.skeleton-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}

.skeleton-card::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.08),
    transparent
  );
  animation: shimmer 1.4s ease-in-out infinite;
}

.kpi-skeleton {
  height: 88px;
}

.chart-skeleton {
  height: 300px;
}

.chart-skeleton--wide {
  grid-column: 1 / -1;
  height: 260px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .kpi-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .chart-skeleton--wide {
    grid-column: 1 / -1;
  }
}
</style>
