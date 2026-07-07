<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import DaySection from '@/components/schedule/DaySection.vue';
import { useScheduleProgress } from '@/composables/useScheduleProgress';
import type { TrackSchedule } from '@/types/schedule';

const props = defineProps<{ id: string; schedule: TrackSchedule }>();

const router = useRouter();
const checkInNote = ref('');
const expandAll = ref(false);

const {
  progress,
  focusDay,
  focusDayData,
  isTaskChecked,
  toggleTask,
  getSelfTestRating,
  setSelfTestRating,
  dayProgress,
  isDayCheckedIn,
  checkInDay,
  todayReinforcements,
  tomorrowReinforcements,
  overallProgress,
  suggestedFocusDay,
  applySuggestedDay,
  resetProgress,
  markReinforcementDone,
  weakTags,
} = useScheduleProgress(props.id, props.schedule);

const phaseName = (phaseId: string) =>
  props.schedule.phases.find((p) => p.id === phaseId)?.name ?? phaseId;

const visibleDays = computed(() => {
  if (expandAll.value) return props.schedule.days;
  return props.schedule.days.filter((d) => d.day === focusDay.value);
});

const nextDay = computed(() => props.schedule.days.find((d) => d.day === focusDay.value + 1));

const canCheckIn = computed(() => {
  if (!focusDayData.value) return false;
  return dayProgress(focusDayData.value).pct >= 50;
});

const handleCheckIn = () => {
  if (!focusDayData.value || !canCheckIn.value) return;
  checkInDay(focusDayData.value.day, checkInNote.value.trim() || undefined);
  checkInNote.value = '';
};

const isExternalUrl = (url: string) => url.startsWith('http');

const goPrev = () => {
  if (focusDay.value > 1) focusDay.value -= 1;
};

const goNext = () => {
  if (focusDay.value < props.schedule.totalDays) focusDay.value += 1;
};
</script>

<template>
  <div class="schedule-page">
    <button type="button" class="tag" style="margin-bottom: 1rem" @click="router.push(`/tracks/${id}`)">
      ← 返回轨道详情
    </button>

    <header class="schedule-header">
      <h1 class="page-title">{{ schedule.title }}</h1>
      <p class="page-subtitle">
        {{ schedule.subtitle }} · {{ schedule.hoursPerDay }} · 弹性节奏：可多学/少学/跳天，薄弱点会自动跟到后续
      </p>
    </header>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="label">总进度</div>
        <div class="value">{{ overallProgress.pct }}%</div>
      </div>
      <div class="stat-card">
        <div class="label">当前聚焦</div>
        <div class="value focus-day-num">Day {{ focusDay }}</div>
      </div>
      <div class="stat-card">
        <div class="label">已打卡</div>
        <div class="value">{{ overallProgress.checkIns }}/{{ schedule.totalDays }}</div>
      </div>
      <div class="stat-card">
        <div class="label">待巩固项</div>
        <div class="value" :class="{ warn: overallProgress.weakCount > 0 }">
          {{ overallProgress.weakCount }}
        </div>
      </div>
    </div>

    <div class="panel schedule-toolbar">
      <div class="toolbar-row">
        <span class="toolbar-label">聚焦日</span>
        <div class="day-pills">
          <button
            v-for="d in schedule.days"
            :key="d.day"
            type="button"
            class="day-pill"
            :class="{ active: d.day === focusDay, checked: isDayCheckedIn(d.day) }"
            @click="focusDay = d.day"
          >
            {{ d.day }}
          </button>
        </div>
      </div>
      <div class="toolbar-actions">
        <button type="button" class="btn-sm" :disabled="focusDay <= 1" @click="goPrev">上一天</button>
        <button type="button" class="btn-sm" :disabled="focusDay >= schedule.totalDays" @click="goNext">下一天</button>
        <button type="button" class="btn-sm btn-accent" @click="applySuggestedDay">
          建议日 Day {{ suggestedFocusDay }}
        </button>
        <label class="toggle-all">
          <input v-model="expandAll" type="checkbox" />
          展开全部 {{ schedule.totalDays }} 天
        </label>
        <button type="button" class="btn-sm btn-danger" @click="resetProgress">清空记录</button>
      </div>
    </div>

    <div v-if="todayReinforcements.length" class="panel reinforcement-panel">
      <h2>Day {{ focusDay }} · 针对性巩固</h2>
      <p class="panel-hint">
        根据你之前标记「不熟」的自测项，今日优先补这些（{{ weakTags.length }} 个薄弱维度）
      </p>
      <div v-for="plan in todayReinforcements" :key="plan.tag" class="reinforcement-card">
        <div class="reinforcement-head">
          <strong>{{ plan.entry.title }}</strong>
          <span class="badge warn-badge">{{ plan.label }}</span>
          <span v-if="plan.entry.duration" class="muted-text">{{ plan.entry.duration }}</span>
        </div>
        <p class="muted-text">来自 Day {{ plan.fromDays.join('、') }} 的自测</p>
        <ul class="detail-list">
          <li v-for="(t, i) in plan.itemTexts" :key="i" class="weak-source">{{ t }}</li>
        </ul>
        <ul class="detail-list">
          <li v-for="(task, i) in plan.entry.tasks" :key="i">{{ task }}</li>
        </ul>
        <div v-if="plan.entry.resources?.length" class="resource-links">
          <a
            v-for="res in plan.entry.resources"
            :key="res.url"
            :href="res.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ res.title }} ↗
          </a>
        </div>
        <button type="button" class="btn-sm btn-success" @click="markReinforcementDone(plan.tag)">
          巩固完成，移出待巩固
        </button>
      </div>
    </div>

    <div v-else-if="focusDay > 1" class="panel success-panel">
      <h2>暂无待巩固项</h2>
      <p class="panel-hint">前序没有标记「不熟」的内容，今天按原计划学习即可。</p>
    </div>

    <article v-for="day in visibleDays" :key="day.day" class="panel day-card">
      <DaySection
        :day="day"
        :phase-name="phaseName(day.phase)"
        :progress="dayProgress(day)"
        :checked-in="isDayCheckedIn(day.day)"
        :is-focus="day.day === focusDay"
        :is-task-checked="isTaskChecked"
        :toggle-task="toggleTask"
        :get-self-test-rating="getSelfTestRating"
        :set-self-test-rating="setSelfTestRating"
        :is-external-url="isExternalUrl"
      />
    </article>

    <div v-if="focusDayData && !expandAll" class="panel checkin-panel">
      <h2>Day {{ focusDay }} 打卡</h2>
      <p class="panel-hint">
        完成自测评级后打卡。标记「不熟」的项会自动进入<strong>下一天</strong>的巩固区。
      </p>
      <div v-if="isDayCheckedIn(focusDay)" class="checkin-done">
        ✓ 已于 {{ progress.dayCheckIns[focusDay]?.date }} 打卡
        <span v-if="progress.dayCheckIns[focusDay]?.note"> — {{ progress.dayCheckIns[focusDay].note }}</span>
      </div>
      <template v-else>
        <textarea
          v-model="checkInNote"
          class="checkin-note"
          rows="2"
          placeholder="可选：今日小结或明日安排..."
        />
        <button type="button" class="btn-primary" :disabled="!canCheckIn" @click="handleCheckIn">
          {{ canCheckIn ? '完成今日打卡' : '请先完成至少一半任务与自测评级' }}
        </button>
      </template>
    </div>

    <div v-if="focusDay < schedule.totalDays && !expandAll" class="panel tomorrow-panel">
      <h2>明日预告 · Day {{ focusDay + 1 }}</h2>
      <p v-if="nextDay">
        <strong>{{ nextDay.title }}</strong> · {{ nextDay.duration }}
      </p>
      <div v-if="tomorrowReinforcements.length" class="tomorrow-reinforce">
        <p class="panel-hint">若今日自测仍有「不熟」，明日将巩固：</p>
        <ul>
          <li v-for="plan in tomorrowReinforcements" :key="plan.tag">
            {{ plan.entry.title }}（{{ plan.label }}）
          </li>
        </ul>
      </div>
      <p v-else class="muted-text">若全部掌握，明日无额外巩固，按 Day {{ focusDay + 1 }} 新内容推进。</p>
    </div>
  </div>
