import type { EChartsOption } from 'echarts';
import type { FunnelItem } from '../../mock/contractAggregates';
import { getChartBaseStyle } from '../../utils/chartBase';

const FUNNEL_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

const getPercent = (data: unknown): number => {
  if (!data || typeof data !== 'object' || !('percent' in data)) return 0;
  const percent = (data as { percent: unknown }).percent;
  return typeof percent === 'number' ? percent : 0;
};

const toFunnelData = (data: FunnelItem[]) => {
  const total = data[0]?.count ?? 1;

  return data.map((item) => ({
    name: item.stage,
    value: item.count,
    percent: (item.count / total) * 100,
  }));
};

const createApprovalFunnelOption = (data: FunnelItem[] = []): EChartsOption => {
  const funnelData = toFunnelData(data);
  const base = getChartBaseStyle();

  return {
    color: FUNNEL_COLORS,
    textStyle: base.textStyle,
    tooltip: {
      ...base.tooltipStyle,
      trigger: 'item',
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params;
        if (!p || typeof p.value !== 'number') return '';
        const pct = getPercent(p.data).toFixed(1);
        return `${p.name}<br/>${p.value} 份 (${pct}%)`;
      },
    },
    series: [
      {
        name: '审批流程',
        type: 'funnel',
        left: '8%',
        right: '8%',
        top: 16,
        bottom: 16,
        sort: 'descending',
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 11,
          textBorderWidth: 0,
          formatter: (params) => {
            if (typeof params.value !== 'number') return '';
          const pct = getPercent(params.data).toFixed(0);
            return `${params.name}\n${params.value} (${pct}%)`;
          },
        },
        data: funnelData,
      },
    ],
  };
};

export const buildEmptyApprovalFunnelOption = (): EChartsOption =>
  createApprovalFunnelOption([]);

export const setApprovalFunnelOption = (data: FunnelItem[]): EChartsOption => ({
  series: [
    {
      name: '审批流程',
      data: toFunnelData(data),
    },
  ],
});

/** 图⑦：审批流程漏斗（主流程 ③ 审批与签署），展示各阶段转化 */
export const buildApprovalFunnelOption = (data: FunnelItem[]): EChartsOption =>
  createApprovalFunnelOption(data);
