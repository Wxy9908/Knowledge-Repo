import type { EChartsOption } from 'echarts';
import {
  getServiceExpiryBuckets,
  SERVICE_EXPIRY_THRESHOLD,
} from '../../mock/contractAggregates';

const PRIMARY = '#3b82f6';
const WARN_COLOR = '#ef4444';

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

/** 图⑥：服务合同到期分布 + markLine 预警线（主流程 ⑥ 到期与风险） */
export const buildServiceExpiryOption = (): EChartsOption => {
  const data = getServiceExpiryBuckets();

  return {
    color: [PRIMARY],
    textStyle: TEXT_STYLE,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(26, 35, 50, 0.9)',
      borderColor: '#2d3a4f',
      textStyle: { color: '#e7ecf3', fontSize: 12 },
    },
    grid: { left: 48, right: 16, top: 36, bottom: 40 },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.month),
      axisLabel: { ...TEXT_STYLE, fontSize: 10 },
      axisLine: { lineStyle: { color: '#2d3a4f' } },
    },
    yAxis: {
      type: 'value',
      name: '份',
      nameTextStyle: TEXT_STYLE,
      axisLabel: TEXT_STYLE,
      splitLine: { lineStyle: { color: '#2d3a4f', type: 'dashed' } },
    },
    series: [
      {
        name: '到期合同数',
        type: 'bar',
        data: data.map((item) => ({
          value: item.count,
          // 超过预警阈值时柱体变红，与下方 markLine 联动
          itemStyle: {
            color: item.count >= SERVICE_EXPIRY_THRESHOLD ? WARN_COLOR : PRIMARY,
          },
        })),
        // markLine：在 Y 轴画一条水平参考线，表示「每月到期 ≥8 份」需关注
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: WARN_COLOR, type: 'dashed' },
          label: {
            formatter: '预警线',
            fontSize: 10,
            color: WARN_COLOR,
            textBorderWidth: 0,
          },
          data: [{ yAxis: SERVICE_EXPIRY_THRESHOLD, name: '预警线' }],
        },
      },
    ],
  };
};
