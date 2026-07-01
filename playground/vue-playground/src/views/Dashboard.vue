<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Catalog } from '@/types/catalog';
import catalogData from '@/generated/catalog.json';
import StatOverview from '@/components/dashboard/StatOverview.vue';
import TrackCard from '@/components/dashboard/TrackCard.vue';
import TagFilter from '@/components/dashboard/TagFilter.vue';
import ReviewReminder from '@/components/dashboard/ReviewReminder.vue';

const catalog = ref<Catalog>(catalogData as Catalog);
const selectedTag = ref('');

const allTags = computed((): string[] => {
  const set = new Set<string>();
  catalog.value.tracks.forEach((t) => (t.tags || []).forEach((tag) => set.add(tag)));
  return [...set].sort();
});

const filteredTracks = computed(() => {
  if (!selectedTag.value) return catalog.value.tracks;
  return catalog.value.tracks.filter((t) => (t.tags || []).includes(selectedTag.value));
});

const depthBars = computed(() => {
  const entries = Object.entries(catalog.value.stats.byDepth || {});
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return entries.map(([label, count]) => ({ label, count, pct: (count / max) * 100 }));
});
</script>

<template>
  <div>
    <h1 class="page-title">知识库总览</h1>
    <p class="page-subtitle">数据更新于 {{ catalog.updated }} · 共 {{ catalog.stats.total }} 条轨道</p>

    <StatOverview :stats="catalog.stats" />

    <div class="panel">
      <h2>深度分布</h2>
      <div v-for="bar in depthBars" :key="bar.label" class="bar-row">
        <span class="bar-label">{{ bar.label }}</span>
        <div class="bar-track"><div class="bar-fill" :style="{ width: bar.pct + '%' }" /></div>
        <span class="bar-count">{{ bar.count }}</span>
      </div>
    </div>

    <ReviewReminder :reminders="catalog.reviewReminders" />

    <TagFilter v-model="selectedTag" :tags="allTags" />

    <div class="card-grid">
      <TrackCard v-for="track in filteredTracks" :key="track.id" :track="track" />
    </div>
  </div>
</template>
