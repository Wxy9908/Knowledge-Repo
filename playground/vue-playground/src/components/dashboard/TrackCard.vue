<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { CatalogTrack } from '@/types/catalog';

defineProps<{
  track: CatalogTrack;
}>();

const depthClass = (depth: string): string => `badge badge-${depth}`;

const STATUS_META: Record<string, { label: string; class: string }> = {
  in_progress: { label: '进行中', class: 'in-progress' },
  completed: { label: '已完结', class: 'completed' },
  planned: { label: '计划中', class: 'planned' },
};

const statusMeta = (status: string) =>
  STATUS_META[status] ?? { label: status, class: 'unknown' };
</script>

<template>
  <RouterLink
    :to="`/tracks/${track.id}`"
    class="track-card"
    :class="`track-card--${statusMeta(track.status).class}`"
  >
    <h3>{{ track.title }}</h3>
    <div class="meta-row">
      <span :class="depthClass(track.depth)">{{ track.depth }}</span>
      <span v-if="track.category === 'work-assignment'" class="badge badge-work">任务</span>
      <span v-if="track.category === 'personal-wellbeing'" class="badge badge-wellbeing">身心</span>
      <span :class="['badge', `badge-status-${statusMeta(track.status).class}`]">
        {{ statusMeta(track.status).label }}
      </span>
      <span v-if="track.mastery != null" class="badge" style="background:#ffffff11;color:var(--muted)">
        mastery {{ Math.round(track.mastery * 100) }}%
      </span>
    </div>
    <div class="tags">
      <span v-for="tag in track.tags || []" :key="tag" class="tag" style="cursor:default">{{ tag }}</span>
    </div>
    <p class="track-card__footer">
      {{ track.noteCount }} 笔记 · {{ track.unitCount }} 单元
      <span v-if="track.schedule"> · {{ track.schedule.totalDays }} 天计划</span>
      <span v-if="track.next_review"> · 复习 {{ track.next_review }}</span>
    </p>
  </RouterLink>
</template>
