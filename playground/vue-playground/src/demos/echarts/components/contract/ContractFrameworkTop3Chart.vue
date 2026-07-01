<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEcharts } from '../../composables/useEcharts';
import { buildFrameworkTop3Option } from '../../options/contract/frameworkTop3Option';
import type { ShowcasePanelExpose } from '../../types/panel';

defineOptions({ name: 'ContractFrameworkTop3Chart' });

const chartRef = ref<HTMLElement | null>(null);
const option = computed(() => buildFrameworkTop3Option());
const { resize } = useEcharts(chartRef, option);

defineExpose<ShowcasePanelExpose>({ resizeCharts: resize });
</script>

<template>
  <div ref="chartRef" class="chart-host" />
</template>

<style scoped>
.chart-host {
  width: 100%;
  height: 100%;
}
</style>
