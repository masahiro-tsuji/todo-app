import { useMutation } from '@tanstack/react-query';
import { type SetUpTOTPOutput, setUpTOTP } from 'aws-amplify/auth';

export const useSetupTotp = () => {
  const { isPending, mutateAsync, data, reset } = useMutation({
    mutationFn: (): Promise<SetUpTOTPOutput> => setUpTOTP(),
    onError: (e) => {
      console.error(e); // TODO: エラーハンドリング
    },
  });

  return {
    isPendingSetupTotp: isPending,
    setupTotp: mutateAsync,
    totpSetupDetails: data,
    resetSetupTotp: reset,
  };
};
