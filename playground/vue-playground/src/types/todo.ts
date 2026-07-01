export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export type TodoFilter = 'all' | 'active' | 'done';

export interface TodoPatch {
  title?: string;
  done?: boolean;
}