</template>

<style scoped>
.schedule-page { max-width: 900px; }
.focus-day-num { font-size: 1.25rem; }
.value.warn { color: var(--warn); }
.schedule-toolbar { display: flex; flex-direction: column; gap: 1rem; }
.toolbar-row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 0.75rem; }
.toolbar-label { color: var(--muted); font-size: 0.85rem; padding-top: 0.35rem; min-width: 3rem; }
.day-pills { display: flex; flex-wrap: wrap; gap: 0.35rem; flex: 1; }
.day-pill {
  width: 2rem; height: 2rem; border-radius: 6px; border: 1px solid var(--border);
  background: var(--bg); color: var(--text); cursor: pointer; font-size: 0.75rem;
}
.day-pill.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.day-pill.checked { box-shadow: inset 0 0 0 2px var(--success); }
.toolbar-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
.toggle-all { font-size: 0.85rem; color: var(--muted); display: flex; align-items: center; gap: 0.35rem; cursor: pointer; }
.btn-sm {
  padding: 0.35rem 0.75rem; border-radius: 6px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text); cursor: pointer; font-size: 0.8rem;
}
.btn-sm:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-accent { border-color: var(--accent); color: var(--accent); }
.btn-success { border-color: var(--success); color: var(--success); }
.btn-danger { border-color: var(--danger); color: var(--danger); }
.btn-primary {
  padding: 0.5rem 1rem; border-radius: 6px; border: none;
  background: var(--accent); color: #fff; cursor: pointer; font-weight: 600;
}
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.panel-hint { color: var(--muted); font-size: 0.9rem; margin-bottom: 0.75rem; }
.muted-text { color: var(--muted); font-size: 0.85rem; }
.reinforcement-panel { border-color: var(--warn); }
.success-panel { border-color: var(--success); }
.success-panel h2 { color: var(--success); }
.reinforcement-card {
  padding: 1rem; margin-top: 0.75rem; border-radius: 8px;
  border: 1px solid var(--border); background: var(--bg);
}
.reinforcement-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.warn-badge { background: color-mix(in srgb, var(--warn) 15%, transparent); color: var(--warn); }
.weak-source { color: var(--warn); font-size: 0.85rem; }
.resource-links { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 0.5rem 0; }
.checkin-panel { border-color: var(--accent); }
.checkin-note {
  width: 100%; margin-bottom: 0.75rem; padding: 0.5rem; border-radius: 6px;
  border: 1px solid var(--border); background: var(--bg); color: var(--text);
  font-family: inherit; resize: vertical;
}
.checkin-done { color: var(--success); font-weight: 600; }
.tomorrow-reinforce ul { margin-left: 1.25rem; color: var(--warn); font-size: 0.9rem; }
</style>
