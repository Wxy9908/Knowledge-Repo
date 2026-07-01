import { reactive } from 'vue';

export const lineChartData = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月'],
  series: [
    { name: '渠道A', values: [820, 932, 901, 934, 1290, 1330] },
    { name: '渠道B', values: [620, 732, 801, 834, 1090, 1130] },
    { name: '渠道C', values: [420, 532, 501, 634, 890, 930] },
  ],
};

/** 柱状图 mock（reactive）：阶段 4.5 表单编辑后 useEcharts watch 会自动 setOption */
export const barChartData = reactive({
  categories: ['产品A', '产品B', '产品C', '产品D', '产品E'],
  series: [
    { name: '线上', values: [120, 200, 150, 80, 70] },
    { name: '线下', values: [90, 160, 110, 95, 55] },
  ],
});

export const pieChartData = {
  inner: [
    { name: '品类甲', value: 335 },
    { name: '品类乙', value: 310 },
    { name: '品类丙', value: 234 },
  ],
  outer: [
    { name: '品类甲', value: 120 },
    { name: '品类乙', value: 98 },
    { name: '品类丙', value: 76 },
    { name: '品类丁', value: 54 },
    { name: '品类戊', value: 42 },
  ],
};

export const scatterChartData = {
  groups: [
    {
      name: '班级甲',
      points: [
        [12, 67],
        [18, 72],
        [25, 58],
        [33, 81],
      ] as [number, number][],
    },
    {
      name: '班级乙',
      points: [
        [20, 74],
        [28, 68],
        [36, 85],
        [44, 79],
      ] as [number, number][],
    },
    {
      name: '班级丙',
      points: [
        [48, 63],
        [55, 88],
        [62, 79],
        [70, 91],
      ] as [number, number][],
    },
  ],
};
