import { useCallback } from 'react';
import { getTrashTodos } from '@/api/getTrashTodos';
import { trashQueryKey } from '@/constants/queryKey';
import type { Todo } from '@/types';
import { useQueryDefault } from './useQueries';

export const useGetTrashTodos = () => {
  const fetchTrashTodos = useCallback(async () => {
    try {
      return await getTrashTodos();
    } catch (e) {
      console.error(e); // TODO: エラーハンドリング
      return [];
    }
  }, []);

  const { data: trashTodos, isPending } = useQueryDefault<Todo[]>(trashQueryKey, fetchTrashTodos);

  return { trashTodos: trashTodos ?? [], isPending };
};
