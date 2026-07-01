<script setup lang="ts">
import { computed, useSlots, type MaybeRefOrGetter, toValue } from 'vue';
import type { EChartsOption } from 'echarts';
import ChartCard from './ChartCard.vue';
import ChartDevToolbar from './ChartDevToolbar.vue';
import OptionCodeViewer from './OptionCodeViewer.vue';
import { useChartDevPanel } from '../composables/useChartDevPanel';
import type { ChartDevPanelMode } from '../types/chartDevTools';

defineOptions({ name: 'ChartInteractiveCard' });

/**
 * 可交互图表卡片（统一插件）
 *
 * - 工具栏：[查看代码] 展示 option JSON；[编辑数据] 需传入 #data-form 插槽才显示
 * - 默认插槽：放图表组件（内部用 useEcharts）
 * - 事件 panelChange：面板展开/收起后通知父组件 resize
 */
const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    height?: string;
    ariaLabel?: string;
    option: MaybeRefOrGetter<EChartsOption>;
    showCode?: boolean;
    showDataForm?: boolean;
  }>(),
  {
    description: '',
    height: '320px',
    ariaLabel: '',
    showCode: true,
    showDataForm: undefined,
  },
);

const emit = defineEmits<{
  panelChange: [mode: ChartDevPanelMode];
}>();

const slots = useSlots();

const hasDataFormSlot = computed(() => !!slots['data-form']);

// showDataForm 未传时：有 #data-form 插槽才显示「编辑数据」按钮
const showDataFormButton = computed(() => {
  if (props.showDataForm === false) return false;
  if (props.showDataForm === true) return true;
  return hasDataFormSlot.value;
});

// 与 OptionCodeViewer 共用同一份 option，保证「看到的代码」和「当前图表」一致
const resolvedOption = computed(() => toValue(props.option));

const { activePanel, handleToggleCode, handleToggleData } = useChartDevPanel((mode) => {
  emit('panelChange', mode);
});

const chartAriaLabel = computed(() => props.ariaLabel || props.title);
</script>

<template>
  <ChartCard
    :title="title"
    :description="description"
    :height="height"
    :ariaLabel="chartAriaLabel"
  >
    <template v-if="showCode || showDataFormButton" #toolbar>
      <ChartDevToolbar
        :active-panel="activePanel"
        :show-data-form="showDataFormButton"
        @toggle-code="handleToggleCode"
        @toggle-data="handleToggleData"
      />
    </template>

    <slot />

    <template v-if="activePanel" #footer>
      <OptionCodeViewer
        v-if="activePanel === 'code'"
        :option="resolvedOption"
      />
      <slot v-else-if="activePanel === 'data'" name="data-form" />
    </template>
  </ChartCard>
</template>
