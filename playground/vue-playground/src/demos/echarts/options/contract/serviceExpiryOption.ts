import type { EChartsOption } from 'echarts';
import {
  SERVICE_EXPIRY_THRESHOLD,
  type ServiceExpiryBucket,
} from '../../mock/contractAggregates';

const PRIMARY = '#3b82f6';
const WARN_COLOR = '#ef4444';

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3',
};

const createServiceExpiryOption = (data: ServiceExpiryBucket[]): EChartsOption => ({
  color: [PRIMARY],
  textStyle: TEXT_STYLE,
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(26, 35, 50, 0.9)',
    borderColor: '#2d3a4f',
    textStyle: { color: '#e7ecf3', fontSize: 12 },
  },
  grid: { left: 80, right: 56, top: 36, bottom: 40 },
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
        itemStyle: {
          color: item.count >= SERVICE_EXPIRY_THRESHOLD ? WARN_COLOR : PRIMARY,
        },
      })),
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: WARN_COLOR, type: 'dashed', width: 1.5 },
        label: {
          formatter: `预警线 ≥${SERVICE_EXPIRY_THRESHOLD}份`,
          position: 'insideStartTop',
          fontSize: 10,
          color: WARN_COLOR,
          textBorderWidth: 0,
          distance: 6,
        },
        data: [{ yAxis: SERVICE_EXPIRY_THRESHOLD, name: '预警线' }],
      },
    },
  ],
});

export const buildEmptyServiceExpiryOption = (): EChartsOption =>
  createServiceExpiryOption([]);

export const setServiceExpiryOption = (data: ServiceExpiryBucket[]): EChartsOption => ({
  xAxis: {
    data: data.map((item) => item.month),
  },
  series: [
    {
      name: '到期合同数',
      data: data.map((item) => ({
        value: item.count,
        itemStyle: {
          color: item.count >= SERVICE_EXPIRY_THRESHOLD ? WARN_COLOR : PRIMARY,
        },
      })),
    },
  ],
});

/** 图⑥：服务合同到期分布 + markLine 预警线（主流程 ⑥ 到期与风险） */
export const buildServiceExpiryOption = (data: ServiceExpiryBucket[]): EChartsOption =>
  createServiceExpiryOption(data);
