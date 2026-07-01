<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEcharts } from '../../composables/useEcharts';
import { buildServiceExpiryOption } from '../../options/contract/serviceExpiryOption';
import type { ShowcasePanelExpose } from '../../types/panel';

defineOptions({ name: 'ContractServiceExpiryChart' });

const chartRef = ref<HTMLElement | null>(null);
const option = computed(() => buildServiceExpiryOption());
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
