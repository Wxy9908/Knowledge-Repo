<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink to="/" class="brand">Knowledge Repo</RouterLink>
      <nav class="app-nav">
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/demos">Demos</RouterLink>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
