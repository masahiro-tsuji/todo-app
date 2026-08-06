import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type CreateTodoRequestBody, createTodo } from '@/api/createTodo';
import { todosQueryKey } from '@/constants/queryKey';

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (body: CreateTodoRequestBody) => createTodo(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return { isPendingCreateTodo: isPending, createTodo: mutateAsync };
};
