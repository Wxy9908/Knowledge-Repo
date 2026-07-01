<script setup>
defineProps({
  stats: { type: Object, required: true },
});
</script>

<template>
  <div class="stat-grid">
    <div class="stat-card">
      <div class="label">轨道总数</div>
      <div class="value">{{ stats.total }}</div>
    </div>
    <div v-for="(count, key) in stats.byDepth" :key="'d-' + key" class="stat-card">
      <div class="label">depth: {{ key }}</div>
      <div class="value">{{ count }}</div>
    </div>
    <div v-for="(count, key) in stats.byStatus" :key="'s-' + key" class="stat-card">
      <div class="label">{{ key }}</div>
      <div class="value">{{ count }}</div>
    </div>
  </div>
</template>
