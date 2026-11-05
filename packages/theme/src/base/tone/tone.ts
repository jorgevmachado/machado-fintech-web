export const OTone = [
  'default',
  'muted',
  'white',
  'subtle',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
  'inherit',
] as const;

export type TTone = (typeof OTone)[number];

export const OThemeTone = [
  'neutral',
  'primary',
  'secondary',
] as const;

export type TThemeTone = (typeof OThemeTone)[number];

export const TEXT_TONE_CLASS_MAP: Record<TTone ,string> = {
  info: 'text-sky-600',
  muted: 'text-slate-600',
  white: 'text-white',
  subtle: 'text-slate-500',
  danger: 'text-red-600',
  default: 'text-slate-900',
  primary: 'text-blue-600',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  neutral: 'text-slate-700',
  inherit: 'text-inherit',
  secondary: 'text-violet-600',
};