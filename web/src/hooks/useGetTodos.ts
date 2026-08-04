import { getTodos, type Todo } from '@/api/getTodos';
import { todosQueryKey } from '@/constants/queryKey';
import { useQueryWithSuspense } from './useQueries';

export const useGetTodos = () => {
  const fetchTodos = async () => {
    try {
      return await getTodos();
    } catch (e) {
      console.error(e); // TODO: エラーハンドリング
      return [];
    }
  };

  const { data } = useQueryWithSuspense<Todo[]>(todosQueryKey, fetchTodos);

  return { data };
};
