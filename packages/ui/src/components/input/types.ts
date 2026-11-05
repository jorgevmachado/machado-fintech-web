import type { ChangeEvent, InputHTMLAttributes } from 'react';

import { Mask } from '@fintech/shared';

import type { BaseInputProps } from '../../types';

type InputType = InputHTMLAttributes<HTMLInputElement>['type'] | 'money' | 'name';

export type InputMask = Mask | string | ((value: string) => string);

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'name'> & BaseInputProps &{
  mask?: InputMask;
  type?: InputType;
  onValueBlur?: (value: string, name: string, event: ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string, name: string, event: ChangeEvent<HTMLInputElement>) => void;
}