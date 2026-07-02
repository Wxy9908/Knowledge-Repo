<script setup lang="ts">
import { computed } from 'vue';
import ChartLoadingOverlay from './ChartLoadingOverlay.vue';

defineOptions({ name: 'ChartCard' });

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    height?: string;
    ariaLabel?: string;
    loading?: boolean;
  }>(),
  {
    description: '',
    height: '320px',
    ariaLabel: '',
    loading: false,
  },
);

const chartAriaLabel = computed(() => props.ariaLabel || props.title);
</script>

<template>
  <div class="chart-card panel">
    <div class="chart-card-header">
      <div class="chart-card-titles">
        <h3 class="chart-card-title">{{ title }}</h3>
        <p v-if="description" class="chart-card-desc">{{ description }}</p>
      </div>
      <div v-if="$slots.toolbar" class="chart-card-toolbar">
        <slot name="toolbar" />
      </div>
    </div>
    <div
      class="chart-container"
      :style="{ height }"
      :aria-label="chartAriaLabel"
      role="img"
    >
      <slot />
      <ChartLoadingOverlay :loading="loading" />
    </div>
    <div v-if="$slots.footer" class="chart-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  margin-bottom: 0;
  padding: 0;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.chart-card:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.chart-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid var(--border);
}

.chart-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.chart-card-desc {
  font-size: 0.8rem;
  color: var(--muted);
}

.chart-card-toolbar {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
}

.chart-container {
  position: relative;
  width: 100%;
}
</style>
