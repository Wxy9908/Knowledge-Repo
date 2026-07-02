<script setup lang="ts">
import { watch } from 'vue';
import type { EChartsOption } from 'echarts';
import { useAsyncContractChart } from '../../composables/useAsyncContractChart';
import { fetchContractChartData } from '../../mock/contractApi';
import { buildEmptyStatusBarOption, buildStatusBarOption, setStatusBarOption } from '../../options/contract/statusBarOption';
import type { ShowcasePanelExpose } from '../../types/panel';

defineOptions({ name: 'ContractStatusBarChart' });

const emit = defineEmits<{
  optionChange: [option: EChartsOption];
}>();

const { chartRef, resize, option } = useAsyncContractChart({
  buildEmptyOption: buildEmptyStatusBarOption,
  setDataOption: setStatusBarOption,
  buildOption: buildStatusBarOption,
  fetchData: () => fetchContractChartData('status'),
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
