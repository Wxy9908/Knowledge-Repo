<script setup lang="ts">
import type { ScheduleDay, SelfTestRating } from '@/types/schedule';

defineProps<{
  day: ScheduleDay;
  phaseName: string;
  progress: { pct: number; done: number; total: number };
  checkedIn: boolean;
  isFocus: boolean;
  isTaskChecked: (id: string) => boolean;
  toggleTask: (id: string) => void;
  getSelfTestRating: (id: string) => SelfTestRating | null;
  setSelfTestRating: (id: string, r: SelfTestRating) => void;
  isExternalUrl: (url: string) => boolean;
}>();
</script>

<template>
  <div class="day-head">
    <div>
      <span class="day-badge">Day {{ day.day }}</span>
      <span class="phase-badge">{{ phaseName }}</span>
      <span v-if="checkedIn" class="check-badge">已打卡</span>
      <span v-if="isFocus" class="focus-badge">当前聚焦</span>
    </div>
    <div class="day-progress-bar">
      <div class="bar-track"><div class="bar-fill" :style="{ width: progress.pct + '%' }" /></div>
      <span class="muted-text">{{ progress.done }}/{{ progress.total }}</span>
    </div>
  </div>
  <h2 class="day-title">{{ day.title }}</h2>
  <p class="muted-text">预计 {{ day.duration }}</p>
  <ul v-if="day.objectives?.length" class="objective-list">
    <li v-for="(obj, i) in day.objectives" :key="i">{{ obj }}</li>
  </ul>

  <section v-if="day.resources?.length">
    <h3>资源</h3>
    <ul class="resource-list">
      <li v-for="(res, i) in day.resources" :key="i">
        <a v-if="isExternalUrl(res.url)" :href="res.url" target="_blank" rel="noopener noreferrer">
          {{ res.title }} ↗
        </a>
        <span v-else>{{ res.title }} <code>{{ res.url }}</code></span>
        <span v-if="res.required" class="req-tag">必读</span>
      </li>
    </ul>
  </section>

  <section v-if="day.tasks?.length">
    <h3>今日任务</h3>
    <ul class="task-list">
      <li v-for="task in day.tasks" :key="task.id">
        <label class="task-label">
          <input type="checkbox" :checked="isTaskChecked(task.id)" @change="toggleTask(task.id)" />
          <span :class="{ done: isTaskChecked(task.id) }">{{ task.text }}</span>
        </label>
      </li>
    </ul>
  </section>

  <section v-if="day.selfTest">
    <h3>自测（请诚实标记，影响次日巩固）</h3>
    <div v-if="day.selfTest.questions?.length">
      <h4>概念题</h4>
      <div v-for="q in day.selfTest.questions" :key="q.id" class="selftest-item">
        <p>{{ q.text }}</p>
        <div class="rating-btns">
          <button type="button" class="rate-btn" :class="{ active: getSelfTestRating(q.id) === 'ok' }" @click="setSelfTestRating(q.id, 'ok')">掌握</button>
          <button type="button" class="rate-btn weak" :class="{ active: getSelfTestRating(q.id) === 'weak' }" @click="setSelfTestRating(q.id, 'weak')">不熟</button>
          <button type="button" class="rate-btn" :class="{ active: getSelfTestRating(q.id) === 'skip' }" @click="setSelfTestRating(q.id, 'skip')">跳过</button>
        </div>
      </div>
    </div>
    <div v-if="day.selfTest.practical?.length">
      <h4>实操</h4>
      <div v-for="p in day.selfTest.practical" :key="p.id" class="selftest-item">
        <p>{{ p.text }}</p>
        <div class="rating-btns">
          <button type="button" class="rate-btn" :class="{ active: getSelfTestRating(p.id) === 'ok' }" @click="setSelfTestRating(p.id, 'ok')">掌握</button>
          <button type="button" class="rate-btn weak" :class="{ active: getSelfTestRating(p.id) === 'weak' }" @click="setSelfTestRating(p.id, 'weak')">不熟</button>
          <button type="button" class="rate-btn" :class="{ active: getSelfTestRating(p.id) === 'skip' }" @click="setSelfTestRating(p.id, 'skip')">跳过</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.day-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
.day-badge { font-weight: 700; margin-right: 0.5rem; }
.phase-badge { font-size: 0.75rem; background: var(--accent-dim); color: var(--accent); padding: 0.1rem 0.5rem; border-radius: 4px; }
.check-badge { font-size: 0.75rem; color: var(--success); margin-left: 0.35rem; }
.focus-badge { font-size: 0.75rem; color: var(--warn); margin-left: 0.35rem; }
.day-title { font-size: 1.15rem; margin: 0.5rem 0; }
.muted-text { color: var(--muted); font-size: 0.85rem; }
.day-progress-bar { display: flex; align-items: center; gap: 0.5rem; min-width: 120px; }
.bar-track { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; min-width: 80px; }
.bar-fill { height: 100%; background: var(--accent); border-radius: 4px; }
.objective-list { margin: 0.5rem 0 1rem 1.25rem; color: var(--muted); font-size: 0.9rem; }
h3 { font-size: 0.95rem; margin: 1rem 0 0.5rem; }
h4 { font-size: 0.85rem; color: var(--muted); margin: 0.75rem 0 0.35rem; }
.resource-list, .task-list { list-style: none; }
.resource-list li, .task-list li { padding: 0.35rem 0; font-size: 0.9rem; }
.req-tag { font-size: 0.7rem; background: color-mix(in srgb, var(--danger) 15%, transparent); color: var(--danger); padding: 0.05rem 0.35rem; border-radius: 3px; margin-left: 0.35rem; }
.task-label { display: flex; gap: 0.5rem; align-items: flex-start; cursor: pointer; }
.task-label span.done { text-decoration: line-through; color: var(--muted); }
.selftest-item { padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 6px; border: 1px solid var(--border); }
.rating-btns { display: flex; gap: 0.35rem; margin-top: 0.5rem; }
.rate-btn {
  padding: 0.25rem 0.6rem; border-radius: 4px; border: 1px solid var(--border);
  background: var(--bg); color: var(--muted); cursor: pointer; font-size: 0.75rem;
}
.rate-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.rate-btn.weak.active { background: var(--warn); border-color: var(--warn); }
</style>
