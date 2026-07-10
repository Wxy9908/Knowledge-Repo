<script setup lang="ts">
import { computed } from 'vue';
import { renderMarkdown } from '@/utils/renderMarkdown';

const props = defineProps<{
  content: string;
}>();

const html = computed(() => renderMarkdown(props.content));
</script>

<template>
  <article class="markdown-body" v-html="html" />
</template>

<style scoped>
.markdown-body :deep(h1) {
  font-size: 1.5rem;
  margin: 1.25rem 0 0.75rem;
}
.markdown-body :deep(h2) {
  font-size: 1.2rem;
  margin: 1.1rem 0 0.6rem;
  color: var(--accent);
}
.markdown-body :deep(h3) {
  font-size: 1.05rem;
  margin: 1rem 0 0.5rem;
}
.markdown-body :deep(p),
.markdown-body :deep(ul),
.markdown-body :deep(table),
.markdown-body :deep(blockquote),
.markdown-body :deep(pre) {
  margin: 0.6rem 0;
  line-height: 1.65;
}
.markdown-body :deep(ul) {
  padding-left: 1.25rem;
}
.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: 0.75rem;
  color: var(--muted);
}
.markdown-body :deep(code) {
  background: var(--bg);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-size: 0.9em;
}
.markdown-body :deep(pre) {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  overflow-x: auto;
}
.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
}
.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--border);
  padding: 0.45rem 0.6rem;
  text-align: left;
}
.markdown-body :deep(th) {
  background: color-mix(in srgb, var(--accent) 10%, var(--surface));
}
.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.25rem 0;
}
.markdown-body :deep(a) {
  color: var(--accent);
}
</style>
