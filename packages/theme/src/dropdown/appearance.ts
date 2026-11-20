import type { TTone } from '../base';

export const ODropdownAppearance = [
  'solid',
  'outline',
  'ghost',
  'icon',
] as const;

export type TDropdownAppearance = typeof ODropdownAppearance[number];

export const ODropdownPlacement = ['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const;

export type TDropdownPlacement = typeof ODropdownPlacement[number];

export const DROPDOWN_TRIGGER_SHELL_CLASS_MAP: Record<TDropdownAppearance, string> = {
  solid: 'border border-transparent',
  outline: 'border',
  ghost: 'border border-transparent',
  icon: 'border border-transparent',
};

export const DROPDOWN_TRIGGER_SOLID_TONE_CLASS_MAP: Record<TTone, string> = {
  info: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-500',
  white: 'bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300',
  muted: 'bg-slate-600 text-white hover:bg-slate-700 focus-visible:ring-slate-500',
  subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
  neutral: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:ring-slate-400',
  warning: 'bg-amber-500 text-slate-950 hover:bg-amber-600 focus-visible:ring-amber-500',
  inherit: 'bg-inherit text-inherit hover:bg-inherit focus-visible:ring-slate-400',
  default: 'bg-slate-900 text-white hover:bg-slate-950 focus-visible:ring-slate-500',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary: 'bg-slate-700 text-white hover:bg-slate-800 focus-visible:ring-slate-500',
};

export const DROPDOWN_TRIGGER_OUTLINE_TONE_CLASS_MAP: Record<TTone, string> = {
  info: 'border-sky-600 bg-white text-sky-700 hover:bg-sky-50 focus-visible:ring-sky-500',
  white: 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300',
  muted: 'border-slate-600 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500',
  subtle: 'border-slate-100 bg-white text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400',
  danger: 'border-red-600 bg-white text-red-700 hover:bg-red-50 focus-visible:ring-red-500',
  success: 'border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-500',
  neutral: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
  warning: 'border-amber-500 bg-white text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-500',
  inherit: 'border-inherit bg-inherit text-inherit hover:bg-inherit focus-visible:ring-slate-400',
  default: 'border-slate-900 bg-white text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-500',
  primary: 'border-blue-600 bg-white text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500',
  secondary: 'border-slate-500 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-500',
};

export const DROPDOWN_TRIGGER_GHOST_TONE_CLASS_MAP: Record<TTone, string> = {
  info: 'text-sky-700 hover:bg-sky-50 focus-visible:ring-sky-500',
  white: 'text-white hover:bg-white/10 focus-visible:ring-white',
  muted: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500',
  subtle: 'text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400',
  danger: 'text-red-700 hover:bg-red-50 focus-visible:ring-red-500',
  success: 'text-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-500',
  neutral: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
  warning: 'text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-500',
  inherit: 'text-inherit hover:bg-inherit focus-visible:ring-slate-400',
  default: 'text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-500',
  primary: 'text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500',
  secondary: 'text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-500',
};

export const DROPDOWN_TRIGGER_TONE_CLASS_MAP: Record<
  TDropdownAppearance,
  Record<TTone, string>
> = {
  solid: DROPDOWN_TRIGGER_SOLID_TONE_CLASS_MAP,
  outline: DROPDOWN_TRIGGER_OUTLINE_TONE_CLASS_MAP,
  ghost: DROPDOWN_TRIGGER_GHOST_TONE_CLASS_MAP,
  icon: DROPDOWN_TRIGGER_GHOST_TONE_CLASS_MAP,
};

export const DROPDOWN_ITEM_TONE_CLASS_MAP: Record<TTone, string> = {
  info: 'text-sky-700 hover:bg-sky-50 focus-visible:bg-sky-50',
  white: 'text-slate-900 hover:bg-slate-100 focus-visible:bg-slate-100',
  muted: 'text-slate-600 hover:bg-slate-100 focus-visible:bg-slate-100',
  subtle: 'text-slate-500 hover:bg-slate-100 focus-visible:bg-slate-100',
  danger: 'text-red-700 hover:bg-red-50 focus-visible:bg-red-50',
  success: 'text-emerald-700 hover:bg-emerald-50 focus-visible:bg-emerald-50',
  neutral: 'text-slate-700 hover:bg-slate-100 focus-visible:bg-slate-100',
  warning: 'text-amber-700 hover:bg-amber-50 focus-visible:bg-amber-50',
  inherit: 'text-inherit hover:bg-inherit focus-visible:bg-inherit',
  default: 'text-slate-700 hover:bg-slate-100 focus-visible:bg-slate-100',
  primary: 'text-blue-700 hover:bg-blue-50 focus-visible:bg-blue-50',
  secondary: 'text-violet-700 hover:bg-violet-50 focus-visible:bg-violet-50',
};

/**
 * Só fundo e peso: cor de texto aqui competiria na cascata com o tom do item
 * (o projeto não usa `tailwind-merge`).
 */
export const DROPDOWN_ITEM_SELECTED_CLASS = 'bg-slate-100 font-semibold';