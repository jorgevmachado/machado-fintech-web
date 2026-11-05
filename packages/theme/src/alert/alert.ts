export const OAlertVariant = [
  'info',
  'error',
  'warning',
  'success'
] as const;

export type TAlertVariant = typeof OAlertVariant[number];

export const ALERT_VARIANT_CLASS_MAP: Record<TAlertVariant, string> = {
  info: 'border-blue-500 bg-blue-50 text-blue-900',
  error: 'border-red-500 bg-red-50 text-red-900',
  success: 'border-green-500 bg-green-50 text-green-900',
  warning: 'border-yellow-500 bg-yellow-50 text-yellow-900',
};

export const ALERT_VARIANT_ICON_MAP: Record<TAlertVariant, string> = {
  info: 'info',
  error: 'error',
  success: 'check',
  warning: 'warning',
}