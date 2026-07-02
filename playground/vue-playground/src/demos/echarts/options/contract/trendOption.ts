import type { EChartsOption } from 'echarts';
import type { MonthlySignItem } from '../../mock/contractAggregates';

const PRIMARY = '#3b82f6';

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

const createTrendOption = (): EChartsOption => ({
  color: [PRIMARY],
  textStyle: TEXT_STYLE,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26, 35, 50, 0.9)',
    borderColor: '#2d3a4f',
    textStyle: { color: '#e7ecf3', fontSize: 12 },
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
    data: [],
    axisLabel: { ...TEXT_STYLE, fontSize: 10, rotate: 30 },
    axisLine: { lineStyle: { color: '#2d3a4f' } },
  },
  yAxis: {
    type: 'value',
    name: '万元',
    nameTextStyle: { ...TEXT_STYLE, fontSize: 10 },
    axisLabel: TEXT_STYLE,
    splitLine: { lineStyle: { color: '#2d3a4f', type: 'dashed' } },
  },
  series: [
    {
      name: '签约金额',
      type: 'line',
      smooth: true,
      data: [],
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
});

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
export const buildTrendOption = (data: MonthlySignItem[]): EChartsOption => ({
  ...buildEmptyTrendOption(),
  ...setTrendOption(data),
});
