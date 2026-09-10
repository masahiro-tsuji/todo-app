import { useMutation, useQueryClient } from '@tanstack/react-query';
import { permanentDelete } from '@/api/permanentDelete';
import { trashQueryKey } from '@/constants/queryKey';

export const usePermanentDelete = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => permanentDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trashQueryKey });
    },
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return { isPendingPermanentDelete: isPending, permanentDelete: mutateAsync };
};
