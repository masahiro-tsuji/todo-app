import { useCallback } from 'react';
import { getTrashTodos } from '@/api/getTrashTodos';
import { trashQueryKey } from '@/constants/queryKey';
import type { Todo } from '@/types';
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
