import type { Todo } from '@/types';

export const isCompletedTodo = (todo: Todo) => todo.completedAt != null;
