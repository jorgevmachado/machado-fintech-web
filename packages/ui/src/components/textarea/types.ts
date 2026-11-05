import type { ChangeEvent, TextareaHTMLAttributes } from 'react';

import type { BaseInputProps } from '../../types';

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> & BaseInputProps & {
  onValueBlur?: (value: string, name: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  onValueChange?: (value: string, name: string, event: ChangeEvent<HTMLTextAreaElement>) => void;
  showCharacterCount?: boolean;
};
