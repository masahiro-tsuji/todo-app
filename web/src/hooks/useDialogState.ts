import { useState } from 'react';

export const useDialogState = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return { isOpen, onOpen, onClose };
};
