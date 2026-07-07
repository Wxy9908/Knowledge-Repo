import { computed, ref, watch } from 'vue';
import type {
  ReinforcementPlan,
  ScheduleDay,
  ScheduleProgress,
  SelfTestRating,
  TrackSchedule,
} from '@/types/schedule';

const STORAGE_PREFIX = 'knowledge-repo-schedule-';

const defaultProgress = (focusDay = 1): ScheduleProgress => ({
  focusDay,
  taskChecked: {},
  selfTestRating: {},
  dayCheckIns: {},
});

export function useScheduleProgress(trackId: string, schedule: TrackSchedule) {
  const storageKey = `${STORAGE_PREFIX}${trackId}`;

  const load = (): ScheduleProgress => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return defaultProgress();
      const parsed = JSON.parse(raw) as ScheduleProgress;
      return {
        ...defaultProgress(parsed.focusDay || 1),
        ...parsed,
        taskChecked: parsed.taskChecked ?? {},
        selfTestRating: parsed.selfTestRating ?? {},
        dayCheckIns: parsed.dayCheckIns ?? {},
      };
    } catch {
      return defaultProgress();
    }
  };

  const progress = ref<ScheduleProgress>(load());

  const persist = () => {
    localStorage.setItem(storageKey, JSON.stringify(progress.value));
  };

  watch(progress, persist, { deep: true });

  const focusDay = computed({
    get: () => progress.value.focusDay,
    set: (day: number) => {
      progress.value.focusDay = Math.min(Math.max(1, day), schedule.totalDays);
    },
  });

  const focusDayData = computed(() =>
    schedule.days.find((d) => d.day === focusDay.value),
  );

  const isTaskChecked = (taskId: string) => !!progress.value.taskChecked[taskId];

  const toggleTask = (taskId: string) => {
    progress.value.taskChecked[taskId] = !progress.value.taskChecked[taskId];
  };

  const getSelfTestRating = (itemId: string): SelfTestRating | null =>
    progress.value.selfTestRating[itemId] ?? null;

  const setSelfTestRating = (itemId: string, rating: SelfTestRating) => {
    progress.value.selfTestRating[itemId] = rating;
  };

  const collectSelfTestItems = (day: ScheduleDay) => {
    const items = [
      ...(day.selfTest?.questions ?? []),
      ...(day.selfTest?.practical ?? []),
    ];
    return items;
  };

  const dayProgress = (day: ScheduleDay) => {
    const tasks = day.tasks ?? [];
    const tests = collectSelfTestItems(day);
    const tasksDone = tasks.filter((t) => progress.value.taskChecked[t.id]).length;
    const testsRated = tests.filter((t) => progress.value.selfTestRating[t.id]).length;
    const total = tasks.length + tests.length;
    const done = tasksDone + testsRated;
    return { tasksDone, tasksTotal: tasks.length, testsRated, testsTotal: tests.length, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  const isDayCheckedIn = (day: number) => !!progress.value.dayCheckIns[day];

  const checkInDay = (day: number, note?: string) => {
    progress.value.dayCheckIns[day] = {
      date: new Date().toISOString().slice(0, 10),
      note,
    };
  };

  const weakItemsByDay = computed(() => {
    const map = new Map<number, { id: string; text: string; tags: string[] }[]>();
    for (const day of schedule.days) {
      const weak: { id: string; text: string; tags: string[] }[] = [];
      for (const item of collectSelfTestItems(day)) {
        if (progress.value.selfTestRating[item.id] === 'weak') {
          weak.push({ id: item.id, text: item.text, tags: item.tags ?? [] });
        }
      }
      if (weak.length) map.set(day.day, weak);
    }
    return map;
  });

  const weakTags = computed(() => {
    const tags = new Set<string>();
    weakItemsByDay.value.forEach((items) => {
      items.forEach((item) => item.tags.forEach((tag) => tags.add(tag)));
    });
    return [...tags];
  });

  const buildReinforcementPlans = (forDay: number): ReinforcementPlan[] => {
    const priorWeakTags = new Map<string, { fromDays: number[]; itemTexts: string[] }>();

    for (const day of schedule.days) {
      if (day.day >= forDay) continue;
      for (const item of collectSelfTestItems(day)) {
        if (progress.value.selfTestRating[item.id] !== 'weak') continue;
        for (const tag of item.tags ?? []) {
          const existing = priorWeakTags.get(tag) ?? { fromDays: [], itemTexts: [] };
          if (!existing.fromDays.includes(day.day)) existing.fromDays.push(day.day);
          existing.itemTexts.push(`Day ${day.day}：${item.text}`);
          priorWeakTags.set(tag, existing);
        }
      }
    }

    const plans: ReinforcementPlan[] = [];
    priorWeakTags.forEach((meta, tag) => {
      const entry = schedule.reinforcementLibrary[tag];
      if (!entry) return;
      plans.push({
        tag,
        label: schedule.tagLabels[tag] ?? tag,
        entry,
        fromDays: meta.fromDays.sort((a, b) => a - b),
        itemTexts: meta.itemTexts,
      });
    });

    return plans.sort((a, b) => a.fromDays[0] - b.fromDays[0]);
  };

  const todayReinforcements = computed(() => buildReinforcementPlans(focusDay.value));

  const tomorrowReinforcements = computed(() => {
    const next = Math.min(focusDay.value + 1, schedule.totalDays);
    return buildReinforcementPlans(next);
  });

  const overallProgress = computed(() => {
    let total = 0;
    let done = 0;
    for (const day of schedule.days) {
      const p = dayProgress(day);
      total += p.total;
      done += p.done;
    }
    const checkIns = Object.keys(progress.value.dayCheckIns).length;
    return {
      total,
      done,
      pct: total ? Math.round((done / total) * 100) : 0,
      checkIns,
      weakCount: [...weakItemsByDay.value.values()].reduce((s, arr) => s + arr.length, 0),
    };
  });

  const suggestedFocusDay = computed(() => {
    for (const day of schedule.days) {
      const p = dayProgress(day);
      if (p.pct < 100 || !isDayCheckedIn(day.day)) return day.day;
    }
    return schedule.totalDays;
  });

  const applySuggestedDay = () => {
    focusDay.value = suggestedFocusDay.value;
  };

  const resetProgress = () => {
    if (!confirm('确定清空本轨道的打卡与自测记录？')) return;
    progress.value = defaultProgress(1);
  };

  const markReinforcementDone = (tag: string) => {
    for (const day of schedule.days) {
      for (const item of collectSelfTestItems(day)) {
        if (item.tags?.includes(tag) && progress.value.selfTestRating[item.id] === 'weak') {
          progress.value.selfTestRating[item.id] = 'ok';
        }
      }
    }
  };

  return {
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
    weakItemsByDay,
    weakTags,
    todayReinforcements,
    tomorrowReinforcements,
    overallProgress,
    suggestedFocusDay,
    applySuggestedDay,
    resetProgress,
    markReinforcementDone,
    collectSelfTestItems,
  };
}
