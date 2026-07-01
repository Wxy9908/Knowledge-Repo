import type { EChartsOption } from 'echarts';
import { getTypeDistribution } from '../../mock/contractAggregates';

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'];

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

export const buildTypePieOption = (): EChartsOption => {
  const data = getTypeDistribution();

  return {
    color: PIE_COLORS,
    textStyle: TEXT_STYLE,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 份 ({d}%)',
      backgroundColor: 'rgba(26, 35, 50, 0.9)',
      borderColor: '#2d3a4f',
      textStyle: { color: '#e7ecf3', fontSize: 12 },
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      selectedMode: true,
      textStyle: TEXT_STYLE,
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
          color: '#e7ecf3',
          fontSize: 12,
          textBorderWidth: 0,
        },
        labelLine: {
          lineStyle: { color: '#2d3a4f' },
          smooth: true,
        },
      },
    ],
  };
};
