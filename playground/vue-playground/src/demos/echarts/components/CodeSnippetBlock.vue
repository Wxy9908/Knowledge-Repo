<script setup lang="ts">
import { computed, ref } from 'vue';
import { highlightCode, type CodeSnippetLanguage } from '../composables/highlightCode';
import 'highlight.js/styles/github-dark.min.css';

defineOptions({ name: 'CodeSnippetBlock' });

const props = withDefaults(
  defineProps<{
    code: string;
    title?: string;
    maxHeight?: string;
    language?: CodeSnippetLanguage;
  }>(),
  {
    language: 'typescript',
  },
);

const copied = ref(false);

const highlightedHtml = computed(() => highlightCode(props.code, props.language));

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    window.setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    copied.value = false;
  }
};
</script>

<template>
  <div class="code-snippet">
    <div class="code-snippet-toolbar">
      <span v-if="title" class="code-snippet-title">{{ title }}</span>
      <span v-else class="code-snippet-lang">{{ language }}</span>
      <button
        type="button"
        class="copy-btn"
        :aria-label="copied ? '已复制' : '复制代码'"
        @click="handleCopy"
      >
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>
    <div
      class="code-snippet-body"
      :style="maxHeight ? { maxHeight } : undefined"
      :aria-label="title ?? '代码示例'"
    >
      <div class="code-block highlighted" v-html="highlightedHtml" />
    </div>
  </div>
</template>

<style scoped>
.code-snippet {
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  background: var(--bg);
}

.code-snippet-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.code-snippet-title,
.code-snippet-lang {
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: lowercase;
}

.copy-btn {
  flex-shrink: 0;
  margin-left: auto;
  padding: 0.25rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.75rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.copy-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.code-snippet-body {
  overflow: auto;
}

.code-block.highlighted :deep(pre) {
  margin: 0;
  padding: 1rem;
  overflow: visible;
  background: transparent !important;
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.55;
}

.code-block.highlighted :deep(code) {
  font-family: inherit;
  background: transparent;
  padding: 0;
}
</style>
