import type { EChartsOption } from 'echarts';
import type { FrameworkUsageItem } from '../../mock/contractAggregates';
import { formatPercent, formatWanYuan } from '../../utils/chartFormat';
import { getChartBaseStyle } from '../../utils/chartBase';

const USED_COLOR = '#3b82f6';
const TOTAL_COLOR = '#334155';
const WARN_COLOR = '#ef4444';

const toUsedQuotaData = (data: FrameworkUsageItem[]) =>
  data.map((item) => ({
    name: item.name,
    value: item.quotaUsed,
    usageRate: item.usageRate,
    itemStyle: { color: item.usageRate >= 90 ? WARN_COLOR : USED_COLOR },
  }));

const toTotalQuotaData = (data: FrameworkUsageItem[]) =>
  data.map((item) => ({
    name: item.name,
    value: item.quotaTotal,
    usageRate: item.usageRate,
  }));

const getUsageRate = (data: unknown): number => {
  if (!data || typeof data !== 'object' || !('usageRate' in data)) return 0;
  const usageRate = (data as { usageRate: unknown }).usageRate;
  return typeof usageRate === 'number' ? usageRate : 0;
};

const createFrameworkTop3Option = (data: FrameworkUsageItem[]): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: [USED_COLOR, TOTAL_COLOR],
    textStyle: base.textStyle,
    tooltip: {
      ...base.tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const items = Array.isArray(params) ? params : [params];
        if (!items.length) return '';
        const name = items[0].name;
        const lines = items.map((item) => {
          if (typeof item.value !== 'number') return '';
          return `${item.seriesName}：${formatWanYuan(item.value)}`;
        });
        const rate = getUsageRate(items.find((item) => getUsageRate(item.data) > 0)?.data);
        return `${name}<br/>${lines.join('<br/>')}<br/>使用率：${formatPercent(rate)}`;
      },
    },
    legend: { bottom: 0, data: ['已用额度', '总额度'], textStyle: base.textStyle },
    grid: { left: 108, right: 56, top: 16, bottom: 40 },
    xAxis: { type: 'value', show: false },
    yAxis: {
      type: 'category',
      data: data.map((item) => item.name),
      inverse: true,
      axisLabel: { ...base.textStyle, fontSize: 10, width: 90, overflow: 'truncate' },
      axisLine: base.axisLineStyle,
    },
    series: [
      {
        name: '已用额度',
        type: 'bar',
        data: toUsedQuotaData(data),
        label: {
          show: true,
          position: 'right',
          color: base.colors.text,
          fontSize: 10,
          textBorderWidth: 0,
          formatter: (params) => {
            const rate = getUsageRate(params.data);
            return formatPercent(rate);
          },
        },
      },
      {
        name: '总额度',
        type: 'bar',
        data: toTotalQuotaData(data),
        barGap: '-100%',
        z: 0,
        itemStyle: { color: TOTAL_COLOR, opacity: 0.35 },
        label: { show: false },
      },
    ],
  };
};

export const buildEmptyFrameworkTop3Option = (): EChartsOption =>
  createFrameworkTop3Option([]);

export const setFrameworkTop3Option = (data: FrameworkUsageItem[]): EChartsOption => ({
  yAxis: {
    data: data.map((item) => item.name),
  },
  series: [
    {
      name: '已用额度',
      data: toUsedQuotaData(data),
    },
    {
      name: '总额度',
      data: toTotalQuotaData(data),
    },
  ],
});

/** 图⑤：框架额度 TOP3，双系列横向条（已用 vs 总额度，主流程 ④ 履约） */
export const buildFrameworkTop3Option = (data: FrameworkUsageItem[]): EChartsOption =>
  createFrameworkTop3Option(data);
