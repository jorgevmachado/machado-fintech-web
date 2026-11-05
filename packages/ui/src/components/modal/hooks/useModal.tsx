'use client';

import React, { useCallback ,useState } from 'react';

import type { ModalOptions } from '../types';

import type { UseModalReturn } from './types';

import Modal from '../Modal';

export function useModal(): UseModalReturn {
  const [modalOptions,setModalOptions] = useState<ModalOptions | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const openModal = useCallback((options: ModalOptions) => {
      setModalOptions(options);
      setOpen(true);
    },[]);

  const closeModal = useCallback(() => {
    setOpen(false);
    setModalOptions(undefined);
  }, []);
  
  const modal: React.ReactNode = modalOptions ? (
    <Modal
      open={open}
      title={modalOptions.title}
      footer={modalOptions.footer}
      onClose={closeModal}
    >
      {modalOptions.children}
    </Modal>
  ) : null;

  return {
    open,
    modal,
    openModal,
    closeModal,
  };
}
