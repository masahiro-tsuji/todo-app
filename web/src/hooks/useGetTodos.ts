import { useCallback } from 'react';
import { getTodos } from '@/api/getTodos';
import { todosQueryKey } from '@/constants/queryKey';
import type { Todo } from '@/types';
import { useQueryWithSuspense } from './useQueries';

export const useGetTodos = () => {
  const fetchTodos = useCallback(async () => {
    try {
      return await getTodos();
    } catch (e) {
      console.error(e); // TODO: エラーハンドリング
      return [];
    }
  }, []);

  const { data } = useQueryWithSuspense<Todo[]>(todosQueryKey, fetchTodos);

  return { data };
};
