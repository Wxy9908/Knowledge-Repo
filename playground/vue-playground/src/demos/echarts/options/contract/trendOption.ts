import type { EChartsOption } from 'echarts';
import { getMonthlySignAmount } from '../../mock/contractAggregates';

const PRIMARY = '#3b82f6';

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

/** 图①：月度签约趋势，折线 + areaStyle 渐变（主流程 ⑦ 管理复盘） */
export const buildTrendOption = (): EChartsOption => {
  const data = getMonthlySignAmount();

  return {
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
      data: data.map((item) => item.month),
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
        data: data.map((item) => item.amount),
        // 面积渐变：提升趋势图可读性（Tab 3 比 Tab 2 配置更丰富）
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
