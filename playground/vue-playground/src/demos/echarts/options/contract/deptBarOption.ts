import type { EChartsOption } from 'echarts';
import type { DeptAmountItem } from '../../mock/contractAggregates';
import { formatWanYuan } from '../../utils/chartFormat';
import { getChartBaseStyle } from '../../utils/chartBase';

const PRIMARY = '#3b82f6';

const createDeptBarOption = (data: DeptAmountItem[]): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: [PRIMARY],
    textStyle: base.textStyle,
    tooltip: {
      ...base.tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
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
      axisLabel: { ...base.textStyle, fontSize: 10 },
      axisLine: base.axisLineStyle,
    },
    series: [
      {
        name: '签约额',
        type: 'bar',
        data: data.map((item) => item.amount),
        label: {
          show: true,
          position: 'right',
          color: base.colors.text,
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

export const buildEmptyDeptBarOption = (): EChartsOption => createDeptBarOption([]);

export const setDeptBarOption = (data: DeptAmountItem[]): EChartsOption => ({
  yAxis: {
    data: data.map((item) => item.label),
  },
  series: [
    {
      name: '签约额',
      data: data.map((item) => item.amount),
    },
  ],
});

export const buildDeptBarOption = (data: DeptAmountItem[]): EChartsOption =>
  createDeptBarOption(data);
