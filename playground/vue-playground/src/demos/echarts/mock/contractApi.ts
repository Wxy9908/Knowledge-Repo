import type { ContractChartKey } from '../types/contractDashboard';
import {
  getApprovalFunnel,
  getDeptAmountRanking,
  getFrameworkTop3Usage,
  getKpiSummary,
  getMonthlySignAmount,
  getServiceExpiryBuckets,
  getStatusDistribution,
  getTypeDistribution,
  type DeptAmountItem,
  type FunnelItem,
  type FrameworkUsageItem,
  type KpiSummary,
  type MonthlySignItem,
  type ServiceExpiryBucket,
  type StatusDistributionItem,
  type TypeDistributionItem,
} from './contractAggregates';

interface DelayRange {
  min: number;
  max: number;
}

const wait = (ms: number) => new Promise<void>((resolve) => {
  window.setTimeout(resolve, ms);
});

const randomBetween = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

const delayInRange = ({ min, max }: DelayRange) => wait(randomBetween(min, max));

/** KPI 接口：轻量聚合，通常最快返回 */
const KPI_DELAY: DelayRange = { min: 320, max: 580 };

/**
 * 各图表接口延迟（模拟不同 SQL / 服务耗时）
 * 饼图、折线较快；漏斗、到期分布较慢
 */
const CHART_DELAYS: Record<ContractChartKey, DelayRange> = {
  typePie: { min: 1000, max: 1200 },
  trend: { min: 1020, max: 1550 },
  status: { min: 750, max: 1100 },
  dept: { min: 900, max: 1300 },
  framework: { min: 1050, max: 1450 },
  expiry: { min: 1200, max: 1650 },
  funnel: { min: 1400, max: 2000 },
};

export type ContractChartDataMap = {
  trend: MonthlySignItem[];
  typePie: TypeDistributionItem[];
  status: StatusDistributionItem[];
  dept: DeptAmountItem[];
  framework: FrameworkUsageItem[];
  expiry: ServiceExpiryBucket[];
  funnel: FunnelItem[];
};

const CHART_DATA_RESOLVERS: {
  [K in ContractChartKey]: () => ContractChartDataMap[K];
} = {
  trend: getMonthlySignAmount,
  typePie: getTypeDistribution,
  status: getStatusDistribution,
  dept: getDeptAmountRanking,
  framework: getFrameworkTop3Usage,
  expiry: getServiceExpiryBuckets,
  funnel: getApprovalFunnel,
};

export const fetchContractKpi = async (): Promise<KpiSummary> => {
  await delayInRange(KPI_DELAY);
  return getKpiSummary();
};

/** 模拟单图数据接口：返回该图所需的业务数据 */
export const fetchContractChartData = async <K extends ContractChartKey>(
  chartKey: K,
): Promise<ContractChartDataMap[K]> => {
  await delayInRange(CHART_DELAYS[chartKey]);
  return CHART_DATA_RESOLVERS[chartKey]();
};
