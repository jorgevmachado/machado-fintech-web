import type { TIcon } from '@fintech/icons';
import type { ChangeEvent } from 'react';

import type { InputProps } from '../input';

export type IconComboboxProps = Omit<
  InputProps,
  'value' | 'defaultValue' | 'onChange' | 'onValueChange' |
  'type' | 'mask' | 'leadingIcon' | 'trailingIcon'
> & {
  value?: TIcon | string;
  defaultValue?: TIcon | string;
  pageSize?: number;
  onValueChange?: (value: string, name: string, event: ChangeEvent<HTMLInputElement>) => void;
  noResultsText?: string;
  showMoreText?: string;
};
