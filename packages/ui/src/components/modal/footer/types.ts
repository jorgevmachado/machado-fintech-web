import type { TAlignJustify } from '@fintech/theme';

import type { ButtonProps } from '../../button';

type ModalFooterLayout = {
  align?: TAlignJustify;
  invert?: boolean;
}

export type ModalFooterProps = {
  layout?: ModalFooterLayout;
  onClose: () => void;
  primary: ButtonProps;
  secondary?: ButtonProps;
};