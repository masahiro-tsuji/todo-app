import { useCallback } from 'react';
import { getTodos } from '@/api/getTodos';
import { todosQueryKey } from '@/constants/queryKey';
import type { Todo } from '@/types';
import { useQueryDefault } from './useQueries';

export const useGetTodos = () => {
  const fetchTodos = useCallback(async () => {
    try {
      return await getTodos();
    } catch (e) {
      console.error(e); // TODO: エラーハンドリング
      return [];
    }
  }, []);

  const { data, isPending } = useQueryDefault<Todo[]>(todosQueryKey, fetchTodos);

  return { todos: data ?? [], isPending };
};
