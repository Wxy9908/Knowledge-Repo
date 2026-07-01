<script setup lang="ts">
import { ref, watch, nextTick, computed, type ComponentPublicInstance } from 'vue';
import VersionPanel from './components/VersionPanel.vue';
import BasicChartsPanel from './components/BasicChartsPanel.vue';
import ContractDashboardPanel from './components/ContractDashboardPanel.vue';
import type { ShowcasePanelExpose } from './types/panel';

defineOptions({ name: 'EchartsShowcase' });

type TabId = 'version' | 'basics' | 'contract';

interface TabItem {
  id: TabId;
  label: string;
}

const tabs: TabItem[] = [
  { id: 'version', label: '版本说明' },
  { id: 'basics', label: '基础图表' },
  { id: 'contract', label: '合同业务看板' },
];

const activeTab = ref<TabId>('version');

const versionPanelRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const basicChartsPanelRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);
const contractDashboardPanelRef = ref<ComponentPublicInstance & ShowcasePanelExpose | null>(null);

const panelRefMap: Record<TabId, typeof versionPanelRef> = {
  version: versionPanelRef,
  basics: basicChartsPanelRef,
  contract: contractDashboardPanelRef,
};

const indicatorStyle = computed(() => {
  const index = tabs.findIndex(t => t.id === activeTab.value);
  return {
    width: `${100 / tabs.length}%`,
    transform: `translateX(${index * 100}%)`,
  };
});

const handleTabClick = (tabId: TabId) => {
  activeTab.value = tabId;
};

const resizeActivePanel = async () => {
  await nextTick();
  panelRefMap[activeTab.value].value?.resizeCharts();
};

watch(activeTab, () => {
  resizeActivePanel();
});
</script>

<template>
  <div class="showcase-page">
    <div class="header-section">
      <div class="title-group">
        <h1 class="page-title">ECharts 演示中心</h1>
        <p class="page-subtitle">
          <span class="path">tracks/echarts</span>
          <span class="separator">•</span>
          <span class="status">全量能力验证 Demo</span>
        </p>
      </div>
      <router-link to="/" class="back-link">
        <span class="icon">←</span> 返回首页
      </router-link>
    </div>

    <div class="tab-bar-container">
      <div class="tab-bar" role="tablist" aria-label="ECharts 演示中心标签页">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="handleTabClick(tab.id)"
        >
          {{ tab.label }}
        </button>
        <div class="tab-indicator" :style="indicatorStyle" />
      </div>
    </div>

    <div class="tab-panels">
      <div v-show="activeTab === 'version'" role="tabpanel" aria-label="版本说明">
        <VersionPanel ref="versionPanelRef" />
      </div>
      <div v-show="activeTab === 'basics'" role="tabpanel" aria-label="基础图表">
        <BasicChartsPanel ref="basicChartsPanelRef" />
      </div>
      <div v-show="activeTab === 'contract'" role="tabpanel" aria-label="合同业务看板">
        <ContractDashboardPanel ref="contractDashboardPanelRef" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.showcase-page {
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--text) 0%, var(--muted) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--muted);
}

.separator {
  opacity: 0.3;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  font-size: 0.85rem;
  color: var(--muted);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: all 0.2s;
}

.back-link:hover {
  color: var(--text);
  border-color: var(--accent);
  text-decoration: none;
  transform: translateX(-2px);
}

.tab-bar-container {
  margin-bottom: 1.5rem;
}

.tab-bar {
  position: relative;
  display: flex;
  padding: 0.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}

.tab-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.tab-btn:hover {
  color: var(--text);
}

.tab-btn.active {
  color: var(--text);
}

.tab-indicator {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0;
  background: var(--accent-dim);
  border: 1px solid var(--accent);
  border-radius: 7px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-panels {
  min-height: 400px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
