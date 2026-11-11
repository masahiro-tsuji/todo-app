import { signUp as amplifySignUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { routes } from '@/constants/routes';

export const useSignUp = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (email: string, password: string) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { nextStep } = await amplifySignUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        router.push(`${routes.confirmSignup}?${new URLSearchParams({ email }).toString()}`);
        return;
      }
      if (nextStep.signUpStep === 'DONE') {
        router.replace(routes.login);
        return;
      }
      setErrorMessage('ユーザー登録を完了できませんでした');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'ユーザー登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMessage, signUp };
};
