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

    <div class="panel" v-if="track.noteFiles?.length">
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
