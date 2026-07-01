import type { EChartsOption } from 'echarts';
import { getFrameworkTop3Usage } from '../../mock/contractAggregates';
import { formatPercent, formatWanYuan } from '../../utils/chartFormat';

const USED_COLOR = '#3b82f6';
const TOTAL_COLOR = '#334155';
const WARN_COLOR = '#ef4444';

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

/** 图⑤：框架额度 TOP3，双系列横向条（已用 vs 总额度，主流程 ④ 履约） */
export const buildFrameworkTop3Option = (): EChartsOption => {
  const data = getFrameworkTop3Usage();

  return {
    color: [USED_COLOR, TOTAL_COLOR],
    textStyle: TEXT_STYLE,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(26, 35, 50, 0.9)',
      borderColor: '#2d3a4f',
      textStyle: { color: '#e7ecf3', fontSize: 12 },
      formatter: (params) => {
        const items = Array.isArray(params) ? params : [params];
        if (!items.length) return '';
        const name = items[0].name;
        const lines = items.map((item) => {
          if (typeof item.value !== 'number') return '';
          return `${item.seriesName}：${formatWanYuan(item.value)}`;
        });
        const rate = data.find((d) => d.name === name)?.usageRate ?? 0;
        return `${name}<br/>${lines.join('<br/>')}<br/>使用率：${formatPercent(rate)}`;
      },
    },
    legend: { bottom: 0, data: ['已用额度', '总额度'], textStyle: TEXT_STYLE },
    grid: { left: 108, right: 56, top: 16, bottom: 40 },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: data.map((item) => item.name),
      inverse: true,
      axisLabel: { ...TEXT_STYLE, fontSize: 10, width: 90, overflow: 'truncate' },
      axisLine: { lineStyle: { color: '#2d3a4f' } },
    },
    series: [
      {
        name: '已用额度',
        type: 'bar',
        data: data.map((item) => ({
          value: item.quotaUsed,
          itemStyle: { color: item.usageRate >= 90 ? WARN_COLOR : USED_COLOR },
        })),
        label: {
          show: true,
          position: 'right',
          color: '#e7ecf3',
          fontSize: 10,
          textBorderWidth: 0,
          formatter: (params) => {
            const idx = params.dataIndex;
            const rate = data[idx]?.usageRate ?? 0;
            return formatPercent(rate);
          },
        },
      },
      {
        name: '总额度',
        type: 'bar',
        data: data.map((item) => item.quotaTotal),
        barGap: '-100%', // 与上一系列重叠，形成「已用/总额」对比条
        z: 0, // 置于底层作为背景条
        itemStyle: { color: TOTAL_COLOR, opacity: 0.35 },
        label: { show: false },
      },
    ],
  };
};
