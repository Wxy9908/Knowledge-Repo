<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { CatalogTrack } from '@/types/catalog';

defineProps<{
  track: CatalogTrack;
}>();

const depthClass = (depth: string): string => `badge badge-${depth}`;
</script>

<template>
  <RouterLink :to="`/tracks/${track.id}`" class="track-card" style="display:block;color:inherit;text-decoration:none">
    <h3>{{ track.title }}</h3>
    <div class="meta-row">
      <span :class="depthClass(track.depth)">{{ track.depth }}</span>
      <span v-if="track.category === 'work-assignment'" class="badge badge-work">任务</span>
      <span class="badge" style="background:#ffffff11;color:var(--muted)">{{ track.status }}</span>
      <span v-if="track.mastery != null" class="badge" style="background:#ffffff11;color:var(--muted)">
        mastery {{ Math.round(track.mastery * 100) }}%
      </span>
    </div>
    <div class="tags">
      <span v-for="tag in track.tags || []" :key="tag" class="tag" style="cursor:default">{{ tag }}</span>
    </div>
    <p style="margin-top:0.5rem;font-size:0.8rem;color:var(--muted)">
      {{ track.noteCount }} 笔记 · {{ track.unitCount }} 单元
      <span v-if="track.next_review"> · 复习 {{ track.next_review }}</span>
    </p>
  </RouterLink>
</template>
