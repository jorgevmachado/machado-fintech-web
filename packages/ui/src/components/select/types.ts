import { ChangeEvent ,SelectHTMLAttributes } from 'react';
import type { BaseInputOptions ,BaseInputProps } from '../../types';


export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'value'> & Omit<BaseInputProps, 'onClear' | 'trailingIcon' | 'switchLanguage' | 'clearButtonAriaLabel'> & {
  value?: string;
  options: ReadonlyArray<BaseInputOptions>;
  placeholder?: string;
  onValueBlur?: (value: string, name: string, event: ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string, name: string, event: ChangeEvent<HTMLSelectElement>) => void;
};