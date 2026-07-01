import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as todosApi from '../api/todosApi'

const ERROR_MESSAGE = '操作失败，请重试'

export const useTodosStore = defineStore('todos', () => {
  const todos = ref([])
  const filter = ref('all')
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  const filteredTodos = computed(() => {
    if (filter.value === 'done') {
      return todos.value.filter((todo) => todo.done)
    }
    if (filter.value === 'active') {
      return todos.value.filter((todo) => !todo.done)
    }
    return todos.value
  })

  const fetchTodos = async () => {
    loading.value = true
    error.value = null

    try {
      todos.value = await todosApi.fetchTodos()
      initialized.value = true
    } catch {
      error.value = ERROR_MESSAGE
    } finally {
      loading.value = false
    }
  }

  const runMutation = async (mutation) => {
    loading.value = true
    error.value = null

    try {
      todos.value = await mutation()
      return true
    } catch {
      error.value = ERROR_MESSAGE
      return false
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (title) => {
    const trimmedTitle = todosApi.validateTodoTitle(title)
    if (!trimmedTitle) {
      return false
    }

    return runMutation(() => todosApi.createTodo(title))
  }

  const removeTodo = async (id) => {
    await runMutation(() => todosApi.deleteTodo(id))
  }

  const toggleTodo = async (id) => {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo) {
      return
    }

    await runMutation(() => todosApi.updateTodo(id, { done: !todo.done }))
  }

  const updateTodoTitle = async (id, title) => {
    const trimmedTitle = todosApi.validateTodoTitle(title)
    if (!trimmedTitle) {
      return false
    }

    return runMutation(() => todosApi.updateTodo(id, { title }))
  }

  const clearCompletedTodos = async () => {
    await runMutation(() => todosApi.clearCompletedTodos())
  }

  const setFilter = (value) => {
    filter.value = value
  }

  return {
    todos,
    filter,
    loading,
    error,
    initialized,
    filteredTodos,
    fetchTodos,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodoTitle,
    clearCompletedTodos,
    setFilter,
  }
})
