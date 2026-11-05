import { ReactNode } from 'react';
import type { SupportedLocale } from '@fintech/i18n';
import type { TIcon } from '@fintech/icons';
import type { TInputSize, TInputVariant } from '@fintech/theme';

export type BaseInputProps = {
  key?: string;
  name: string;
  size?: TInputSize;
  label?: string;
  hidden?: boolean;
  onClear?: () => void;
  variant?: TInputVariant;
  isInvalid?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  loadingText?: string;
  leadingIcon?: ReactNode | TIcon;
  trailingIcon?: ReactNode | TIcon;
  errorMessage?: string;
  uppercaseLabel?: boolean;
  switchLanguage?: SupportedLocale;
  helperClassName?: string;
  showClearButton?: boolean;
  containerClassName?: string;
  clearButtonAriaLabel?: string;
  inputWrapperClassName?: string;
}

export type BaseInputOptions = {
  value: string;
  label: string;
  disabled?: boolean;
}