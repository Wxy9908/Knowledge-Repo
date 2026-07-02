import {
  computed,
  inject,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue';
import type { EChartsOption } from 'echarts';
import { DASHBOARD_RELOAD_KEY } from '../constants/chart';
import {
  UPDATE_ANIMATION,
  waitForChartPaint,
  zeroDataPatch,
} from '../utils/chartAnimation';
import { useEcharts, type EchartsLoadingOpts } from './useEcharts';
import { getThemeColors } from '../utils/themeColors';
import { useTheme } from '../../../composables/useTheme';

const getLoadingOpts = (): EchartsLoadingOpts => {
  const colors = getThemeColors();
  return {
    text: '加载中…',
    color: '#3b82f6',
    textColor: colors.muted,
    maskColor: colors.theme === 'light' ? 'rgba(248, 250, 252, 0.72)' : 'rgba(15, 20, 25, 0.72)',
  };
};

export interface UseAsyncContractChartConfig<T> {
  buildEmptyOption: () => EChartsOption;
  setDataOption: (data: T) => EChartsOption;
  buildOption: (data: T) => EChartsOption;
  fetchData: () => Promise<T>;
  emptyData: T;
  hasData?: (data: T) => boolean;
  useZeroDataTransition?: boolean;
}

const defaultHasData = <T>(data: T): boolean => {
  if (Array.isArray(data)) return data.length > 0;
  return data !== null && data !== undefined;
};

/**
 * 合同图表异步加载（对齐 AsyncDynamicDataDemo）
 *
 * init + setOption(空骨架) → setOption(清空) → showLoading
 * → fetch → hideLoading → setOption(类目+0) → setOption(真实值)
 */
export const useAsyncContractChart = <T>(config: UseAsyncContractChartConfig<T>) => {
  const reloadKey = inject(DASHBOARD_RELOAD_KEY, ref(0));
  const { theme } = useTheme();
  const chartRef = ref<HTMLElement | null>(null);
  const chartData = ref<T | null>(null);
  const hasData = config.hasData ?? defaultHasData;
  const useZeroDataTransition = config.useZeroDataTransition ?? true;
  let loadToken = 0;
  let skeletonReady = false;

  const option = computed<EChartsOption>(() =>
    chartData.value !== null
      ? config.buildOption(chartData.value)
      : config.buildEmptyOption(),
  );

  const { setOption, showLoading, hideLoading, resize } = useEcharts(chartRef);

  const ensureSkeleton = async (): Promise<boolean> => {
    await nextTick();
    if (skeletonReady) return true;
    if (!setOption(config.buildEmptyOption(), { notMerge: true })) return false;
    skeletonReady = true;
    return true;
  };

  const fillDataWithAnimation = async (data: T) => {
    const dataPatch = config.setDataOption(data);

    if (!hasData(data)) {
      setOption(dataPatch);
      return;
    }

    if (!useZeroDataTransition) {
      setOption({ ...UPDATE_ANIMATION, ...dataPatch });
      return;
    }

    setOption(zeroDataPatch(dataPatch));
    await waitForChartPaint();
    setOption({ ...UPDATE_ANIMATION, ...dataPatch });
  };

  const loadData = async () => {
    if (!(await ensureSkeleton())) return;

    const token = ++loadToken;

    setOption(config.setDataOption(config.emptyData));
    chartData.value = null;
    showLoading(getLoadingOpts());

    try {
      const data = await config.fetchData();
      if (token !== loadToken) return;

      hideLoading();
      await fillDataWithAnimation(data);
      chartData.value = data;
    } catch {
      if (token !== loadToken) return;
      hideLoading();
      chartData.value = null;
    }
  };

  onMounted(() => {
    void loadData();
  });

  watch(reloadKey, (value) => {
    if (value === 0) return;
    void loadData();
  });

  // 监听主题变化，更新图表配置
  watch(theme, () => {
    if (chartData.value !== null) {
      setOption(config.buildOption(chartData.value));
    } else {
      setOption(config.buildEmptyOption());
    }
  });

  return {
    chartRef,
    resize,
    reload: loadData,
    option,
  };
};
