import { fetchMFAPreference } from 'aws-amplify/auth';
import { useCallback } from 'react';
import { mfaStateQueryKey } from '@/constants/queryKey';
import { useQueryDefault } from './useQueries';

type MfaState = {
  isMfaEnabled: boolean;
  shouldTotpSetup: boolean;
};

export const useGetMfaState = () => {
  const fetchMfaPreference = useCallback(async (): Promise<MfaState> => {
    try {
      const { enabled, preferred } = await fetchMFAPreference();
      return {
        isMfaEnabled: preferred === 'TOTP',
        shouldTotpSetup: !enabled?.includes('TOTP'),
      };
    } catch (e) {
      console.error(e); // TODO: エラーハンドリング
      return { isMfaEnabled: false, shouldTotpSetup: true };
    }
  }, []);

  const { isPending, data } = useQueryDefault<MfaState>(mfaStateQueryKey, fetchMfaPreference);

  return {
    isPendingMfaState: isPending,
    isMfaEnabled: data?.isMfaEnabled ?? false,
    shouldTotpSetup: data?.shouldTotpSetup ?? false,
  };
};
