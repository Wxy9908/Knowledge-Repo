import type { EChartsOption } from 'echarts';
import {
  SERVICE_EXPIRY_THRESHOLD,
  type ServiceExpiryBucket,
} from '../../mock/contractAggregates';
import { getChartBaseStyle } from '../../utils/chartBase';

const PRIMARY = '#3b82f6';
const WARN_COLOR = '#ef4444';

const createServiceExpiryOption = (data: ServiceExpiryBucket[]): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: [PRIMARY],
    textStyle: base.textStyle,
    tooltip: {
      ...base.tooltipStyle,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: 80, right: 56, top: 36, bottom: 40 },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.month),
      axisLabel: { ...base.textStyle, fontSize: 10 },
      axisLine: base.axisLineStyle,
    },
    yAxis: {
      type: 'value',
      name: '份',
      nameTextStyle: base.textStyle,
      axisLabel: base.textStyle,
      splitLine: base.splitLineStyle,
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
  };
};

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
