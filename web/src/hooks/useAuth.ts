import { useQueryClient } from '@tanstack/react-query';
import { signIn, signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useConfirmDialogContext } from '@/components';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { displayConfirm } = useConfirmDialogContext();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      if (isSignedIn) router.replace('/list');
      else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') router.push('/new-password');
      else setErrorMessage('ログインを完了できませんでした');
    } catch (error) {
      if (error instanceof Error && error.name === 'UserAlreadyAuthenticatedException') {
        await signOut();
        setErrorMessage('ログイン状態をリセットしました。もう一度お試しください');
        return;
      }
      setErrorMessage(error instanceof Error ? error.message : 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    displayConfirm({
      content: 'ログアウトしますか？',
      onClickOk: async () => {
        setErrorMessage('');
        setIsLoading(true);
        try {
          await signOut(); // NOTE: 全端末でログアウトするなら、global:true
          queryClient.clear();
          router.replace('/login');
        } catch (error) {
          setErrorMessage(error instanceof Error ? error.message : 'ログアウトに失敗しました');
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  return { isLoading, errorMessage, login, logout };
};
