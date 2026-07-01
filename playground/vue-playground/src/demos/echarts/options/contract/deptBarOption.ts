import type { EChartsOption } from 'echarts';
import { getDeptAmountRanking } from '../../mock/contractAggregates';
import { formatWanYuan } from '../../utils/chartFormat';

const PRIMARY = '#3b82f6';

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

export const buildDeptBarOption = (): EChartsOption => {
  const data = getDeptAmountRanking();

  return {
    color: [PRIMARY],
    textStyle: TEXT_STYLE,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(26, 35, 50, 0.9)',
      borderColor: '#2d3a4f',
      textStyle: { color: '#e7ecf3', fontSize: 12 },
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params;
        if (!p || typeof p.value !== 'number') return '';
        return `${p.name}<br/>签约额：${formatWanYuan(p.value)}`;
      },
    },
    grid: { left: 96, right: 48, top: 16, bottom: 24 },
    xAxis: { type: 'value', name: '元', show: false },
    yAxis: {
      type: 'category',
      data: data.map((item) => item.label),
      inverse: true,
      axisLabel: { ...TEXT_STYLE, fontSize: 10 },
      axisLine: { lineStyle: { color: '#2d3a4f' } },
    },
    series: [
      {
        name: '签约额',
        type: 'bar',
        data: data.map((item) => item.amount),
        label: {
          show: true,
          position: 'right',
          color: '#e7ecf3',
          fontSize: 10,
          textBorderWidth: 0,
          formatter: (params) => {
            if (typeof params.value !== 'number') return '';
            return formatWanYuan(params.value);
          },
        },
      },
    ],
  };
};
