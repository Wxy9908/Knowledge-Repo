import {
  onMounted,
  onBeforeUnmount,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  toValue,
} from 'vue';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts';

export interface UseEchartsReturn {
  setOption: (option: EChartsOption, opts?: SetOptionOpts) => void;
  resize: () => void;
  dispose: () => void;
  getInstance: () => ECharts | null;
}

/**
 * ECharts 在 Vue 中的生命周期封装
 *
 * init → setOption → resize（窗口/TAB 切换）→ dispose（防内存泄漏）
 * 传入 option 时自动 watch，数据变化会触发 setOption（Tab 2 编辑数据依赖此能力）
 */
export const useEcharts = (
  containerRef: Ref<HTMLElement | null>,
  option?: MaybeRefOrGetter<EChartsOption | undefined>,
): UseEchartsReturn => {
  let chartInstance: ECharts | null = null;

  const initChart = () => {
    if (!containerRef.value || chartInstance) return;

    chartInstance = echarts.init(containerRef.value);
    const initialOption = option ? toValue(option) : undefined;
    if (initialOption) {
      chartInstance.setOption(initialOption);
    }
  };

  const setOption = (nextOption: EChartsOption, opts?: SetOptionOpts) => {
    if (!chartInstance) return;
    chartInstance.setOption(nextOption, opts);
  };

  const resize = () => {
    chartInstance?.resize();
  };

  const dispose = () => {
    chartInstance?.dispose();
    chartInstance = null;
  };

  const handleWindowResize = () => {
    resize();
  };

  onMounted(() => {
    initChart();
    window.addEventListener('resize', handleWindowResize);

    if (option) {
      // deep: true 使 reactive mock 深层字段变化也能更新图表
      watch(
        () => toValue(option),
        (nextOption) => {
          if (!chartInstance || !nextOption) return;
          chartInstance.setOption(nextOption);
        },
        { deep: true },
      );
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleWindowResize);
    dispose();
  });

  return {
    setOption,
    resize,
    dispose,
    getInstance: () => chartInstance,
  };
};
