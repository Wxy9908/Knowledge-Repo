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
  background: rgba(15, 20, 25, 0.72);
  backdrop-filter: blur(1px);
}

.chart-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
}

.chart-loading-spinner {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(59, 130, 246, 0.18);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: chart-loading-spin 0.75s linear infinite;
}

.chart-loading-text {
  font-size: 0.8rem;
  color: #8b9cb3;
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
