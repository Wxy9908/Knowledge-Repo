<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEcharts } from '../../composables/useEcharts';
import { buildStatusBarOption } from '../../options/contract/statusBarOption';
import type { ShowcasePanelExpose } from '../../types/panel';

defineOptions({ name: 'ContractStatusBarChart' });

const chartRef = ref<HTMLElement | null>(null);
const option = computed(() => buildStatusBarOption());
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
