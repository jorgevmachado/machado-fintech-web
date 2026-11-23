import type { TTone } from '../base';

export const OButtonAppearance = [
  'solid',
  'outline',
  'outlineBorderless',
  'icon',
  'iconNoBorder',
] as const;

export type TButtonAppearance = typeof OButtonAppearance[number];

/**
 * `solid` mantém as cores saturadas: o fundo cheio já garante contraste com o
 * texto branco nos dois temas, e um token `--app-*` só reduziria o contraste.
 *
 * As aparências sem fundo (`outline`, `outlineBorderless`, `iconNoBorder`) e os
 * tons neutros do `solid` usam `--app-*`: sobre superfície escura, um
 * `bg-white` fixo viraria um bloco claro no meio da página.
 */
export const BUTTON_APPEARANCE_CLASS_MAP: Record<TButtonAppearance, Record<TTone, string>> = {
  solid: {
    info: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500',
    white: 'bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-300',
    muted: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500',
    subtle: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))] focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    neutral: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))] focus:ring-slate-400',
    warning: 'bg-amber-500 text-slate-950 hover:bg-amber-600 focus:ring-amber-500',
    inherit: 'bg-inherit text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'bg-slate-900 text-white hover:bg-slate-950 focus:ring-slate-500',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500',
  },
  outline: {
    info: 'border border-[color:var(--app-info,#0369a1)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-info-strong,#075985)] hover:bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] focus:ring-sky-500',
    white: 'border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-300',
    muted: 'border border-slate-600 bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
    subtle: 'border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-400',
    danger: 'border border-[color:var(--app-negative,#dc2626)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] focus:ring-red-500',
    success: 'border border-[color:var(--app-positive,#059669)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-positive-strong,#065f46)] hover:bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] focus:ring-emerald-500',
    neutral: 'border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-400',
    warning: 'border border-[color:var(--app-warning,#b45309)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] focus:ring-amber-500',
    inherit: 'border border-inherit bg-inherit text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'border border-[color:var(--app-text-strong,#020617)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
    primary: 'border border-[color:var(--app-accent-border,#3b82f6)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-accent,#1d4ed8)] hover:bg-[color:var(--app-accent-soft,#eff6ff)] focus:ring-blue-500',
    secondary: 'border border-slate-500 bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
  },
  outlineBorderless: {
    info: 'border-0 bg-transparent text-[color:var(--app-info-strong,#075985)] hover:bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] focus:ring-sky-500',
    white: 'border-0 bg-transparent text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-300',
    muted: 'border-0 bg-transparent text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
    subtle: 'border-0 bg-transparent text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-400',
    danger: 'border-0 bg-transparent text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] focus:ring-red-500',
    success: 'border-0 bg-transparent text-[color:var(--app-positive-strong,#065f46)] hover:bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] focus:ring-emerald-500',
    neutral: 'border-0 bg-transparent text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-400',
    warning: 'border-0 bg-transparent text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] focus:ring-amber-500',
    inherit: 'border-0 bg-transparent text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'border-0 bg-transparent text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
    primary: 'border-0 bg-transparent text-[color:var(--app-accent,#1d4ed8)] hover:bg-[color:var(--app-accent-soft,#eff6ff)] focus:ring-blue-500',
    secondary: 'border-0 bg-transparent text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
  },
  icon: {
    info: 'rounded-full bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500',
    white: 'rounded-full bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-300',
    muted: 'rounded-full bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500',
    subtle: 'rounded-full bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))] focus:ring-slate-400',
    danger: 'rounded-full bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'rounded-full bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    neutral: 'rounded-full bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))] focus:ring-slate-400',
    warning: 'rounded-full bg-amber-500 text-slate-950 hover:bg-amber-600 focus:ring-amber-500',
    inherit: 'rounded-full bg-inherit text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'rounded-full bg-slate-900 text-white hover:bg-slate-950 focus:ring-slate-500',
    primary: 'rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'rounded-full bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-500',
  },
  iconNoBorder: {
    info: 'rounded-full border-0 bg-transparent text-[color:var(--app-info-strong,#075985)] hover:bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] focus:ring-sky-500',
    white: 'rounded-full border-0 bg-transparent text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-300',
    muted: 'rounded-full border-0 bg-transparent text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
    subtle: 'rounded-full border-0 bg-transparent text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-400',
    danger: 'rounded-full border-0 bg-transparent text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] focus:ring-red-500',
    success: 'rounded-full border-0 bg-transparent text-[color:var(--app-positive-strong,#065f46)] hover:bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] focus:ring-emerald-500',
    neutral: 'rounded-full border-0 bg-transparent text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-400',
    warning: 'rounded-full border-0 bg-transparent text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] focus:ring-amber-500',
    inherit: 'rounded-full border-0 bg-inherit text-inherit hover:bg-inherit focus:ring-slate-400',
    default: 'rounded-full border-0 bg-transparent text-[color:var(--app-text-strong,#020617)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
    primary: 'rounded-full border-0 bg-transparent text-[color:var(--app-accent,#1d4ed8)] hover:bg-[color:var(--app-accent-soft,#eff6ff)] focus:ring-blue-500',
    secondary: 'rounded-full border-0 bg-transparent text-[color:var(--app-text,#0f172a)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)] focus:ring-slate-500',
  },
};