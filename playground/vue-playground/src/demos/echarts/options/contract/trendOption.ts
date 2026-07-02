import type { EChartsOption } from 'echarts';
import type { MonthlySignItem } from '../../mock/contractAggregates';
import { getChartBaseStyle } from '../../utils/chartBase';

const PRIMARY = '#3b82f6';

const createTrendOption = (data: MonthlySignItem[] = []): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: [PRIMARY],
    textStyle: base.textStyle,
    tooltip: {
      ...base.tooltipStyle,
      trigger: 'axis',
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params;
        if (!p || typeof p.value !== 'number') return '';
        return `${p.name}<br/>签约额：${p.value} 万元`;
      },
    },
    grid: { left: 52, right: 24, top: 28, bottom: 40 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((item) => item.month),
      axisLabel: { ...base.textStyle, fontSize: 10, rotate: 30 },
      axisLine: base.axisLineStyle,
    },
    yAxis: {
      type: 'value',
      name: '万元',
      nameTextStyle: { ...base.textStyle, fontSize: 10 },
      axisLabel: base.textStyle,
      splitLine: base.splitLineStyle,
    },
    series: [
      {
        name: '签约金额',
        type: 'line',
        smooth: true,
        data: data.map((item) => item.amount),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.45)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ],
          },
        },
      },
    ],
  };
};

/** 图①：空坐标轴骨架（异步加载前先渲染，对齐官方第一步） */
export const buildEmptyTrendOption = (): EChartsOption => createTrendOption();

/** 图①：局部 setOption — 清空或填入数据 */
export const setTrendOption = (data: MonthlySignItem[]): EChartsOption => ({
  xAxis: {
    data: data.map((item) => item.month),
  },
  series: [
    {
      name: '签约金额',
      data: data.map((item) => item.amount),
    },
  ],
});

/** 图①：完整 option（供「查看代码」展示当前图表状态） */
export const buildTrendOption = (data: MonthlySignItem[]): EChartsOption =>
  createTrendOption(data);
