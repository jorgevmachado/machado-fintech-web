import React from 'react';

import type { ModalOptions } from '../types';

export type UseModalReturn = {
  open: boolean;
  modal: React.ReactNode;
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;

}