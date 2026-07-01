import type { Todo, TodoPatch } from '@/types/todo';
import { mockRequest } from './request';

const STORAGE_KEY = 'app-todos';

export const API_PATHS = {
  GET_TODOS: 'GET /todos',
  POST_TODOS: 'POST /todos',
  PATCH_TODO: 'PATCH /todos/:id',
  DELETE_TODO: 'DELETE /todos/:id',
  DELETE_COMPLETED: 'DELETE /todos/completed',
} as const;

export const INITIAL_TODOS: Todo[] = [
  { id: 1, title: '学习 Vue 3 基础', done: true },
  { id: 2, title: '完成 Todo 列表页面', done: false },
  { id: 3, title: '准备 AI Coding 面试', done: false },
];

const isValidTodo = (item: unknown): item is Todo => {
  if (!item || typeof item !== 'object') return false;
  const todo = item as Record<string, unknown>;
  return (
    typeof todo.id === 'number' &&
    typeof todo.title === 'string' &&
    typeof todo.done === 'boolean'
  );
};

const isValidTodos = (items: unknown): items is Todo[] => {
  return Array.isArray(items) && items.length > 0 && items.every(isValidTodo);
};

export const validateTodoTitle = (title: string): string | null => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return null;
  }
  return trimmedTitle;
};

const loadTodosFromStorage = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [...INITIAL_TODOS];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidTodos(parsed)) {
      console.warn('[todosApi] app-todos 数据格式无效，已回退初始数据');
      return [...INITIAL_TODOS];
    }

    return parsed;
  } catch (error) {
    console.warn('[todosApi] app-todos 解析失败，已回退初始数据', error);
    return [...INITIAL_TODOS];
  }
};

const saveTodosToStorage = (items: Todo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const getNextId = (items: Todo[]): number => {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map((todo) => todo.id)) + 1;
};

/** GET /todos — 读取列表 */
export const fetchTodos = (): Promise<Todo[]> =>
  mockRequest(() => {
    void API_PATHS.GET_TODOS;
    return loadTodosFromStorage();
  });

/** POST /todos — 新增 */
export const createTodo = (title: string): Promise<Todo[]> =>
  mockRequest(() => {
    void API_PATHS.POST_TODOS;
    const trimmedTitle = validateTodoTitle(title);
    if (!trimmedTitle) {
      throw new Error('Invalid title');
    }

    const todos = loadTodosFromStorage();
    todos.unshift({
      id: getNextId(todos),
      title: trimmedTitle,
      done: false,
    });
    saveTodosToStorage(todos);
    return [...todos];
  });

/** PATCH /todos/:id — 更新 title 或 done */
export const updateTodo = (id: number, patch: TodoPatch): Promise<Todo[]> =>
  mockRequest(() => {
    void API_PATHS.PATCH_TODO;
    const todos = loadTodosFromStorage();
    const todo = todos.find((item) => item.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (patch.title !== undefined) {
      const trimmedTitle = validateTodoTitle(patch.title);
      if (!trimmedTitle) {
        throw new Error('Invalid title');
      }
      todo.title = trimmedTitle;
    }

    if (patch.done !== undefined) {
      todo.done = patch.done;
    }

    saveTodosToStorage(todos);
    return [...todos];
  });

/** DELETE /todos/:id — 删除单条 */
export const deleteTodo = (id: number): Promise<Todo[]> =>
  mockRequest(() => {
    void API_PATHS.DELETE_TODO;
    const todos = loadTodosFromStorage().filter((todo) => todo.id !== id);
    saveTodosToStorage(todos);
    return [...todos];
  });

/** DELETE /todos/completed — 清除已完成 */
export const clearCompletedTodos = (): Promise<Todo[]> =>
  mockRequest(() => {
    void API_PATHS.DELETE_COMPLETED;
    const todos = loadTodosFromStorage().filter((todo) => !todo.done);
    saveTodosToStorage(todos);
    return [...todos];
  });
