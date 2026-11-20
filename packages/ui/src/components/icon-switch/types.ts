import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

import type { TIcon } from '@fintech/icons';
import type { TIconSwitchSize } from '@fintech/theme';

export type TIconSwitchIcon = ReactNode | TIcon;

export type IconSwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'onChange' | 'checked' | 'defaultChecked'
> & {
  /** Ícone do estado `checked` (o lado direito). */
  onIcon: TIconSwitchIcon;
  /** Ícone do estado `unchecked` (o lado esquerdo). */
  offIcon: TIconSwitchIcon;
  /** Rótulo acessível de cada estado, usado em `aria-label`/`title`. */
  onLabel?: string;
  offLabel?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  size?: TIconSwitchSize;
  disabled?: boolean;
  className?: string;
  thumbClassName?: string;
  containerClassName?: string;
};