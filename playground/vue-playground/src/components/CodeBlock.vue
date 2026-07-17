<script setup lang="ts">
import { computed } from 'vue';
import { useCopyText } from '@/composables/useCopyText';
import { highlightCode, normalizeCodeLanguage } from '@/utils/highlightCode';

defineOptions({ name: 'CodeBlock' });

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    title?: string;
    maxHeight?: string;
  }>(),
  {
    language: 'text',
  },
);

const { copied, copy } = useCopyText();

const canonicalLang = computed(() => normalizeCodeLanguage(props.language));
const highlightedHtml = computed(() => highlightCode(props.code, props.language));

const handleCopy = () => {
  void copy(props.code);
};
</script>

<template>
  <div class="code-block-root">
    <div class="code-block-toolbar">
      <span v-if="title" class="code-block-title">{{ title }}</span>
      <span v-else class="code-block-lang">{{ canonicalLang }}</span>
      <button
        type="button"
        class="code-block-copy"
        :aria-label="copied ? '已复制' : '复制代码'"
        @click="handleCopy"
      >
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>
    <div
      class="code-block-body"
      :style="maxHeight ? { maxHeight } : undefined"
      :aria-label="title ?? '代码示例'"
    >
      <div class="code-block-highlight" v-html="highlightedHtml" />
    </div>
  </div>
</template>

<style scoped>
.code-block-root {
  border: 1px solid var(--code-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--code-bg);
}

.code-block-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.45rem 0.75rem;
  border-bottom: 1px solid var(--code-border);
  background: var(--code-surface);
}

.code-block-title,
.code-block-lang {
  font-size: 0.75rem;
  color: var(--code-muted);
  text-transform: lowercase;
}

.code-block-copy {
  flex-shrink: 0;
  margin-left: auto;
  padding: 0.2rem 0.55rem;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--code-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.15s;
}

.code-block-copy:hover {
  color: var(--accent);
}

.code-block-body {
  overflow: auto;
}

.code-block-highlight :deep(pre) {
  margin: 0;
  padding: 1rem;
  overflow: visible;
  background: transparent !important;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.55;
  white-space: pre;
  color: var(--code-text);
}

.code-block-highlight :deep(code) {
  font-family: inherit;
  background: transparent;
  padding: 0;
  color: inherit;
}
</style>
