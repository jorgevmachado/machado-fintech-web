import type { TAlertVariant } from '@fintech/theme';

export type AlertProps = {
  title: string;
  visible?: boolean;
  onClose?: () => void;
  variant: TAlertVariant;
  className?: string;
  description?: string;
};