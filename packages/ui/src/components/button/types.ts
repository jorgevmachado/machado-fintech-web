import { ButtonHTMLAttributes ,ReactNode } from 'react';

import type { TIcon } from '@fintech/icons';
import type { TButtonAppearance, TButtonSize, TTone  } from '@fintech/theme';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  tone?: TTone;
  size?: TButtonSize;
  children?: ReactNode;
  iconLeft?: ReactNode | TIcon;
  iconRight?: ReactNode | TIcon;
  fullWidth?: boolean;
  isLoading?: boolean;
  appearance?: TButtonAppearance;
  loadingText?: string;
};