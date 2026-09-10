import { useMutation, useQueryClient } from '@tanstack/react-query';
import { softDelete } from '@/api/softDelete';
import { todosQueryKey, trashQueryKey } from '@/constants/queryKey';

export const useSoftDelete = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
      queryClient.invalidateQueries({ queryKey: trashQueryKey });
    },
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return { isPendingSoftDelete: isPending, softDelete: mutateAsync };
};
