import {
  contractList,
  DEPT_LABELS,
  DEMO_CURRENT_MONTH,
  STATUS_LABELS,
  TYPE_LABELS,
  type ContractRecord,
  type ContractStatus,
  type ContractType,
} from './contractData';
import { formatWanYuan } from '../utils/chartFormat';

/**
 * 合同看板聚合层
 *
 * 职责：把 contractList 按业务维度统计，供 KPI 条与各图 option 工厂消费。
 * 原则：图表不直接读 raw list，统一走这里的导出函数。
 */

export interface KpiSummary {
  totalCount: number;
  monthSignAmount: number;
  monthSignLabel: string;
  activeCount: number;
  pendingCount: number;
}

export interface MonthlySignItem {
  month: string;
  amount: number;
}

export interface TypeDistributionItem {
  type: ContractType;
  label: string;
  count: number;
}

export interface StatusDistributionItem {
  status: ContractStatus;
  label: string;
  count: number;
}

export interface DeptAmountItem {
  dept: string;
  label: string;
  amount: number;
}

export interface FrameworkUsageItem {
  frameworkId: string;
  name: string;
  quotaTotal: number;
  quotaUsed: number;
  usageRate: number;
}

export interface ServiceExpiryBucket {
  month: string;
  count: number;
}

export interface FunnelItem {
  stage: string;
  count: number;
}

const sumAmount = (records: ContractRecord[]) =>
  records.reduce((sum, item) => sum + item.amount, 0);

/** 顶部 KPI 4 项：总数 / 本月签约额 / 履行中 / 待审批 */
export const getKpiSummary = (): KpiSummary => {
  // 「本月」= signDate 以 DEMO_CURRENT_MONTH（2026-06）开头
  const monthRecords = contractList.filter((item) =>
    item.signDate.startsWith(DEMO_CURRENT_MONTH),
  );
  const monthSignAmount = sumAmount(monthRecords);

  return {
    totalCount: contractList.length,
    monthSignAmount,
    monthSignLabel: formatWanYuan(monthSignAmount),
    activeCount: contractList.filter((item) => item.status === 'active').length,
    pendingCount: contractList.filter((item) => item.status === 'pending').length,
  };
};

/** 图①：近 12 个月签约金额（万元），按 signDate 按月 sum(amount) */
export const getMonthlySignAmount = (): MonthlySignItem[] => {
  const months: string[] = [];
  for (let m = 7; m <= 12; m += 1) {
    months.push(`2025-${String(m).padStart(2, '0')}`);
  }
  for (let m = 1; m <= 6; m += 1) {
    months.push(`2026-${String(m).padStart(2, '0')}`);
  }

  return months.map((month) => {
    const records = contractList.filter((item) => item.signDate.startsWith(month));
    return {
      month: `${month.slice(2, 4)}年${Number(month.slice(5))}月`,
      amount: sumAmount(records) / 10000,
    };
  });
};

/** 图②：按 type 分组计数 */
export const getTypeDistribution = (): TypeDistributionItem[] => {
  const types = Object.keys(TYPE_LABELS) as ContractType[];
  return types.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    count: contractList.filter((item) => item.type === type).length,
  }));
};

/** 图③：各状态当前快照（横切面，含 draft / pending / active 等） */
export const getStatusDistribution = (): StatusDistributionItem[] => {
  const statuses = Object.keys(STATUS_LABELS) as ContractStatus[];
  return statuses.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: contractList.filter((item) => item.status === status).length,
  }));
};

/** 图④：各部门签约额 sum(amount)，降序 */
export const getDeptAmountRanking = (): DeptAmountItem[] => {
  return Object.entries(DEPT_LABELS)
    .map(([dept, label]) => ({
      dept,
      label,
      amount: sumAmount(contractList.filter((item) => item.dept === dept)),
    }))
    .sort((a, b) => b.amount - a.amount);
};

/** 图⑤：框架合同按使用率取 TOP3（92% / 78% / 65% 三档） */
export const getFrameworkTop3Usage = (): FrameworkUsageItem[] => {
  const map = new Map<string, FrameworkUsageItem>();

  contractList
    .filter((item) => item.type === 'framework' && item.frameworkId && item.frameworkName)
    .forEach((item) => {
      const key = item.frameworkId!;
      const existing = map.get(key);
      if (!existing) {
        // 同一 frameworkId 只保留一条主数据（mock 简化）
        map.set(key, {
          frameworkId: key,
          name: item.frameworkName!,
          quotaTotal: item.quotaTotal ?? 0,
          quotaUsed: item.quotaUsed ?? 0,
          usageRate: 0,
        });
      }
    });

  return [...map.values()]
    .map((item) => ({
      ...item,
      usageRate: item.quotaTotal > 0 ? (item.quotaUsed / item.quotaTotal) * 100 : 0,
    }))
    .sort((a, b) => b.usageRate - a.usageRate)
    .slice(0, 3);
};

/** 图⑥ markLine 预警阈值：单月到期服务合同 ≥ 此值则柱体变红 */
export const SERVICE_EXPIRY_THRESHOLD = 8;

/** 图⑥：未来 90 天（7/8/9 月）服务合同到期数量分桶 */
export const getServiceExpiryBuckets = (): ServiceExpiryBucket[] => {
  const buckets = [
    { month: '2026年7月', prefix: '2026-07' },
    { month: '2026年8月', prefix: '2026-08' },
    { month: '2026年9月', prefix: '2026-09' },
  ];

  return buckets.map((bucket) => ({
    month: bucket.month,
    count: contractList.filter(
      (item) =>
        item.type === 'service' &&
        item.expireDate?.startsWith(bucket.prefix),
    ).length,
  }));
};

/**
 * 图⑦ 审批漏斗：流程视角的递减数据（起草→待审→履行→完结）
 *
 * 与图③区别：图③是「当前各状态有多少份」快照；
 * 漏斗强调「流转过程中逐级减少」，故用递减比例构造演示数据。
 */
export const getApprovalFunnel = (): FunnelItem[] => {
  const draft = contractList.filter((item) => item.status === 'draft').length;
  const pending = contractList.filter((item) => item.status === 'pending').length;
  const active = contractList.filter((item) => item.status === 'active').length;
  const completed = contractList.filter((item) => item.status === 'completed').length;

  const base = draft + pending + active + completed + 60;
  return [
    { stage: '起草', count: base },
    { stage: '待审批', count: Math.round(base * 0.78) },
    { stage: '履行中', count: Math.round(base * 0.58) },
    { stage: '已完结', count: Math.round(base * 0.41) },
  ];
};
