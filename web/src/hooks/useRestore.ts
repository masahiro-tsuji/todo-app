import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restore } from '@/api/restore';
import { todosQueryKey, trashQueryKey } from '@/constants/queryKey';

export const useRestore = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
      queryClient.invalidateQueries({ queryKey: trashQueryKey });
    },
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return { isPendingRestore: isPending, restore: mutateAsync };
};
