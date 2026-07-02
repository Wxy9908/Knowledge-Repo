<script setup lang="ts">
import { watch } from 'vue';
import type { EChartsOption } from 'echarts';
import { useAsyncContractChart } from '../../composables/useAsyncContractChart';
import { fetchContractChartData } from '../../mock/contractApi';
import {
  buildEmptyFrameworkTop3Option,
  buildFrameworkTop3Option,
  setFrameworkTop3Option,
} from '../../options/contract/frameworkTop3Option';
import type { ShowcasePanelExpose } from '../../types/panel';

defineOptions({ name: 'ContractFrameworkTop3Chart' });

const emit = defineEmits<{
  optionChange: [option: EChartsOption];
}>();

const { chartRef, resize, option } = useAsyncContractChart({
  buildEmptyOption: buildEmptyFrameworkTop3Option,
  setDataOption: setFrameworkTop3Option,
  buildOption: buildFrameworkTop3Option,
  fetchData: () => fetchContractChartData('framework'),
  emptyData: [],
});

watch(option, (nextOption) => emit('optionChange', nextOption), { immediate: true, deep: true });

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
