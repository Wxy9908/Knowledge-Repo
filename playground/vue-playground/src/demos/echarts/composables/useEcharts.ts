import {
  nextTick,
  onMounted,
  onBeforeUnmount,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  toValue,
} from 'vue';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts';

export interface EchartsLoadingOpts {
  text?: string;
  color?: string;
  textColor?: string;
  maskColor?: string;
  zlevel?: number;
}

export interface UseEchartsReturn {
  setOption: (option: EChartsOption, opts?: SetOptionOpts) => boolean;
  showLoading: (opts?: EchartsLoadingOpts) => void;
  hideLoading: () => void;
  resize: () => void;
  dispose: () => void;
  getInstance: () => ECharts | null;
}

/**
 * ECharts 在 Vue 中的生命周期封装
 *
 * init → setOption → resize（窗口/TAB/容器变化）→ dispose
 * 容器宽高为 0 时通过 ResizeObserver 延迟 init
 */
export const useEcharts = (
  containerRef: Ref<HTMLElement | null>,
  option?: MaybeRefOrGetter<EChartsOption | undefined>,
): UseEchartsReturn => {
  let chartInstance: ECharts | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let isFirstApply = true;

  const canInit = (): boolean => {
    if (!containerRef.value) return false;
    const { clientWidth, clientHeight } = containerRef.value;
    return clientWidth > 0 && clientHeight > 0;
  };

  const tryInitChart = (): boolean => {
    if (chartInstance) return true;
    if (!canInit()) return false;
    chartInstance = echarts.init(containerRef.value!);
    return true;
  };

  const scheduleResize = () => {
    window.requestAnimationFrame(() => {
      chartInstance?.resize();
    });
  };

  const applyOption = async () => {
    if (!tryInitChart()) return;

    const nextOption = option ? toValue(option) : undefined;
    if (!nextOption || !chartInstance) return;

    chartInstance.setOption(nextOption, { notMerge: isFirstApply });
    isFirstApply = false;

    await nextTick();
    scheduleResize();
  };

  const setOption = (nextOption: EChartsOption, opts?: SetOptionOpts): boolean => {
    if (!tryInitChart()) return false;
    chartInstance!.setOption(nextOption, opts);
    scheduleResize();
    return true;
  };

  const showLoading = (opts?: EchartsLoadingOpts) => {
    if (!tryInitChart()) return;
    chartInstance?.showLoading(opts);
  };

  const hideLoading = () => {
    chartInstance?.hideLoading();
  };

  const resize = () => {
    if (!chartInstance) {
      void applyOption();
      return;
    }
    chartInstance.resize();
  };

  const dispose = () => {
    chartInstance?.dispose();
    chartInstance = null;
    isFirstApply = true;
  };

  const handleWindowResize = () => {
    resize();
  };

  onMounted(() => {
    void applyOption();
    window.addEventListener('resize', handleWindowResize);

    if (containerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        if (!chartInstance && canInit()) {
          void applyOption();
          return;
        }
        if (chartInstance) {
          scheduleResize();
        }
      });
      resizeObserver.observe(containerRef.value);
    }

    if (option) {
      watch(
        () => toValue(option),
        () => {
          void applyOption();
        },
        { deep: true },
      );
    }
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    window.removeEventListener('resize', handleWindowResize);
    dispose();
  });

  return {
    setOption,
    showLoading,
    hideLoading,
    resize,
    dispose,
    getInstance: () => chartInstance,
  };
};
