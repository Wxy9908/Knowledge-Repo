<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import MarkdownContent from '@/components/notes/MarkdownContent.vue';
import type { Catalog } from '@/types/catalog';
import type { TrackNotesBundle } from '@/types/notes';
import catalogData from '@/generated/catalog.json';

const noteModules = import.meta.glob<{ default: TrackNotesBundle }>(
  '../generated/notes/*.json',
  { eager: true },
);

const props = defineProps<{
  id: string;
  slug: string;
}>();

const router = useRouter();
const catalog = catalogData as Catalog;

const track = computed(() => catalog.tracks.find((t) => t.id === props.id));

const bundle = computed(() => {
  const key = `../generated/notes/${props.id}.json`;
  return noteModules[key]?.default ?? null;
});

const note = computed(() => bundle.value?.notes.find((n) => n.slug === props.slug));

const siblings = computed(() => bundle.value?.notes ?? []);
</script>

<template>
  <div v-if="track && note" class="note-page">
    <button type="button" class="tag" style="margin-bottom: 1rem" @click="router.push(`/tracks/${id}`)">
      ← 返回 {{ track.title }}
    </button>

    <header class="note-header">
      <h1 class="page-title">{{ note.title }}</h1>
      <p class="page-subtitle">
        tracks/{{ id }}/{{ note.path }} · 同步于 {{ note.updated }}
      </p>
    </header>

    <div class="panel note-content">
      <MarkdownContent :content="note.content" />
    </div>

    <div v-if="siblings.length > 1" class="panel">
      <h2>同轨道笔记</h2>
      <ul class="detail-list">
        <li v-for="item in siblings" :key="item.slug">
          <RouterLink
            :to="`/tracks/${id}/notes/${item.slug}`"
            :style="{ fontWeight: item.slug === slug ? 700 : 400 }"
          >
            {{ item.title }}
          </RouterLink>
          <span style="color: var(--muted); margin-left: 0.5rem">{{ item.updated }}</span>
        </li>
      </ul>
    </div>
  </div>

  <div v-else class="panel">
    <p v-if="!track">未找到轨道：{{ id }}</p>
    <p v-else-if="!bundle">笔记尚未同步，请在仓库根目录运行 <code>npm run sync-catalog</code></p>
    <p v-else>未找到笔记：{{ slug }}</p>
    <button type="button" class="tag" @click="router.push('/')">返回总览</button>
  </div>
</template>

<style scoped>
.note-page {
  max-width: 900px;
}
.note-content {
  padding: 1.25rem 1.5rem;
}
</style>
