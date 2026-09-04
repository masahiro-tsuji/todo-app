import { useMutation } from '@tanstack/react-query';
import { verifyTOTPSetup } from 'aws-amplify/auth';

export const useVerifyTotpSetup = () => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (code: string) => verifyTOTPSetup({ code }),
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return {
    isPendingVerifyTotpSetup: isPending,
    verifyTotpSetup: mutateAsync,
  };
};
