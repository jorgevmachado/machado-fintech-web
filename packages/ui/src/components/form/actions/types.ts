import type { TJustify } from '@fintech/theme';

import type { ButtonProps } from '../../button';

export type FormActionsProps = {
  cancel?: ButtonProps;
  submit: ButtonProps;
  justify?: TJustify;
  className?: string;
}