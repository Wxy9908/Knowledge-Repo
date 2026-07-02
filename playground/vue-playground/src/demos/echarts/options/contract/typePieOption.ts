import type { EChartsOption } from 'echarts';
import type { TypeDistributionItem } from '../../mock/contractAggregates';
import { getChartBaseStyle } from '../../utils/chartBase';

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'];

const createTypePieOption = (data: TypeDistributionItem[] = []): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: PIE_COLORS,
    textStyle: base.textStyle,
    tooltip: {
      ...base.tooltipStyle,
      trigger: 'item',
      formatter: '{b}: {c} 份 ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      selectedMode: true,
      textStyle: base.textStyle,
    },
    series: [
      {
        name: '合同类型',
        type: 'pie',
        radius: ['45%', '70%'],
        data: data.map((item) => ({ name: item.label, value: item.count })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.25)',
          },
        },
        label: {
          formatter: '{b}\n{d}%',
          color: base.colors.text,
          fontSize: 12,
          textBorderWidth: 0,
        },
        labelLine: {
          lineStyle: base.axisLineStyle.lineStyle,
          smooth: true,
        },
      },
    ],
  };
};

export const buildEmptyTypePieOption = (): EChartsOption => createTypePieOption();

export const setTypePieOption = (data: TypeDistributionItem[]): EChartsOption => ({
  series: [
    {
      data: data.map((item) => ({ name: item.label, value: item.count })),
    },
  ],
});

export const buildTypePieOption = (data: TypeDistributionItem[]): EChartsOption =>
  createTypePieOption(data);
