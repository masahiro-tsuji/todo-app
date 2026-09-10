import { useCallback } from 'react';
import { getTrashTodos } from '@/api/getTrashTodos';
import type { Todo } from '@/api/types/todo';
import { trashQueryKey } from '@/constants/queryKey';
import { useQueryWithSuspense } from './useQueries';

export const useGetTrashTodos = () => {
  const fetchTrashTodos = useCallback(async () => {
    try {
      return await getTrashTodos();
    } catch (e) {
      console.error(e); // TODO: エラーハンドリング
      return [];
    }
  }, []);

  const { data: trashTodos } = useQueryWithSuspense<Todo[]>(trashQueryKey, fetchTrashTodos);

  return { trashTodos };
};
