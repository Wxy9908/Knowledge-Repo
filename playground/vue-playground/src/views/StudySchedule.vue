<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import flowableSchedule from '@/generated/schedules/flowable.json';
import StudyScheduleBody from '@/views/StudyScheduleBody.vue';
import type { TrackSchedule } from '@/types/schedule';

const props = defineProps<{ id: string }>();

const scheduleMap: Record<string, TrackSchedule> = {
  flowable: { ...(flowableSchedule as unknown as TrackSchedule), trackId: 'flowable' },
};

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
