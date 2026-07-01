<script setup lang="ts">
import { ref, computed, nextTick, type ComponentPublicInstance } from 'vue';
import ChartInteractiveCard from './ChartInteractiveCard.vue';
import BarDataForm from './BarDataForm.vue';
import BasicLineChart from './basic/BasicLineChart.vue';
import BasicBarChart from './basic/BasicBarChart.vue';
import BasicPieChart from './basic/BasicPieChart.vue';
import BasicScatterChart from './basic/BasicScatterChart.vue';
import {
  buildBarOption,
  buildLineOption,
  buildPieOption,
  buildScatterOption,
} from '../options/basicChartOptions';
import type { ShowcasePanelExpose } from '../types/panel';

defineOptions({ name: 'BasicChartsPanel' });

const lineChartRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const barChartRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const pieChartRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const scatterChartRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);

const lineOption = computed(() => buildLineOption());
const barOption = computed(() => buildBarOption());
const pieOption = computed(() => buildPieOption());
const scatterOption = computed(() => buildScatterOption());

const chartRefMap = {
  line: lineChartRef,
  bar: barChartRef,
  pie: pieChartRef,
  scatter: scatterChartRef,
} as const;

const handlePanelChange = async (chartKey: keyof typeof chartRefMap) => {
  await nextTick();
  chartRefMap[chartKey].value?.resizeCharts();
};

const resizeCharts = () => {
  Object.values(chartRefMap).forEach((chartRef) => {
    chartRef.value?.resizeCharts();
  });
};

defineExpose<ShowcasePanelExpose>({ resizeCharts });
</script>

<template>
  <div class="basics-panel">
    <p class="panel-hint">
      通用 mock · 每图 2～3 组数据 · 均支持查看代码；柱状图已接入编辑数据
    </p>

    <div class="chart-grid">
      <ChartInteractiveCard
        title="折线图"
        description="三渠道访问量对比"
        height="360px"
        aria-label="折线图演示"
        :option="lineOption"
        @panel-change="handlePanelChange('line')"
      >
        <BasicLineChart ref="lineChartRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        title="柱状图"
        description="线上 / 线下销量分组对比"
        height="360px"
        aria-label="柱状图演示"
        :option="barOption"
        @panel-change="handlePanelChange('bar')"
      >
        <template #data-form>
          <BarDataForm />
        </template>
        <BasicBarChart ref="barChartRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        title="饼图"
        description="销售额（内环）与利润（外环）双层占比"
        height="360px"
        aria-label="饼图演示"
        :option="pieOption"
        @panel-change="handlePanelChange('pie')"
      >
        <BasicPieChart ref="pieChartRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        title="散点图"
        description="三班级练习时长与测验分数分布"
        height="360px"
        aria-label="散点图演示"
        :option="scatterOption"
        @panel-change="handlePanelChange('scatter')"
      >
        <BasicScatterChart ref="scatterChartRef" />
      </ChartInteractiveCard>
    </div>
  </div>
</template>

<style scoped>
.basics-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-hint {
  font-size: 0.85rem;
  color: var(--muted);
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>
