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

/**
 * Tons neutros e superfícies vêm de `--app-*` com o valor claro como fallback.
 * Os tons de acento seguem literais: são saturados o bastante para os dois
 * temas e o shell não publica uma variante `-soft` de todos eles.
 */
export const DROPDOWN_TRIGGER_SOLID_TONE_CLASS_MAP: Record<TTone, string> = {
  info: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-500',
  white: 'bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-300',
  muted: 'bg-slate-600 text-white hover:bg-slate-700 focus-visible:ring-slate-500',
  subtle: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))] focus-visible:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
  neutral: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))] focus-visible:ring-slate-400',
  warning: 'bg-amber-500 text-slate-950 hover:bg-amber-600 focus-visible:ring-amber-500',
  inherit: 'bg-inherit text-inherit hover:bg-inherit focus-visible:ring-slate-400',
  default: 'bg-slate-900 text-white hover:bg-slate-950 focus-visible:ring-slate-500',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary: 'bg-slate-700 text-white hover:bg-slate-800 focus-visible:ring-slate-500',
};

export const DROPDOWN_TRIGGER_OUTLINE_TONE_CLASS_MAP: Record<TTone, string> = {
  info: 'border-[color:var(--app-info,#0369a1)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-info-strong,#075985)] hover:bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] focus-visible:ring-sky-500',
  white: 'border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-300',
  muted: 'border-slate-600 bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-500',
  subtle: 'border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-400',
  danger: 'border-[color:var(--app-negative,#dc2626)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] focus-visible:ring-red-500',
  success: 'border-[color:var(--app-positive,#059669)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-positive-strong,#065f46)] hover:bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] focus-visible:ring-emerald-500',
  neutral: 'border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-400',
  warning: 'border-[color:var(--app-warning,#b45309)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] focus-visible:ring-amber-500',
  inherit: 'border-inherit bg-inherit text-inherit hover:bg-inherit focus-visible:ring-slate-400',
  default: 'border-[color:var(--app-text-strong,#020617)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-500',
  primary: 'border-[color:var(--app-accent-border,#3b82f6)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-accent,#1d4ed8)] hover:bg-[color:var(--app-accent-soft,#eff6ff)] focus-visible:ring-blue-500',
  secondary: 'border-slate-500 bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-500',
};

export const DROPDOWN_TRIGGER_GHOST_TONE_CLASS_MAP: Record<TTone, string> = {
  info: 'text-[color:var(--app-info-strong,#075985)] hover:bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] focus-visible:ring-sky-500',
  white: 'text-white hover:bg-white/10 focus-visible:ring-white',
  muted: 'text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-500',
  subtle: 'text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-400',
  danger: 'text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] focus-visible:ring-red-500',
  success: 'text-[color:var(--app-positive-strong,#065f46)] hover:bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] focus-visible:ring-emerald-500',
  neutral: 'text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-400',
  warning: 'text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] focus-visible:ring-amber-500',
  inherit: 'text-inherit hover:bg-inherit focus-visible:ring-slate-400',
  default: 'text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-500',
  primary: 'text-[color:var(--app-accent,#1d4ed8)] hover:bg-[color:var(--app-accent-soft,#eff6ff)] focus-visible:ring-blue-500',
  secondary: 'text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:ring-slate-500',
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
  info: 'text-[color:var(--app-info-strong,#075985)] hover:bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] focus-visible:bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))]',
  white: 'text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:bg-[color:var(--app-surface-muted,#f1f5f9)]',
  muted: 'text-[color:var(--app-text-subtle,#475569)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:bg-[color:var(--app-surface-muted,#f1f5f9)]',
  subtle: 'text-[color:var(--app-text-muted,#64748b)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:bg-[color:var(--app-surface-muted,#f1f5f9)]',
  danger: 'text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] focus-visible:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]',
  success: 'text-[color:var(--app-positive-strong,#065f46)] hover:bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] focus-visible:bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))]',
  neutral: 'text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:bg-[color:var(--app-surface-muted,#f1f5f9)]',
  warning: 'text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] focus-visible:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))]',
  inherit: 'text-inherit hover:bg-inherit focus-visible:bg-inherit',
  default: 'text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:bg-[color:var(--app-surface-muted,#f1f5f9)]',
  primary: 'text-[color:var(--app-accent,#1d4ed8)] hover:bg-[color:var(--app-accent-soft,#eff6ff)] focus-visible:bg-[color:var(--app-accent-soft,#eff6ff)]',
  secondary: 'text-[color:var(--app-text-subtle,#475569)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:bg-[color:var(--app-surface-muted,#f1f5f9)]',
};

/**
 * Só fundo e peso: cor de texto aqui competiria na cascata com o tom do item
 * (o projeto não usa `tailwind-merge`).
 */
export const DROPDOWN_ITEM_SELECTED_CLASS = 'bg-[color:var(--app-surface-muted,#f1f5f9)] font-semibold';