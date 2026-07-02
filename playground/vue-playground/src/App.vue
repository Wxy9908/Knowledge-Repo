<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-left">
        <RouterLink to="/" class="brand">
          <img src="/logo.svg" alt="" class="brand-mark" width="32" height="32" />
          <span class="brand-text">Knowledge Repo</span>
        </RouterLink>
        <nav class="app-nav">
          <RouterLink to="/">Dashboard</RouterLink>
          <RouterLink to="/demos">Demos</RouterLink>
        </nav>
      </div>
      <div class="header-right">
        <ThemeSwitcher />
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
