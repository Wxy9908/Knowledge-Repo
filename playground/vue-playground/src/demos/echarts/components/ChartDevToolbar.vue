<script setup lang="ts">
import type { ChartDevPanelMode } from '../types/chartDevTools';

defineOptions({ name: 'ChartDevToolbar' });

defineProps<{
  activePanel: ChartDevPanelMode;
  showDataForm?: boolean;
}>();

const emit = defineEmits<{
  toggleCode: [];
  toggleData: [];
}>();

const handleToggleCode = () => {
  emit('toggleCode');
};

const handleToggleData = () => {
  emit('toggleData');
};
</script>

<template>
  <div class="chart-dev-toolbar">
    <button
      type="button"
      class="toolbar-btn"
      :class="{ active: activePanel === 'code' }"
      title="查看 ECharts Option 代码"
      @click="handleToggleCode"
    >
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
      <span>查看代码</span>
    </button>
    <button
      v-if="showDataForm"
      type="button"
      class="toolbar-btn"
      :class="{ active: activePanel === 'data' }"
      title="编辑图表 Mock 数据"
      @click="handleToggleData"
    >
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      <span>编辑数据</span>
    </button>
  </div>
</template>

<style scoped>
.chart-dev-toolbar {
  display: flex;
  gap: 0.5rem;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon {
  width: 14px;
  height: 14px;
}

.toolbar-btn:hover {
  border-color: var(--accent);
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.toolbar-btn.active {
  border-color: var(--accent);
  color: var(--text);
  background: var(--accent-dim);
  box-shadow: 0 0 8px var(--accent-dim);
}
</style>
