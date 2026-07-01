<script setup>
import './todos-base.css'
import './todos-components.css'
import TodoList from './components/TodoList.vue'

defineOptions({ name: 'TodosView' })
</script>

<template>
  <main>
    <h1>我的待办</h1>
    <TodoList />
  </main>
</template>

