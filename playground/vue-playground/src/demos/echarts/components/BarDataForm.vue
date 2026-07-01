<script setup lang="ts">
import { computed } from 'vue';
import { barChartData } from '../mock/basicChartData';

defineOptions({ name: 'BarDataForm' });

const rowGridStyle = computed(() => ({
  gridTemplateColumns: `40px 1fr ${'88px '.repeat(barChartData.series.length).trim()}`,
}));
</script>

<template>
  <div class="data-form">
    <p class="form-hint">修改后图表实时更新（仅影响本 Demo mock 数据）</p>
    <div class="form-header" :style="rowGridStyle">
      <span class="col-label">产品</span>
      <span class="col-name">名称</span>
      <span
        v-for="series in barChartData.series"
        :key="series.name"
        class="col-value"
      >
        {{ series.name }}
      </span>
    </div>
    <div class="form-grid">
      <div
        v-for="(_category, index) in barChartData.categories"
        :key="index"
        class="form-row"
        :style="rowGridStyle"
      >
        <label class="form-label" :for="`bar-category-${index}`">{{ index + 1 }}</label>
        <input
          :id="`bar-category-${index}`"
          v-model="barChartData.categories[index]"
          type="text"
          class="form-input"
          aria-label="产品名称"
        />
        <input
          v-for="(series, seriesIndex) in barChartData.series"
          :id="`bar-value-${index}-${seriesIndex}`"
          :key="series.name"
          v-model.number="series.values[index]"
          type="number"
          min="0"
          class="form-input form-input-number"
          :aria-label="`${series.name}销量`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-form {
  border-top: 1px solid var(--border);
  background: var(--bg);
  padding: 1rem;
}

.form-hint {
  font-size: 0.8rem;
  color: var(--muted);
  margin-bottom: 0.75rem;
}

.form-header {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: var(--muted);
  text-align: center;
}

.col-label,
.col-name {
  text-align: left;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  gap: 0.5rem;
  align-items: center;
}

.form-label {
  font-size: 0.8rem;
  color: var(--muted);
}

.form-input {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.85rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
}

.form-input-number {
  text-align: right;
}
</style>
