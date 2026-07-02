<script setup lang="ts">
import { watch } from 'vue';
import type { EChartsOption } from 'echarts';
import { useAsyncContractChart } from '../../composables/useAsyncContractChart';
import { fetchContractChartData } from '../../mock/contractApi';
import { buildEmptyDeptBarOption, buildDeptBarOption, setDeptBarOption } from '../../options/contract/deptBarOption';
import type { ShowcasePanelExpose } from '../../types/panel';

defineOptions({ name: 'ContractDeptBarChart' });

const emit = defineEmits<{
  optionChange: [option: EChartsOption];
}>();

const { chartRef, resize, option } = useAsyncContractChart({
  buildEmptyOption: buildEmptyDeptBarOption,
  setDataOption: setDeptBarOption,
  buildOption: buildDeptBarOption,
  fetchData: () => fetchContractChartData('dept'),
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
