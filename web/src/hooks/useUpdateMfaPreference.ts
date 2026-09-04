import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMFAPreference } from 'aws-amplify/auth';
import { mfaStateQueryKey } from '@/constants/queryKey';

export const useUpdateMfaPreference = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (enabled: boolean) =>
      updateMFAPreference({ totp: enabled ? 'PREFERRED' : 'DISABLED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mfaStateQueryKey });
    },
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return { isPendingUpdateMfaPreference: isPending, updateMfaPreference: mutateAsync };
};
