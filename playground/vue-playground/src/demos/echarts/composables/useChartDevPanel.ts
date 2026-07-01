import { ref, nextTick } from 'vue';
import type { ChartDevPanelMode } from '../types/chartDevTools';

/** 「查看代码 / 编辑数据」面板的展开/收起状态，切换后需 nextTick 再 resize 图表 */
export const useChartDevPanel = (
  onPanelChange?: (mode: ChartDevPanelMode) => void,
) => {
  const activePanel = ref<ChartDevPanelMode>(null);

  const notifyChange = async () => {
    await nextTick();
    onPanelChange?.(activePanel.value);
  };

  const handleToggleCode = async () => {
    activePanel.value = activePanel.value === 'code' ? null : 'code';
    await notifyChange();
  };

  const handleToggleData = async () => {
    activePanel.value = activePanel.value === 'data' ? null : 'data';
    await notifyChange();
  };

  return {
    activePanel,
    handleToggleCode,
    handleToggleData,
  };
};
