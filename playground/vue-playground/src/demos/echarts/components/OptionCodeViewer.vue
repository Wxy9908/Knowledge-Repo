<script setup lang="ts">
import { computed } from 'vue';
import type { EChartsOption } from 'echarts';
import CodeSnippetBlock from './CodeSnippetBlock.vue';

defineOptions({ name: 'OptionCodeViewer' });

const props = defineProps<{
  option: EChartsOption;
}>();

const formattedCode = computed(() => JSON.stringify(props.option, null, 2));
</script>

<template>
  <div class="code-viewer">
    <CodeSnippetBlock
      :code="formattedCode"
      title="当前 option JSON"
      language="json"
      max-height="280px"
    />
  </div>
</template>

<style scoped>
.code-viewer {
  border-top: 1px solid var(--border);
  background: var(--bg);
}

.code-viewer :deep(.code-snippet) {
  border: none;
  border-radius: 0;
}
</style>
