/** 图表 tooltip / label 格式化（合同金额统一走这里，避免各处重复逻辑） */

export const formatAmount = (value: number): string =>
  value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });

export const formatWanYuan = (yuan: number): string => {
  const wan = yuan / 10000;
  return `${wan.toLocaleString('zh-CN', { maximumFractionDigits: 1 })} 万`;
};

export const formatPercent = (value: number): string =>
  `${value.toLocaleString('zh-CN', { maximumFractionDigits: 1 })}%`;
