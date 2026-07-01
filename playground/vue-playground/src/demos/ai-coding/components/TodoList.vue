<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodosStore } from '../stores/todos'

defineOptions({
  name: 'TodoList',
})

const todosStore = useTodosStore()
const { filteredTodos, filter, loading, error, initialized } = storeToRefs(todosStore)
const {
  fetchTodos,
  addTodo,
  removeTodo,
  toggleTodo,
  updateTodoTitle,
  clearCompletedTodos,
  setFilter,
} = todosStore

const newTitle = ref('')
const editingTodoId = ref(null)
const editingTitle = ref('')
const showClearConfirm = ref(false)

const filterOptions = [
  { value: 'all', label: '全部', segmentClass: 'all' },
  { value: 'done', label: '已完成', segmentClass: 'done' },
  { value: 'active', label: '未完成', segmentClass: 'pending' },
]

onMounted(async () => {
  await fetchTodos()
})

const cancelEdit = () => {
  editingTodoId.value = null
  editingTitle.value = ''
}

const handleAdd = async () => {
  const success = await addTodo(newTitle.value)
  if (success) {
    newTitle.value = ''
  }
}

const handleToggle = async (id) => {
  await toggleTodo(id)
}

const handleDelete = async (id) => {
  if (editingTodoId.value === id) {
    cancelEdit()
  }
  await removeTodo(id)
}

const handlePencilClick = async (todo) => {
  if (loading.value) {
    return
  }

  if (editingTodoId.value === todo.id) {
    const success = await updateTodoTitle(todo.id, editingTitle.value)
    if (success) {
      cancelEdit()
    }
    return
  }

  if (editingTodoId.value !== null) {
    cancelEdit()
  }

  editingTodoId.value = todo.id
  editingTitle.value = todo.title
}

const handleOpenClearConfirm = () => {
  if (loading.value) {
    return
  }
  showClearConfirm.value = true
}

const handleConfirmClear = async () => {
  await clearCompletedTodos()
  showClearConfirm.value = false
}

const handleCancelClear = () => {
  showClearConfirm.value = false
}

const handleRetry = async () => {
  await fetchTodos()
}
</script>

<template>
  <div class="todo-panel">
    <div v-if="!initialized && loading" class="todo-loading">加载中…</div>

    <div v-else-if="!initialized && error" class="todo-error">
      <p class="todo-error__message">{{ error }}</p>
      <button type="button" class="btn btn--primary" :disabled="loading" @click="handleRetry">
        重试
      </button>
    </div>

    <template v-else-if="initialized">
      <div class="todo-filter-bar">
        <div class="filter-segment" role="tablist" aria-label="待办筛选">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            type="button"
            role="tab"
            class="filter-segment__btn"
            :class="[
              `filter-segment__btn--${option.segmentClass}`,
              { 'filter-segment__btn--selected': filter === option.value },
            ]"
            :aria-selected="filter === option.value"
            :disabled="loading"
            @click="setFilter(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <form class="todo-form" @submit.prevent="handleAdd">
        <input
          v-model="newTitle"
          type="text"
          class="input"
          placeholder="输入待办标题"
          aria-label="待办标题"
          :disabled="loading"
        />
        <button type="submit" class="btn btn--primary" :disabled="loading">添加</button>
        <button
          type="button"
          class="btn btn--clear"
          :disabled="loading"
          @click="handleOpenClearConfirm"
        >
          一键清除
        </button>
      </form>

      <div v-if="error" class="todo-error-banner">
        <p class="todo-error-banner__message">{{ error }}</p>
        <button type="button" class="btn btn--primary" :disabled="loading" @click="handleRetry">
          重试
        </button>
      </div>

      <div v-if="loading" class="todo-loading todo-loading--inline">加载中…</div>

      <div v-if="filteredTodos.length === 0 && !loading" class="todo-empty">
      <div class="todo-empty__icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="12"
            y="8"
            width="40"
            height="48"
            rx="4"
            stroke="currentColor"
            stroke-width="2"
          />
          <path d="M22 22h20M22 32h20M22 42h12" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
      <p class="todo-empty__text">暂无待办</p>
    </div>

    <ul v-else-if="!loading" class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
        <div class="todo-title-cell">
          <input
            v-if="editingTodoId === todo.id"
            v-model="editingTitle"
            type="text"
            class="input todo-title-input"
            aria-label="编辑待办标题"
            :disabled="loading"
          />
          <span v-else class="todo-title">{{ todo.title }}</span>
          <button
            type="button"
            class="todo-edit-btn"
            :class="{ 'todo-edit-btn--active': editingTodoId === todo.id }"
            :aria-label="editingTodoId === todo.id ? '保存标题' : '编辑标题'"
            :disabled="loading"
            @click="handlePencilClick(todo)"
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <span
          class="status-tag todo-status"
          :class="todo.done ? 'status-tag--success' : 'status-tag--warning'"
        >
          {{ todo.done ? '已完成' : '未完成' }}
        </span>
        <div class="todo-actions">
          <button
            type="button"
            class="btn"
            :class="todo.done ? 'btn--revert' : 'btn--toggle'"
            :disabled="loading"
            @click="handleToggle(todo.id)"
          >
            {{ todo.done ? '回退' : '完成' }}
          </button>
          <button
            type="button"
            class="btn btn--danger"
            :disabled="loading"
            @click="handleDelete(todo.id)"
          >
            删除
          </button>
        </div>
      </li>
    </ul>

    <div v-if="showClearConfirm" class="confirm-overlay" role="dialog" aria-modal="true">
      <div class="confirm-dialog">
        <p class="confirm-dialog__message">确定要一键清除已完成待办吗？</p>
        <div class="confirm-dialog__actions">
          <button
            type="button"
            class="btn btn--danger"
            :disabled="loading"
            @click="handleConfirmClear"
          >
            确定
          </button>
          <button type="button" class="btn btn--clear" @click="handleCancelClear">取消</button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<style scoped>
