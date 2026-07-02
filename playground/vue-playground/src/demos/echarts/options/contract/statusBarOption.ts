import type { EChartsOption } from 'echarts';
import type { StatusDistributionItem } from '../../mock/contractAggregates';
import { getChartBaseStyle } from '../../utils/chartBase';

const PRIMARY = '#3b82f6';
const SERIES_ID = 'contract-status-count';

const BAR_ANIMATION = {
  animationDuration: 1000,
  animationDurationUpdate: 1000,
  animationEasingUpdate: 'cubicOut' as const,
};

const toStatusBarData = (data: StatusDistributionItem[]) =>
  data.map((item) => ({
    name: item.label,
    value: item.count,
  }));

const createStatusBarOption = (data: StatusDistributionItem[] = []): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: [PRIMARY],
    textStyle: base.textStyle,
    tooltip: {
      ...base.tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: 48, right: 16, top: 24, bottom: 48 },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.label),
      axisLabel: { ...base.textStyle, fontSize: 10, rotate: 20 },
      axisLine: base.axisLineStyle,
    },
    yAxis: {
      type: 'value',
      name: '份',
      nameTextStyle: base.textStyle,
      axisLabel: base.textStyle,
      splitLine: base.splitLineStyle,
    },
    series: [
      {
        id: SERIES_ID,
        name: '合同数量',
        type: 'bar',
        ...BAR_ANIMATION,
        data: toStatusBarData(data),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
};

export const buildEmptyStatusBarOption = (): EChartsOption => createStatusBarOption([]);

export const setStatusBarOption = (data: StatusDistributionItem[]): EChartsOption => ({
  xAxis: {
    data: data.map((item) => item.label),
  },
  series: [
    {
      id: SERIES_ID,
      name: '合同数量',
      ...BAR_ANIMATION,
      data: toStatusBarData(data),
    },
  ],
});

export const buildStatusBarOption = (data: StatusDistributionItem[]): EChartsOption =>
  createStatusBarOption(data);
