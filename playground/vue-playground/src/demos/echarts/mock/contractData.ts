/**
 * 合同业务 mock 数据（Tab 3 看板唯一数据源）
 *
 * 数据流：contractList → contractAggregates 聚合 → 各图 option 工厂 → 图表渲染
 * 字段设计见 tracks/echarts/notes/contract-charts-analysis.md
 */

export type ContractType = 'sales' | 'purchase' | 'service' | 'framework' | 'supplement';

export type ContractStatus = 'draft' | 'pending' | 'active' | 'completed' | 'terminated';

export interface ContractRecord {
  contractNo: string;
  type: ContractType;
  status: ContractStatus;
  dept: string;
  amount: number;
  signDate: string;
  expireDate?: string;
  frameworkId?: string;
  frameworkName?: string;
  quotaTotal?: number;
  quotaUsed?: number;
}

export const DEPT_LABELS: Record<string, string> = {
  'dept-east-sales': '华东销售部',
  'dept-north-sales': '华北销售部',
  'dept-procurement': '采购中心',
  'dept-tech-service': '技术服务部',
  'dept-legal': '法务合规部',
  'dept-ops': '运营管理部',
};

export const TYPE_LABELS: Record<ContractType, string> = {
  sales: '销售合同',
  purchase: '采购合同',
  service: '服务合同',
  framework: '框架合同',
  supplement: '补充协议',
};

export const STATUS_LABELS: Record<ContractStatus, string> = {
  draft: '起草',
  pending: '待审批',
  active: '履行中',
  completed: '已完结',
  terminated: '已终止',
};

const DEPT_KEYS = Object.keys(DEPT_LABELS);

const FRAMEWORK_TEMPLATES = [
  { id: 'FW-001', name: '2026 技术服务框架', quotaTotal: 5_000_000, quotaUsed: 4_600_000 },
  { id: 'FW-002', name: '设备采购框架', quotaTotal: 8_000_000, quotaUsed: 6_240_000 },
  { id: 'FW-003', name: '运维外包框架', quotaTotal: 3_000_000, quotaUsed: 1_950_000 },
];

/** Demo 基准月：KPI「本月签约」按 signDate 以此月份过滤 */
export const DEMO_CURRENT_MONTH = '2026-06';

/** 128 条合同的类型分布：服务 35% + 框架 25% 为主（平台搭建期叙事） */
const TYPE_SEQUENCE: ContractType[] = [
  ...Array(45).fill('service'),
  ...Array(32).fill('framework'),
  ...Array(26).fill('purchase'),
  ...Array(15).fill('sales'),
  ...Array(10).fill('supplement'),
] as ContractType[];

/** 状态分布：决定 KPI「履行中 42 / 待审批 9」及图③状态柱高度 */
const STATUS_SEQUENCE: ContractStatus[] = [
  ...Array(17).fill('draft'),
  ...Array(9).fill('pending'),
  ...Array(42).fill('active'),
  ...Array(50).fill('completed'),
  ...Array(10).fill('terminated'),
] as ContractStatus[];

const pad = (n: number) => String(n).padStart(2, '0');

/** 生成近 12 个月签约日期，供图①趋势与 KPI 本月签约使用 */
const buildSignDate = (index: number): string => {
  const monthOffset = index % 12;
  const month = ((6 - monthOffset - 1 + 12) % 12) + 1;
  const year = month > 6 ? 2025 : 2026;
  const day = (index % 27) + 1;
  return `${year}-${pad(month)}-${pad(day)}`;
};

/** 服务合同到期日：分桶到未来 7/8/9 月，供图⑥ markLine 预警演示 */
const buildExpireDate = (index: number): string => {
  const buckets = ['2026-07', '2026-08', '2026-09'];
  const bucket = buckets[index % 3];
  const day = (index % 25) + 1;
  return `${bucket}-${pad(day)}`;
};

/** 程序生成 128 条合同；上线后此处可替换为 API 响应 */
const createContractList = (): ContractRecord[] => {
  const list: ContractRecord[] = [];
  let frameworkIdx = 0;

  for (let i = 0; i < 128; i += 1) {
    const type = TYPE_SEQUENCE[i % TYPE_SEQUENCE.length];
    const status = STATUS_SEQUENCE[i % STATUS_SEQUENCE.length];
    const dept = DEPT_KEYS[i % DEPT_KEYS.length];
    const signDate = buildSignDate(i);

    let amount = 400_000 + (i % 17) * 130_000 + (i % 5) * 50_000;
    // 落在基准月的合同给更高金额，使 KPI「本月签约」更有展示感
    if (signDate.startsWith(DEMO_CURRENT_MONTH)) {
      amount = 600_000 + (i % 8) * 120_000;
    }

    const record: ContractRecord = {
      contractNo: `CT-2026-${String(i + 1).padStart(4, '0')}`,
      type,
      status,
      dept,
      amount,
      signDate,
    };

    if (type === 'service') {
      record.expireDate = buildExpireDate(i);
      // 刻意让 8 月到期偏多，触发图⑥超过预警线（见 SERVICE_EXPIRY_THRESHOLD）
      if (i % 9 === 0) {
        record.expireDate = '2026-08-15';
      }
    }

    if (type === 'framework') {
      // 框架合同附带额度字段，供图⑤ TOP3 双系列横向条使用
      const fw = FRAMEWORK_TEMPLATES[frameworkIdx % FRAMEWORK_TEMPLATES.length];
      frameworkIdx += 1;
      record.frameworkId = fw.id;
      record.frameworkName = fw.name;
      record.quotaTotal = fw.quotaTotal;
      record.quotaUsed = fw.quotaUsed + (i % 3) * 10_000;
      record.expireDate = '2027-12-31';
    }

    list.push(record);
  }

  return list;
};

export const contractList: ContractRecord[] = createContractList();
