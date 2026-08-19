import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type UpdateTodoRequestBody, updateTodo } from '@/api/updateTodo';
import { todosQueryKey } from '@/constants/queryKey';

type UpdateTodoParams = {
  id: string;
  body: UpdateTodoRequestBody;
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: ({ id, body }: UpdateTodoParams) => updateTodo(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return { isPendingUpdateTodo: isPending, updateTodo: mutateAsync };
};
