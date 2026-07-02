<script setup lang="ts">
defineOptions({ name: 'ChartLoadingOverlay' });

withDefaults(
  defineProps<{
    loading?: boolean;
    text?: string;
  }>(),
  {
    loading: false,
    text: '加载中…',
  },
);
</script>

<template>
  <Transition name="chart-loading-fade">
    <div
      v-if="loading"
      class="chart-loading-mask"
      role="status"
      aria-live="polite"
      :aria-label="text"
    >
      <div class="chart-loading-content">
        <span class="chart-loading-spinner" aria-hidden="true" />
        <span class="chart-loading-text">{{ text }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.chart-loading-mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  opacity: 0.72;
  backdrop-filter: blur(1px);
}

.chart-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  opacity: 1;
}

.chart-loading-spinner {
  width: 36px;
  height: 36px;
  border: 2px solid var(--accent-dim);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: chart-loading-spin 0.75s linear infinite;
}

.chart-loading-text {
  font-size: 0.8rem;
  color: var(--muted);
}

.chart-loading-fade-enter-active,
.chart-loading-fade-leave-active {
  transition: opacity 0.2s ease;
}

.chart-loading-fade-enter-from,
.chart-loading-fade-leave-to {
  opacity: 0;
}

@keyframes chart-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
