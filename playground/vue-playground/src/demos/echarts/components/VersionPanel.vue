<script setup lang="ts">
import CodeBlock from '@/components/CodeBlock.vue';
import type { ShowcasePanelExpose } from '../types/panel';

defineOptions({ name: 'VersionPanel' });

const techStack = [
  { category: '图表库', name: 'echarts', version: '^6.1.0', note: '全量引入，Demo 主依赖' },
  { category: '框架', name: 'vue', version: '^3.5.13', note: 'Composition API + script setup' },
  { category: '语言', name: 'typescript', version: '^5.8', note: '全项目 TypeScript（vue-tsc）' },
  { category: '路由', name: 'vue-router', version: '^4.5.0', note: 'Demo 路由注册' },
  { category: '构建', name: 'vite', version: '^6.2.0', note: '开发服务器与打包' },
  { category: '包管理', name: 'pnpm', version: '^10.34.4', note: '推荐安装与启动方式' },
];

const versionCompare = [
  {
    dimension: '引入方式',
    v4: '支持 default export',
    v5: '仅 named，import * as echarts',
    v6: '同 5.x',
  },
  {
    dimension: 'Tree-shaking',
    v4: '弱',
    v5: 'echarts/core + use()',
    v6: '同 5.x，持续完善',
  },
  {
    dimension: 'TypeScript',
    v4: '社区 @types',
    v5: '官方内置',
    v6: '官方类型，ESM/CJS 分离',
  },
  {
    dimension: '默认主题',
    v4: 'v4 配色',
    v5: 'v5 新主题',
    v6: 'v6 新主题（图例默认底部）',
  },
  {
    dimension: '升级难度',
    v4: '—',
    v5: '4→5 中等',
    v6: '5→6 较低',
  },
];

const migrationTips = [
  '4→5：import 改为 import * as echarts from "echarts"；内置地图需自行 registerMap',
  '5→6：注意默认主题与图例位置变化，可用 echarts/theme/v5.js 恢复旧视觉',
  '容器必须有明确宽高，组件销毁时调用 chart.dispose() 避免内存泄漏',
];

const docLinks = [
  { label: 'ECharts 官方 Handbook', href: 'https://echarts.apache.org/handbook/en/get-started' },
  {
    label: 'v5 → v6 升级指南',
    href: 'https://echarts.apache.org/handbook/en/basics/release-note/v6-upgrade-guide',
  },
  {
    label: 'v4 → v5 升级指南',
    href: 'https://echarts.apache.org/handbook/en/basics/release-note/v5-upgrade-guide',
  },
];

const importExample = `import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

const option: EChartsOption = { /* ... */ };
chart.setOption(option);`;

const basicUsageExample = `<script setup lang="ts">
import { ref, computed } from 'vue';
import { useEcharts } from './composables/useEcharts';
import type { EChartsOption } from 'echarts';

const chartRef = ref<HTMLElement | null>(null);

const option = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150, 80, 70] }],
}));

useEcharts(chartRef, option);
<\/script>

<template>
  <div ref="chartRef" class="chart-host" />
</template>

<style scoped>
.chart-host {
  width: 100%;
  height: 320px;
}
</style>`;

const resizeCharts = () => {
  // Tab 1 无图表实例
};

defineExpose<ShowcasePanelExpose>({ resizeCharts });
</script>

<template>
  <div class="version-panel">
    <section class="panel section">
      <h2>选型结论</h2>
      <p class="conclusion">
        本 Demo 与推荐新项目均使用 <strong>ECharts 6.x + Vue 3 + TypeScript + Vite 6</strong>。
        合同看板 7 图所用能力均在 ECharts 5/6 稳定支持范围内，无需为业务 Demo 降级版本。
      </p>
    </section>

    <section class="panel section">
      <h2>本 Demo 技术栈</h2>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>类别</th>
              <th>依赖</th>
              <th>版本</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in techStack" :key="row.name">
              <td><span class="category-tag">{{ row.category }}</span></td>
              <td><code>{{ row.name }}</code></td>
              <td><span class="version-badge">{{ row.version }}</span></td>
              <td class="muted">{{ row.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel section">
      <h2>ECharts 大版本对比（简表）</h2>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>维度</th>
              <th>4.x</th>
              <th>5.x</th>
              <th>6.x</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in versionCompare" :key="row.dimension">
              <td>{{ row.dimension }}</td>
              <td>{{ row.v4 }}</td>
              <td>{{ row.v5 }}</td>
              <td>{{ row.v6 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel section">
      <h2>引入方式示例</h2>
      <CodeBlock :code="importExample" language="typescript" />
      <p class="hint">首版 Showcase 沿用全量引入；生产环境可按需改为 echarts/core 按需加载。</p>
    </section>

    <section class="panel section">
      <h2>基本用法示例</h2>
      <CodeBlock :code="basicUsageExample" language="vue" />
      <p class="hint">
        容器需有明确宽高；<code>useEcharts</code> 已封装 init / setOption / resize / dispose，Tab 2 各图均按此模式编写。
      </p>
    </section>

    <section class="panel section">
      <h2>老项目迁移提示</h2>
      <ul class="bullet-list">
        <li v-for="tip in migrationTips" :key="tip">{{ tip }}</li>
      </ul>
    </section>

    <section class="panel section">
      <h2>参考文档</h2>
      <ul class="link-list">
        <li v-for="link in docLinks" :key="link.href">
          <a :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
        </li>
      </ul>
      <p class="hint">完整对比见 <code>tracks/echarts/notes/echarts-version-matrix.md</code></p>
    </section>
  </div>
</template>

<style scoped>
.version-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section {
  margin-bottom: 0;
}

.section h2 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.conclusion {
  font-size: 0.9rem;
  line-height: 1.6;
}

.conclusion strong {
  color: var(--accent);
}

.category-tag {
  font-size: 0.75rem;
  color: var(--muted);
  background: var(--surface);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.version-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent);
  background: var(--accent-dim);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.data-table th,
.data-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}

.data-table th {
  color: var(--muted);
  font-weight: 600;
  background: var(--bg);
  opacity: 0.8;
}

.data-table tr:hover td {
  background: var(--accent-dim);
}

.muted {
  color: var(--muted);
}

.hint {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--muted);
}

.bullet-list,
.link-list {
  list-style: none;
  font-size: 0.9rem;
}

.bullet-list li,
.link-list li {
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--border);
}

.bullet-list li:last-child,
.link-list li:last-child {
  border-bottom: none;
}
</style>
