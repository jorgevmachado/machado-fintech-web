import {
  ReactNode ,
  KeyboardEvent ,
  InputHTMLAttributes ,
  type ChangeEvent,
} from 'react';
import type { TIcon } from '@fintech/icons';

import type { BaseInputOptions ,BaseInputProps } from '../../types';

export type AutocompleteOption = Omit<BaseInputOptions, 'label'> & {
  key: string;
  icon?: ReactNode | TIcon;
  label?: string;
  description?: string;
};

export type AutocompleteProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> & BaseInputProps & {
  name: string;
  value?: string;
  options: ReadonlyArray<AutocompleteOption>;
  maxOptions?: number;
  onValueBlur?: (value: string, name: string, event: ChangeEvent<HTMLInputElement>) => void;
  filterOptions?: (option: AutocompleteOption, normalizedQuery: string) => boolean;
  noResultsText?: string;
  onValueChange?: (value: string, name: string, event: ChangeEvent<HTMLInputElement>) => void;
  onSelectOption?: (option: AutocompleteOption) => void;
  onInputKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  optionClassName?: string;
  listboxClassName?: string;
  loadingPlaceholder?: string;
};
