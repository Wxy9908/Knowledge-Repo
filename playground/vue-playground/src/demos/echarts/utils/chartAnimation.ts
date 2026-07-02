import type { EChartsOption, SeriesOption } from 'echarts';

export const UPDATE_ANIMATION = {
  animation: true,
  animationDuration: 1000,
  animationDurationUpdate: 1000,
  animationEasingUpdate: 'cubicOut' as const,
};

const zeroDataValue = (item: unknown): unknown => {
  if (typeof item === 'number') return 0;
  if (item && typeof item === 'object' && 'value' in item) {
    return { ...item, value: 0 };
  }
  return item;
};

const zeroSeriesData = (data: unknown): unknown => {
  if (!Array.isArray(data)) return data;
  return data.map(zeroDataValue);
};

/** 局部 patch 保留轴类目，仅将 series 数值清零（过渡动画第一步） */
export const zeroDataPatch = (patch: EChartsOption): EChartsOption => {
  if (!Array.isArray(patch.series)) return patch;

  return {
    ...patch,
    series: patch.series.map((item) => ({
      ...item,
      data: item.data !== undefined ? zeroSeriesData(item.data) : item.data,
    })) as SeriesOption[],
  };
};

/** 等待浏览器完成绘制，确保两步 setOption 之间有一帧可见的 0 值状态 */
export const waitForChartPaint = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

/**
 * 保留坐标轴 / 图例结构，将 series 数值清零
 */
export const toEmptyChartOption = (option: EChartsOption): EChartsOption => {
  const series = Array.isArray(option.series)
    ? option.series.map((item) => ({
        ...item,
        data: item.data !== undefined ? zeroSeriesData(item.data) : item.data,
      })) as SeriesOption[]
    : option.series;

  return {
    ...option,
    series,
  };
};
