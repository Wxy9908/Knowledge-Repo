import type { EChartsOption } from 'echarts';
import { getStatusDistribution } from '../../mock/contractAggregates';

const PRIMARY = '#3b82f6';

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

export const buildStatusBarOption = (): EChartsOption => {
  const data = getStatusDistribution();

  return {
    color: [PRIMARY],
    textStyle: TEXT_STYLE,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(26, 35, 50, 0.9)',
      borderColor: '#2d3a4f',
      textStyle: { color: '#e7ecf3', fontSize: 12 },
    },
    grid: { left: 48, right: 16, top: 24, bottom: 48 },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.label),
      axisLabel: { ...TEXT_STYLE, fontSize: 10, rotate: 20 },
      axisLine: { lineStyle: { color: '#2d3a4f' } },
    },
    yAxis: {
      type: 'value',
      name: '份',
      nameTextStyle: TEXT_STYLE,
      axisLabel: TEXT_STYLE,
      splitLine: { lineStyle: { color: '#2d3a4f', type: 'dashed' } },
    },
    series: [
      {
        name: '合同数量',
        type: 'bar',
        data: data.map((item) => item.count),
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
};
