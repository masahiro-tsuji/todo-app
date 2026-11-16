import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyTOTPSetup } from 'aws-amplify/auth';
import { mfaStateQueryKey } from '@/constants/queryKey';

export const useVerifyTotpSetup = () => {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (code: string) => verifyTOTPSetup({ code }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mfaStateQueryKey }),
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return {
    isPendingVerifyTotpSetup: isPending,
    verifyTotpSetup: mutateAsync,
  };
};
