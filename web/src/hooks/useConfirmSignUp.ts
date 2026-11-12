import { confirmSignUp as amplifyConfirmSignUp } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { routes } from '@/constants/routes';

const MISSING_EMAIL_MESSAGE = '確認対象のメールアドレスがありません。登録画面からやり直してください';

export const useConfirmSignUp = () => {
  const router = useRouter();
  const email = useSearchParams().get('email') ?? ''; // NOTE: signUp時に渡してるメールアドレスを取得
  const [errorMessage, setErrorMessage] = useState(email ? '' : MISSING_EMAIL_MESSAGE);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 確認コードを Cognito に送り、完了したらログイン画面へ移動する
   * @param confirmationCode 確認コード (useSignUp の signUp 後に Cognito がメールで送る確認コード)
   */
  const confirmSignUp = async (confirmationCode: string) => {
    setErrorMessage('');
    if (!email) {
      setErrorMessage(MISSING_EMAIL_MESSAGE);
      return;
    }

    setIsLoading(true);

    try {
      const { isSignUpComplete } = await amplifyConfirmSignUp({ username: email, confirmationCode });
      if (isSignUpComplete) router.replace(routes.login);
      else setErrorMessage('メール確認を完了できませんでした');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'メール確認に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMessage, email, confirmSignUp };
};
