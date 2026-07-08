<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import StudyScheduleBody from '@/views/StudyScheduleBody.vue';
import type { TrackSchedule } from '@/types/schedule';

const props = defineProps<{ id: string }>();

const scheduleModules = import.meta.glob<TrackSchedule>(
  '@/generated/schedules/*.json',
  { eager: true, import: 'default' },
);

const scheduleMap: Record<string, TrackSchedule> = Object.fromEntries(
  Object.entries(scheduleModules).map(([filePath, data]) => {
    const trackId = filePath.match(/\/([^/]+)\.json$/)?.[1] ?? '';
    return [trackId, { ...data, trackId }];
  }),
);

const schedule = computed(() => scheduleMap[props.id] ?? null);
</script>

<template>
  <div v-if="!schedule" class="schedule-page">
    <p>未找到 <code>{{ id }}</code> 的学习计划。请先运行 catalog 同步。</p>
    <RouterLink :to="`/tracks/${id}`">返回轨道</RouterLink>
  </div>
  <StudyScheduleBody v-else :id="id" :schedule="schedule" />
</template>

<style scoped>
.schedule-page { max-width: 900px; padding: 1rem 0; }
</style>
