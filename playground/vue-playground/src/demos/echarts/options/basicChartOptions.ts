import type { EChartsOption } from 'echarts';
import {
  barChartData,
  lineChartData,
  pieChartData,
  scatterChartData,
} from '../mock/basicChartData';
import { getChartBaseStyle } from '../utils/chartBase';

const CHART_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'];
const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'];

export const buildLineOption = (): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: CHART_COLORS,
    textStyle: base.textStyle,
    tooltip: { ...base.tooltipStyle, trigger: 'axis' },
    legend: {
      data: lineChartData.series.map((item) => item.name),
      bottom: 0,
      textStyle: base.textStyle,
    },
    grid: { left: 48, right: 24, top: 24, bottom: 56 },
    xAxis: {
      type: 'category',
      data: lineChartData.months,
      axisLabel: base.textStyle,
      axisLine: base.axisLineStyle,
    },
    yAxis: {
      type: 'value',
      axisLabel: base.textStyle,
      splitLine: base.splitLineStyle,
    },
    series: lineChartData.series.map((item) => ({
      name: item.name,
      type: 'line',
      data: item.values,
      smooth: true,
    })),
  };
};

export const buildBarOption = (): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: CHART_COLORS,
    textStyle: base.textStyle,
    tooltip: { ...base.tooltipStyle, trigger: 'axis' },
    legend: {
      data: barChartData.series.map((item) => item.name),
      bottom: 0,
      textStyle: base.textStyle,
    },
    grid: { left: 48, right: 24, top: 24, bottom: 56 },
    xAxis: {
      type: 'category',
      data: barChartData.categories,
      axisLabel: base.textStyle,
      axisLine: base.axisLineStyle,
    },
    yAxis: {
      type: 'value',
      axisLabel: base.textStyle,
      splitLine: base.splitLineStyle,
    },
    series: barChartData.series.map((item) => ({
      name: item.name,
      type: 'bar',
      data: item.values,
      itemStyle: { borderRadius: [4, 4, 0, 0] },
    })),
  };
};

export const buildPieOption = (): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: PIE_COLORS,
    textStyle: base.textStyle,
    tooltip: { ...base.tooltipStyle, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'horizontal', bottom: 0, textStyle: base.textStyle },
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
          color: base.colors.text,
          fontSize: 12,
          textBorderWidth: 0,
          formatter: '{b}\n{d}%',
        },
        labelLine: {
          lineStyle: base.axisLineStyle.lineStyle,
          smooth: true,
        },
        data: pieChartData.outer,
      },
    ],
  };
};

export const buildScatterOption = (): EChartsOption => {
  const base = getChartBaseStyle();
  
  return {
    color: CHART_COLORS,
    textStyle: base.textStyle,
    tooltip: {
      ...base.tooltipStyle,
      trigger: 'item',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        if (!p || !Array.isArray(p.value)) return '';
        return `${p.seriesName} · 样本 ${p.dataIndex + 1}: (${p.value[0]}, ${p.value[1]})`;
      },
    },
    legend: {
      data: scatterChartData.groups.map((group) => group.name),
      bottom: 0,
      textStyle: base.textStyle,
    },
    grid: { left: 56, right: 24, top: 24, bottom: 56 },
    xAxis: {
      type: 'value',
      name: '练习时长(h)',
      axisLabel: base.textStyle,
      axisLine: base.axisLineStyle,
      splitLine: base.splitLineStyle,
    },
    yAxis: {
      type: 'value',
      name: '测验分数',
      axisLabel: base.textStyle,
      axisLine: base.axisLineStyle,
      splitLine: base.splitLineStyle,
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
  };
};
