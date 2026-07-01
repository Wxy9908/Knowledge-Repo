import type { EChartsOption } from 'echarts';
import {
  barChartData,
  lineChartData,
  pieChartData,
  scatterChartData,
} from '../mock/basicChartData';

const CHART_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'];
const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'];

const TEXT_STYLE = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  color: '#8b9cb3', // 对应 var(--muted)
};

const LABEL_STYLE = {
  color: '#e7ecf3', // 对应 var(--text)
  fontSize: 12,
  textBorderWidth: 0, // 彻底去掉刺眼的描边
};

const baseTooltip = {
  trigger: 'item' as const,
  backgroundColor: 'rgba(26, 35, 50, 0.9)',
  borderColor: '#2d3a4f',
  textStyle: { color: '#e7ecf3', fontSize: 12 },
};

const axisTooltip = {
  ...baseTooltip,
  trigger: 'axis' as const,
};

export const buildLineOption = (): EChartsOption => ({
  color: CHART_COLORS,
  textStyle: TEXT_STYLE,
  tooltip: axisTooltip,
  legend: {
    data: lineChartData.series.map((item) => item.name),
    bottom: 0,
    textStyle: TEXT_STYLE,
  },
  grid: { left: 48, right: 24, top: 24, bottom: 56 },
  xAxis: {
    type: 'category',
    data: lineChartData.months,
    axisLabel: TEXT_STYLE,
    axisLine: { lineStyle: { color: '#2d3a4f' } },
  },
  yAxis: {
    type: 'value',
    axisLabel: TEXT_STYLE,
    splitLine: { lineStyle: { color: '#2d3a4f', type: 'dashed' } },
  },
  series: lineChartData.series.map((item) => ({
    name: item.name,
    type: 'line',
    data: item.values,
    smooth: true,
  })),
});

export const buildBarOption = (): EChartsOption => ({
  color: CHART_COLORS,
  textStyle: TEXT_STYLE,
  tooltip: axisTooltip,
  legend: {
    data: barChartData.series.map((item) => item.name),
    bottom: 0,
    textStyle: TEXT_STYLE,
  },
  grid: { left: 48, right: 24, top: 24, bottom: 56 },
  xAxis: {
    type: 'category',
    data: barChartData.categories,
    axisLabel: TEXT_STYLE,
    axisLine: { lineStyle: { color: '#2d3a4f' } },
  },
  yAxis: {
    type: 'value',
    axisLabel: TEXT_STYLE,
    splitLine: { lineStyle: { color: '#2d3a4f', type: 'dashed' } },
  },
  series: barChartData.series.map((item) => ({
    name: item.name,
    type: 'bar',
    data: item.values,
    itemStyle: { borderRadius: [4, 4, 0, 0] },
  })),
});

export const buildPieOption = (): EChartsOption => ({
  color: PIE_COLORS,
  textStyle: TEXT_STYLE,
  tooltip: { ...baseTooltip, formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'horizontal', bottom: 0, textStyle: TEXT_STYLE },
  series: [
    {
      name: '销售额',
      type: 'pie',
      radius: [0, '32%'],
      label: {
        position: 'inner',
        fontSize: 10,
        color: '#fff',
        textBorderWidth: 0,
      },
      data: pieChartData.inner,
    },
    {
      name: '利润',
      type: 'pie',
      radius: ['46%', '62%'],
      label: {
        ...LABEL_STYLE,
        formatter: '{b}\n{d}%',
      },
      labelLine: {
        lineStyle: { color: '#2d3a4f' },
        smooth: true,
      },
      data: pieChartData.outer,
    },
  ],
});

export const buildScatterOption = (): EChartsOption => ({
  color: CHART_COLORS,
  textStyle: TEXT_STYLE,
  tooltip: {
    ...baseTooltip,
    formatter: (params) => {
      const p = Array.isArray(params) ? params[0] : params;
      if (!p || !Array.isArray(p.value)) return '';
      return `${p.seriesName} · 样本 ${p.dataIndex + 1}: (${p.value[0]}, ${p.value[1]})`;
    },
  },
  legend: {
    data: scatterChartData.groups.map((group) => group.name),
    bottom: 0,
    textStyle: TEXT_STYLE,
  },
  grid: { left: 56, right: 24, top: 24, bottom: 56 },
  xAxis: {
    type: 'value',
    name: '练习时长(h)',
    axisLabel: TEXT_STYLE,
    axisLine: { lineStyle: { color: '#2d3a4f' } },
    splitLine: { lineStyle: { color: '#2d3a4f', type: 'dashed' } },
  },
  yAxis: {
    type: 'value',
    name: '测验分数',
    axisLabel: TEXT_STYLE,
    axisLine: { lineStyle: { color: '#2d3a4f' } },
    splitLine: { lineStyle: { color: '#2d3a4f', type: 'dashed' } },
  },
  series: scatterChartData.groups.map((group) => ({
    name: group.name,
    type: 'scatter',
    data: group.points,
    symbolSize: 10,
    itemStyle: {
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
    },
  })),
});
