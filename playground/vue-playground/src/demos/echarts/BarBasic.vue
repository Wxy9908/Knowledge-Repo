<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';
import * as echarts from 'echarts';

defineOptions({ name: 'BarBasic' });

const chartRef = ref(null);
let chartInstance = null;

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption({
    title: { text: 'ECharts 基础柱状图', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '访问量',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: { color: '#3b82f6' },
      },
    ],
  });

  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
  chartInstance = null;
});
</script>

<template>
  <div class="demo-page">
    <RouterLink to="/demos" class="back-link">← 返回 Demo 列表</RouterLink>
    <h1 class="page-title">基础柱状图</h1>
    <p class="page-subtitle">tracks/echarts · init / setOption / dispose</p>
    <div ref="chartRef" class="chart-container" aria-label="柱状图演示" />
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 900px;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.chart-container {
  width: 100%;
  height: 420px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
}
</style>