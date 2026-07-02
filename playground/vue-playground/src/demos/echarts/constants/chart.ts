import type { InjectionKey, Ref } from 'vue';

/** ChartInteractiveCard → 基础图表演示，用于 DOM 遮罩 loading（合同看板已改用 ECharts 原生 loading） */
export const CHART_CARD_LOADING_KEY: InjectionKey<Ref<boolean>> = Symbol('chartCardLoading');

/** ContractDashboardPanel → 各合同图表，刷新时递增以触发重新请求 */
export const DASHBOARD_RELOAD_KEY: InjectionKey<Ref<number>> = Symbol('dashboardReload');
