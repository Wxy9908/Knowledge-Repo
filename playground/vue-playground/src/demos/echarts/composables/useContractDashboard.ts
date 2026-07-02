import { computed, ref } from 'vue';
import { fetchContractKpi } from '../mock/contractApi';
import type { KpiSummary } from '../mock/contractAggregates';

export const useContractDashboard = () => {
  const initialized = ref(false);
  const kpiLoading = ref(false);
  const kpi = ref<KpiSummary | null>(null);
  const error = ref<string | null>(null);
  const reloadKey = ref(0);

  let requestId = 0;

  const isBusy = computed(() => kpiLoading.value);

  const load = async (options: { refreshCharts?: boolean } = {}) => {
    const currentRequestId = ++requestId;
    initialized.value = true;
    error.value = null;
    kpiLoading.value = true;

    if (options.refreshCharts) {
      reloadKey.value += 1;
    }

    try {
      const result = await fetchContractKpi();
      if (currentRequestId !== requestId) return;
      kpi.value = result;
    } catch {
      if (currentRequestId !== requestId) return;
      error.value = 'KPI 数据加载失败，请稍后重试';
      kpi.value = null;
    } finally {
      if (currentRequestId !== requestId) return;
      kpiLoading.value = false;
    }
  };

  return {
    initialized,
    kpiLoading,
    kpi,
    error,
    isBusy,
    reloadKey,
    load,
  };
};
