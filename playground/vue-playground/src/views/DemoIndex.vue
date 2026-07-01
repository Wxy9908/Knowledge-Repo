<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { demoRegistry } from '@/demos/registry';

const tracks = [...new Set(demoRegistry.map((d) => d.track))];
</script>

<template>
  <div>
    <h1 class="page-title">技术 Demo</h1>
    <p class="page-subtitle">点击即可打开，均在当前 playground 内</p>

    <div class="panel" v-for="track in tracks" :key="track">
      <h2>{{ track }}</h2>
      <ul class="detail-list">
        <li v-for="demo in demoRegistry.filter((d) => d.track === track)" :key="demo.id">
          <RouterLink :to="demo.path">{{ demo.title }}</RouterLink>
          <code style="display:block;margin-top:0.25rem;color:var(--muted)">{{ demo.path }}</code>
        </li>
      </ul>
    </div>

    <p v-if="!demoRegistry.length" style="color:var(--muted)">暂无 demo。</p>
  </div>
</template>
