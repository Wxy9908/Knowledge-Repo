<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  reminders: { type: Array, default: () => [] },
});
</script>

<template>
  <div class="panel" v-if="reminders.length">
    <h2>待复习（7 天内）</h2>
    <div v-for="item in reminders" :key="item.id" class="reminder-item">
      <RouterLink :to="`/tracks/${item.id}`">{{ item.title }}</RouterLink>
      <span :class="{ overdue: item.overdue }">{{ item.next_review }}</span>
    </div>
  </div>
</template>
