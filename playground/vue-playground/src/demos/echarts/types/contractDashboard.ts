import type { KpiSummary } from '../mock/contractAggregates';

export type ContractChartKey =
  | 'trend'
  | 'typePie'
  | 'status'
  | 'dept'
  | 'framework'
  | 'expiry'
  | 'funnel';

export const CONTRACT_CHART_KEYS: ContractChartKey[] = [
  'trend',
  'typePie',
  'status',
  'dept',
  'framework',
  'expiry',
  'funnel',
];

export interface ContractDashboardPayload {
  kpi: KpiSummary;
}

export type ContractChartLoadingMap = Record<ContractChartKey, boolean>;

export const createChartLoadingMap = (loading: boolean): ContractChartLoadingMap => ({
  trend: loading,
  typePie: loading,
  status: loading,
  dept: loading,
  framework: loading,
  expiry: loading,
  funnel: loading,
});
