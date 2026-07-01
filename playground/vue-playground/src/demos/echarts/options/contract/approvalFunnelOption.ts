import type { EChartsOption } from 'echarts';
import { getApprovalFunnel } from '../../mock/contractAggregates';

const FUNNEL_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7'];

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

/** 图⑦：审批流程漏斗（主流程 ③ 审批与签署），展示各阶段转化 */
export const buildApprovalFunnelOption = (): EChartsOption => {
  const data = getApprovalFunnel();
  const total = data[0]?.count ?? 1;

  return {
    color: FUNNEL_COLORS,
    textStyle: TEXT_STYLE,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(26, 35, 50, 0.9)',
      borderColor: '#2d3a4f',
      textStyle: { color: '#e7ecf3', fontSize: 12 },
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params;
        if (!p || typeof p.value !== 'number') return '';
        const pct = ((p.value / total) * 100).toFixed(1);
        return `${p.name}<br/>${p.value} 份 (${pct}%)`;
      },
    },
    series: [
      {
        name: '审批流程',
        type: 'funnel', // 漏斗图：适合多阶段流程的数量递减展示
        left: '8%',
        right: '8%',
        top: 16,
        bottom: 16,
        sort: 'descending', // 从上到下由大到小
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 11,
          textBorderWidth: 0,
          formatter: (params) => {
            if (typeof params.value !== 'number') return '';
            const pct = ((params.value / total) * 100).toFixed(0);
            return `${params.name}\n${params.value} (${pct}%)`;
          },
        },
        data: data.map((item) => ({ name: item.stage, value: item.count })),
      },
    ],
  };
};
