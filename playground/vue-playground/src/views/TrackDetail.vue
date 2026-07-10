<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import type { Catalog, CatalogArtifact } from '@/types/catalog';
import catalogData from '@/generated/catalog.json';

interface DemoLink {
  title: string;
  description: string;
  route: string;
}

const props = defineProps<{
  id: string;
}>();

const router = useRouter();

const catalog = catalogData as Catalog;

const track = computed(() => catalog.tracks.find((t) => t.id === props.id));

const demoLinks = computed((): DemoLink[] => {
  if (!track.value) return [];
  const artifacts: DemoLink[] = (track.value.artifacts ?? []).map((a: CatalogArtifact) => ({
    title: a.title,
    description: a.description ?? a.title,
    route: a.route,
  }));
  const demos: DemoLink[] = (track.value.demos ?? []).map((d) => ({
    title: d.title,
    description: d.title,
    route: d.route,
  }));
  return [...artifacts, ...demos];
});

const handleBack = () => router.push('/');
</script>

<template>
  <div v-if="track">
    <button type="button" class="tag" style="margin-bottom:1rem" @click="handleBack">← 返回总览</button>
    <h1 class="page-title">{{ track.title }}</h1>
    <p class="page-subtitle">{{ track.id }} · {{ track.category }} · {{ track.depth }}</p>

    <div v-if="track.schedule && track.category !== 'personal-wellbeing'" class="panel schedule-cta">
      <h2>学习计划</h2>
      <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 0.75rem">
        {{ track.schedule.subtitle ?? track.schedule.title }} · 共 {{ track.schedule.totalDays }} 天 · 支持打卡与薄弱点巩固
      </p>
      <RouterLink :to="track.schedule.route" class="schedule-link">
        打开 {{ track.schedule.totalDays }} 天学习计划 →
      </RouterLink>
      <p v-if="track.id === 'mind-body'" class="schedule-hint">
        计划页打卡存在浏览器本地；你在 <code>daily-checkin.md</code> 写的每日记录在下方「笔记」中同步展示。
      </p>
    </div>

    <div
      v-if="track.category === 'personal-wellbeing' && track.syncedNotes?.length"
      class="panel wellbeing-cta"
    >
      <h2>修炼文档</h2>
      <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 0.75rem">
        仅展示框架与对话摘要；个人打卡、基线等私密内容保留在本地 md，不同步到网页。
      </p>
      <div class="note-links">
        <RouterLink
          v-for="note in track.syncedNotes"
          :key="note.slug"
          :to="note.route"
          class="note-link"
        >
          {{ note.title }}
          <span class="note-date">{{ note.updated }}</span>
        </RouterLink>
      </div>
    </div>

    <div class="panel">
      <h2>元数据</h2>
      <ul class="detail-list">
        <li><strong>状态</strong>：{{ track.status }}</li>
        <li v-if="track.mastery != null"><strong>掌握度</strong>：{{ Math.round(track.mastery * 100) }}%</li>
        <li v-if="track.started"><strong>开始</strong>：{{ track.started }}</li>
        <li v-if="track.updated"><strong>更新</strong>：{{ track.updated }}</li>
        <li v-if="track.next_review"><strong>下次复习</strong>：{{ track.next_review }}</li>
        <li v-if="track.related?.length"><strong>关联</strong>：{{ track.related.join(', ') }}</li>
        <li v-if="track.tags?.length"><strong>标签</strong>：{{ track.tags.join(', ') }}</li>
      </ul>
    </div>

    <div class="panel" v-if="track.syncedNotes?.length && track.category !== 'personal-wellbeing'">
      <h2>笔记（{{ track.noteCount }}）</h2>
      <ul class="detail-list note-detail-list">
        <li v-for="note in track.syncedNotes" :key="note.slug">
          <RouterLink :to="note.route">{{ note.title }}</RouterLink>
          <span style="color: var(--muted); margin-left: 0.5rem">更新 {{ note.updated }}</span>
          <code style="display:block;margin-top:0.25rem;color:var(--muted)">tracks/{{ track.id }}/{{ note.path }}</code>
        </li>
      </ul>
    </div>
    <div class="panel" v-else-if="track.noteFiles?.length">
      <h2>笔记（{{ track.noteCount }}）</h2>
      <ul class="detail-list">
        <li v-for="note in track.noteFiles" :key="note.path">
          <code>tracks/{{ track.id }}/{{ note.path }}</code>
        </li>
      </ul>
    </div>

    <div class="panel" v-if="track.units?.length">
      <h2>学习单元（{{ track.unitCount }}）</h2>
      <ul class="detail-list">
        <li v-for="unit in track.units" :key="unit.id">
          {{ unit.id }}
          <span v-if="unit.hasReview" style="color:var(--success);margin-left:0.5rem">✓ review</span>
          <code style="display:block;margin-top:0.25rem;color:var(--muted)">tracks/{{ track.id }}/{{ unit.path }}</code>
        </li>
      </ul>
    </div>

    <div class="panel" v-if="demoLinks.length">
      <h2>Demo</h2>
      <ul class="detail-list">
        <li v-for="(a, i) in demoLinks" :key="i">
          {{ a.description || a.title }}
          <RouterLink
            v-if="a.route"
            :to="a.route"
            style="display:inline-block;margin-top:0.5rem;font-weight:600"
          >
            打开 {{ a.route }} →
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <p>未找到轨道：{{ id }}</p>
  </div>
</template>

<style scoped>
.schedule-cta {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, var(--surface));
}
.schedule-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: #fff !important;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none !important;
}
.schedule-link:hover {
  opacity: 0.9;
}
.schedule-hint {
  margin-top: 0.75rem;
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.5;
}
.wellbeing-cta {
  border-color: #f472b6;
  background: color-mix(in srgb, #ec4899 8%, var(--surface));
}
.note-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.note-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  text-decoration: none !important;
  color: inherit !important;
  font-weight: 600;
}
.note-link.primary {
  border-color: #f472b6;
}
.note-link:hover {
  border-color: var(--accent);
}
.note-date {
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 400;
}
.note-detail-list a {
  font-weight: 600;
}
</style>
