import { type ChangeEvent ,InputHTMLAttributes } from 'react';
import type { BaseInputProps } from '../../types';

type CustomBaseInputProps = Omit<BaseInputProps, 'type' | 'onClear' | 'leadingIcon' | 'trailingIcon' | 'switchLanguage' | 'showClearButton' | 'clearButtonAriaLabel'>;

export type ColorInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value'> & CustomBaseInputProps & {
  value?: string;
  onValueBlur?: (value: string, name: string, event: ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string, name: string, event: ChangeEvent<HTMLInputElement>) => void;
}