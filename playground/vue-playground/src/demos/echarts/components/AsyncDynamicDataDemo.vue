<script setup lang="ts">
/**
 * ECharts 官方「异步数据的加载与动态更新」示例 — 单文件直写，不依赖项目内封装
 *
 * 流程：init → setOption(空坐标轴) → showLoading → 异步取数 → hideLoading → setOption(填数)
 *
 * @see https://echarts.apache.org/handbook/zh/how-to/data/dynamic-data
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

defineOptions({ name: 'AsyncDynamicDataDemo' });

const props = withDefaults(
  defineProps<{
    active?: boolean;
    reloadKey?: number;
  }>(),
  {
    active: false,
    reloadKey: 0,
  },
);

const chartRef = ref<HTMLElement | null>(null);

let chartInstance: ECharts | null = null;
let loadToken = 0;
let hasStarted = false;

interface AsyncBarPayload {
  categories: string[];
  values: number[];
}

const fetchAsyncBarData = (): Promise<AsyncBarPayload> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        categories: ['服务合同', '框架合同', '采购合同', '劳务合同', '租赁合同', '其他'],
        values: [128, 96, 72, 54, 38, 22],
      });
    }, 1200);
  });

const canInitChart = (): boolean => {
  if (!chartRef.value) return false;
  const { clientWidth, clientHeight } = chartRef.value;
  return clientWidth > 0 && clientHeight > 0;
};

const initChart = (): boolean => {
  if (chartInstance) return true;
  if (!canInitChart()) return false;

  chartInstance = echarts.init(chartRef.value!);
  chartInstance.setOption({
    title: {
      text: '异步数据加载示例',
    },
    tooltip: {},
    legend: {
      data: ['签约量'],
    },
    xAxis: {
      data: [],
    },
    yAxis: {},
    series: [
      {
        name: '签约量',
        type: 'bar',
        data: [],
      },
    ],
  });
  return true;
};

const loadAsyncData = async () => {
  if (!chartInstance) return;

  const token = ++loadToken;

  chartInstance.setOption({
    xAxis: {
      data: [],
    },
    series: [
      {
        name: '签约量',
        data: [],
      },
    ],
  });

  chartInstance.showLoading({
    text: '加载中…',
    color: '#3b82f6',
    textColor: '#8b9cb3',
    maskColor: 'rgba(15, 20, 25, 0.72)',
  });

  try {
    const data = await fetchAsyncBarData();
    if (token !== loadToken || !chartInstance) return;

    chartInstance.hideLoading();
    chartInstance.setOption({
      xAxis: {
        data: data.categories,
      },
      series: [
        {
          name: '签约量',
          data: data.values,
        },
      ],
    });
  } catch {
    if (token !== loadToken || !chartInstance) return;
    chartInstance.hideLoading();
  }
};

const resizeCharts = () => {
  chartInstance?.resize();
};

const disposeChart = () => {
  chartInstance?.dispose();
  chartInstance = null;
};

const handleWindowResize = () => {
  resizeCharts();
};

const startDemo = async () => {
  if (hasStarted || !props.active) return;

  await nextTick();
  if (!initChart()) return;

  hasStarted = true;
  void loadAsyncData();
};

watch(
  () => props.active,
  (isActive) => {
    if (!isActive) return;

    if (!hasStarted) {
      void startDemo();
      return;
    }

    resizeCharts();
  },
);

watch(
  () => props.reloadKey,
  (value) => {
    if (value === 0 || !hasStarted) return;
    void loadAsyncData();
  },
);

onMounted(() => {
  window.addEventListener('resize', handleWindowResize);
  void startDemo();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowResize);
  disposeChart();
});

defineExpose({ resizeCharts });
</script>

<template>
  <section class="async-demo panel" aria-label="ECharts 异步数据加载示例">
    <header class="async-demo-header">
      <div>
        <h3 class="async-demo-title">异步数据加载</h3>
        <p class="async-demo-desc">
          空坐标轴 → showLoading → 接口返回 → hideLoading → setOption 填数（
          <a
            class="async-demo-link"
            href="https://echarts.apache.org/handbook/zh/how-to/data/dynamic-data"
            target="_blank"
            rel="noopener noreferrer"
          >官方文档</a>）
        </p>
      </div>
    </header>
    <div ref="chartRef" class="async-demo-chart" />
  </section>
</template>

<style scoped>
.async-demo {
  margin-bottom: 0;
}

.async-demo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.async-demo-title {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.async-demo-desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
}

.async-demo-link {
  color: var(--accent);
  text-decoration: none;
}

.async-demo-link:hover {
  text-decoration: underline;
}

.async-demo-chart {
  width: 100%;
  height: 320px;
}
</style>