.todo-panel {
  margin-top: 1rem;
}

.todo-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 8rem;
  color: var(--color-text);
  font-size: 0.875rem;
  opacity: 0.85;
}

.todo-loading--inline {
  min-height: 2.5rem;
  margin-bottom: 0.75rem;
}

.todo-error,
.todo-error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-danger-border);
  border-radius: var(--input-radius);
  background-color: var(--color-danger-bg);
}

.todo-error {
  flex-direction: column;
  align-items: stretch;
  min-height: 8rem;
  justify-content: center;
}

.todo-error__message,
.todo-error-banner__message {
  margin: 0;
  color: var(--color-danger);
  font-size: 0.875rem;
  line-height: 1.5;
}

.todo-error-banner {
  margin-bottom: 1rem;
}

.filter-segment__btn:disabled,
.btn:disabled,
.input:disabled,
.todo-edit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.todo-filter-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: -2.75rem;
  margin-bottom: 1.25rem;
}

.filter-segment {
  display: inline-flex;
  padding: 0.25rem;
  background-color: var(--color-background-mute);
  border-radius: 999px;
  gap: 0.125rem;
}

.filter-segment__btn {
  border: none;
  background: transparent;
  min-width: 4.5rem;
  height: 2rem;
  padding: 0 1rem;
  border-radius: 999px;
  font-size: var(--btn-font-size);
  line-height: 1.2;
  color: var(--color-text);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}

.filter-segment__btn--selected.filter-segment__btn--all {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.filter-segment__btn--selected.filter-segment__btn--done {
  background-color: var(--color-success-bg);
  color: var(--color-success);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--color-success) 20%, transparent);
}

.filter-segment__btn--selected.filter-segment__btn--pending {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--color-warning) 20%, transparent);
}

.todo-form {
  display: flex;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.todo-form .input {
  flex: 1;
}

.btn--clear {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn--clear:hover {
  background-color: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.todo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--input-radius);
  background-color: var(--color-background-soft);
}

.todo-empty__icon {
  width: 4rem;
  height: 4rem;
  color: var(--color-border-hover);
}

.todo-empty__icon svg {
  width: 100%;
  height: 100%;
}

.todo-empty__text {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.75;
}

.todo-list {
  --todo-title-col: 12rem;
  --todo-status-col: 4.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: grid;
  grid-template-columns: var(--todo-title-col) var(--todo-status-col) 1fr auto;
  align-items: center;
  column-gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-title-cell {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
}

.todo-title {
  flex: 1;
  min-width: 0;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-title-input {
  flex: 1;
  min-width: 0;
  height: 1.75rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
}

.todo-edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--btn-radius);
  background-color: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.todo-edit-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

.todo-edit-btn:hover {
  background-color: var(--color-background-mute);
  border-color: var(--color-border-hover);
}

.todo-edit-btn--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-primary-text);
}

.todo-edit-btn--active:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.todo-status {
  justify-self: start;
  white-space: nowrap;
}

.todo-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn--toggle {
  background-color: var(--color-success-bg);
  color: var(--color-success);
  border-color: color-mix(in srgb, var(--color-success) 35%, transparent);
}

.btn--toggle:hover {
  background-color: color-mix(in srgb, var(--color-success-bg) 70%, var(--color-success) 30%);
}

.btn--revert {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
  border-color: color-mix(in srgb, var(--color-warning) 35%, transparent);
}

.btn--revert:hover {
  background-color: color-mix(in srgb, var(--color-warning-bg) 70%, var(--color-warning) 30%);
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in srgb, var(--color-text) 25%, transparent);
}

.confirm-dialog {
  width: min(22rem, calc(100vw - 2rem));
  padding: 1.5rem;
  border-radius: var(--input-radius);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-text) 12%, transparent);
}

.confirm-dialog__message {
  margin: 0 0 1.25rem;
  color: var(--color-text);
  line-height: 1.5;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
}
</style>
