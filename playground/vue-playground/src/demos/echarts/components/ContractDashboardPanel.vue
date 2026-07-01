<script setup lang="ts">
import { ref, computed, nextTick, type ComponentPublicInstance } from 'vue';
import ChartInteractiveCard from './ChartInteractiveCard.vue';
import ContractTrendChart from './contract/ContractTrendChart.vue';
import ContractTypePieChart from './contract/ContractTypePieChart.vue';
import ContractStatusBarChart from './contract/ContractStatusBarChart.vue';
import ContractDeptBarChart from './contract/ContractDeptBarChart.vue';
import ContractFrameworkTop3Chart from './contract/ContractFrameworkTop3Chart.vue';
import ContractServiceExpiryChart from './contract/ContractServiceExpiryChart.vue';
import ContractApprovalFunnelChart from './contract/ContractApprovalFunnelChart.vue';
import { getKpiSummary } from '../mock/contractAggregates';
import {
  buildApprovalFunnelOption,
  buildDeptBarOption,
  buildFrameworkTop3Option,
  buildServiceExpiryOption,
  buildStatusBarOption,
  buildTrendOption,
  buildTypePieOption,
} from '../options/contract';
import type { ShowcasePanelExpose } from '../types/panel';

defineOptions({ name: 'ContractDashboardPanel' });

// 7 张图的 ref，供 Tab 切换 / 面板展开后统一 resize
const trendRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const typePieRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const statusRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const deptRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const frameworkRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const expiryRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const funnelRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);

const chartRefMap = {
  trend: trendRef,
  typePie: typePieRef,
  status: statusRef,
  dept: deptRef,
  framework: frameworkRef,
  expiry: expiryRef,
  funnel: funnelRef,
} as const;

// KPI 非写死数字：每次从 contractList 聚合计算（见 getKpiSummary）
const kpi = computed(() => getKpiSummary());

// 各图 option 供 ChartInteractiveCard「查看代码」与图表组件共用
const trendOption = computed(() => buildTrendOption());
const typePieOption = computed(() => buildTypePieOption());
const statusOption = computed(() => buildStatusBarOption());
const deptOption = computed(() => buildDeptBarOption());
const frameworkOption = computed(() => buildFrameworkTop3Option());
const expiryOption = computed(() => buildServiceExpiryOption());
const funnelOption = computed(() => buildApprovalFunnelOption());

// 展开代码/数据面板后容器高度变化，需等 DOM 更新再 resize
const handlePanelChange = async (chartKey: keyof typeof chartRefMap) => {
  await nextTick();
  chartRefMap[chartKey].value?.resizeCharts();
};

// EchartsShowcase 切换 Tab 回来时调用
const resizeCharts = () => {
  Object.values(chartRefMap).forEach((chartRef) => {
    chartRef.value?.resizeCharts();
  });
};

defineExpose<ShowcasePanelExpose>({ resizeCharts });
</script>

<template>
  <div class="contract-dashboard">
    <p class="panel-hint">
      合同平台首页驾驶舱 · 数据来自 mock 聚合 · 各图支持查看 option 代码
    </p>

    <div class="kpi-row">
      <div class="stat-card kpi-card">
        <div class="kpi-icon total">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="label">合同总数</div>
          <div class="value">{{ kpi.totalCount }}</div>
        </div>
      </div>
      <div class="stat-card kpi-card">
        <div class="kpi-icon sign">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="label">本月签约</div>
          <div class="value">{{ kpi.monthSignLabel }}</div>
        </div>
      </div>
      <div class="stat-card kpi-card">
        <div class="kpi-icon active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="label">履行中</div>
          <div class="value">{{ kpi.activeCount }}</div>
        </div>
      </div>
      <div class="stat-card kpi-card">
        <div class="kpi-icon pending">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div class="kpi-content">
          <div class="label">待审批</div>
          <div class="value">{{ kpi.pendingCount }}</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <ChartInteractiveCard
        title="月度签约金额趋势"
        description="⑦ 管理复盘 · 近 12 个月签约走势（万元）"
        height="300px"
        aria-label="月度签约金额趋势"
        :option="trendOption"
        @panel-change="handlePanelChange('trend')"
      >
        <ContractTrendChart ref="trendRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        title="合同类型占比"
        description="⑦ 管理复盘 · 服务 + 框架为主"
        height="300px"
        aria-label="合同类型占比"
        :option="typePieOption"
        @panel-change="handlePanelChange('typePie')"
      >
        <ContractTypePieChart ref="typePieRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        title="合同状态分布"
        description="横切面 · 审批签署 → 履约执行"
        height="280px"
        aria-label="合同状态分布"
        :option="statusOption"
        @panel-change="handlePanelChange('status')"
      >
        <ContractStatusBarChart ref="statusRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        title="部门签约额对比"
        description="⑦ 管理复盘 · 虚拟部门排名"
        height="280px"
        aria-label="部门签约额对比"
        :option="deptOption"
        @panel-change="handlePanelChange('dept')"
      >
        <ContractDeptBarChart ref="deptRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        title="框架额度 TOP3"
        description="④ 履约执行 · 已用 / 总额度"
        height="280px"
        aria-label="框架额度 TOP3"
        :option="frameworkOption"
        @panel-change="handlePanelChange('framework')"
      >
        <ContractFrameworkTop3Chart ref="frameworkRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        title="服务合同到期分布"
        description="⑥ 到期与风险 · 未来 90 天"
        height="280px"
        aria-label="服务合同到期分布"
        :option="expiryOption"
        @panel-change="handlePanelChange('expiry')"
      >
        <ContractServiceExpiryChart ref="expiryRef" />
      </ChartInteractiveCard>

      <ChartInteractiveCard
        class="grid-funnel"
        title="审批流程漏斗"
        description="③ 审批与签署 · 起草 → 待审 → 履行 → 完结"
        height="260px"
        aria-label="审批流程漏斗"
        :option="funnelOption"
        @panel-change="handlePanelChange('funnel')"
      >
        <ContractApprovalFunnelChart ref="funnelRef" />
      </ChartInteractiveCard>
    </div>
  </div>
</template>

<style scoped>
.contract-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-hint {
  font-size: 0.85rem;
  color: var(--muted);
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0;
  transition: transform 0.2s, border-color 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}

.kpi-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}

.kpi-icon svg {
  width: 20px;
  height: 20px;
}

.kpi-icon.total { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.kpi-icon.sign { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.kpi-icon.active { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
.kpi-icon.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

.kpi-content .label {
  color: var(--muted);
  font-size: 0.8rem;
  margin-bottom: 0.1rem;
}

.kpi-content .value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.grid-funnel {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .kpi-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .grid-funnel {
    grid-column: 1 / -1;
  }
}
</style>
