import type { ReactNode } from 'react';

import type { ModalFooterProps } from './footer';

export type ModalOptions = {
  title: string;
  footer?: Omit<ModalFooterProps, 'onClose'>;
  children: ReactNode;
}

export type ModalProps = ModalOptions & {
  open: boolean;
  onClose: () => void;
};