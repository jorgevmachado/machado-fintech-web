import type { TAlertVariant } from '@fintech/theme';

export const ALERT_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const;

export type TAlertPosition = typeof ALERT_POSITIONS[number];

export type TAlert = {
  id: string;
  title?: string;
  message: string;
  variant: TAlertVariant;
  position?: TAlertPosition;
}

export type TShowAlert = {
  title?: string;
  message: string;
  variant?: TAlertVariant;
  duration?: number;
  position?: TAlertPosition;
}

export type TBuildServiceAlertMessageParams<T> = {
  type: T,
  variant: TAlertVariant,
  message?: string,
  errorMessage?: string,
  messagePrefix?: string,
  successMessage?: string
}

export type TAlertOption = 'success' | 'error' | 'both' | 'none';

export type TExecuteServiceAlertParams<T> = {
  isOk: boolean;
  type: T;
  alert?: TAlertOption;
  message?: string;
  duration?: number;
  position?: TAlertPosition;
  defaultAlert?: TAlertOption;
  errorMessage?: string;
  messagePrefix?: string;
  successMessage?: string;
}

export type TAlertActionOptions = {
  alert?: TAlertOption;
  errorMessage?: string;
  successMessage?: string;
}