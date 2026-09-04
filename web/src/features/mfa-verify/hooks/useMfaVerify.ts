import { confirmSignIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useMfaVerify = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifyMfa = async (code: string) => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { isSignedIn } = await confirmSignIn({ challengeResponse: code });
      if (isSignedIn) router.replace('/list');
      else setErrorMessage('ログインを完了できませんでした');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '認証コードの確認に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { errorMessage, isSubmitting, verifyMfa };
};
