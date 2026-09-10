'use client';
import { Typography } from '@mui/material';
import React, { createContext, type ReactNode, useCallback, useContext, useState } from 'react';
import { Dialog } from '../parts';

type DialogActionType = {
  onClickOk?: () => void | Promise<void>;
  onClose?: () => void;
};

type ConfirmProviderOptions = { content: unknown } & DialogActionType;
type ConfirmDialogProps = { message: ReactNode } & DialogActionType;

type ConfirmContextType = (options: ConfirmProviderOptions) => void;
const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const ConfirmDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [confirmState, setConfirmState] = useState<ConfirmDialogProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback(async (options: ConfirmProviderOptions) => {
    const { content } = options;
    let message: ReactNode = '';

    // メッセージの抽出
    if (typeof content === 'string') message = content;
    else if (React.isValidElement(content)) message = content;

    return setConfirmState({ message, ...options });
  }, []);

  const onClickOk = async () => {
    if (!confirmState?.onClickOk) {
      setConfirmState(null);
      return;
    }

    setIsLoading(true);
    try {
      await confirmState.onClickOk();
      setConfirmState(null);
    } catch {
      // 失敗時はダイアログを開いたままにする
    } finally {
      setIsLoading(false);
    }
  };

  const onClickClose = () => {
    if (isLoading) return;
    if (confirmState?.onClose) confirmState.onClose();
    setConfirmState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        title='確認'
        open={!!confirmState}
        onClose={onClickClose}
        onPrimaryClick={onClickOk}
        primaryLoading={isLoading}
        size='sm'
      >
        {typeof confirmState?.message === 'string' ? (
          <Typography>{confirmState?.message}</Typography>
        ) : (
          confirmState?.message
        )}
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirmDialogContext = () => {
  const displayConfirm = useContext(ConfirmContext);
  if (!displayConfirm) throw new Error('useConfirm must be used within ConfirmProvider');
  return { displayConfirm };
};
