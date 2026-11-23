import type { TBadgeVariant } from './variant';
import { type TTone, OTone } from '../base';

/**
 * `solid` mantém as cores saturadas: o fundo cheio já contrasta com o texto
 * branco nos dois temas.
 *
 * Todo o resto usa `--app-*` com fallback claro. Um `bg-slate-100 text-slate-600`
 * fixo desaparece sobre superfície escura, e `text-red-700` sobre `#17233d`
 * fica em 2.62:1 — abaixo de AA. Por isso `soft`/`outline` combinam o `-soft`
 * (fundo) com o `-strong` (texto), que é claro o bastante no escuro.
 */
export const BADGE_TONE_CLASS_MAP: Record<TBadgeVariant, Record<TTone ,string>> = {
  solid: {
    primary: 'bg-blue-600 text-white' ,
    secondary: 'bg-slate-700 text-white' ,
    success: 'bg-emerald-500 text-white' ,
    warning: 'bg-amber-400 text-slate-900' ,
    danger: 'bg-red-500 text-white' ,
    info: 'bg-sky-500 text-white' ,
    neutral: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)]' ,
    default: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)]' ,
    inherit: 'bg-transparent text-inherit' ,
    muted: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-subtle,#475569)]' ,
    subtle: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-subtle,#475569)]' ,
    white: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)]' ,
  } ,
  soft: {
    primary: 'bg-[color:var(--app-accent-soft,#eff6ff)] text-[color:var(--app-accent,#1d4ed8)]' ,
    secondary: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)]' ,
    success: 'bg-[color:var(--app-positive-soft,rgba(5,150,105,0.10))] text-[color:var(--app-positive-strong,#065f46)]' ,
    warning: 'bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))] text-[color:var(--app-warning-strong,#92400e)]' ,
    danger: 'bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))] text-[color:var(--app-negative-strong,#991b1b)]' ,
    info: 'bg-[color:var(--app-info-soft,rgba(2,132,199,0.10))] text-[color:var(--app-info-strong,#075985)]' ,
    neutral: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-subtle,#475569)]' ,
    default: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-subtle,#475569)]' ,
    inherit: 'bg-transparent text-inherit' ,
    muted: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-subtle,#475569)]' ,
    subtle: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text-subtle,#475569)]' ,
    white: 'bg-[color:var(--app-surface-muted,#f1f5f9)] text-[color:var(--app-text,#0f172a)]' ,
  } ,
  outline: {
    primary: 'border border-[color:var(--app-accent-border,#3b82f6)] bg-transparent text-[color:var(--app-accent,#1d4ed8)]' ,
    secondary: 'border border-slate-400 bg-transparent text-[color:var(--app-text,#0f172a)]' ,
    success: 'border border-[color:var(--app-positive,#059669)] bg-transparent text-[color:var(--app-positive-strong,#065f46)]' ,
    warning: 'border border-[color:var(--app-warning,#b45309)] bg-transparent text-[color:var(--app-warning-strong,#92400e)]' ,
    danger: 'border border-[color:var(--app-negative,#dc2626)] bg-transparent text-[color:var(--app-negative-strong,#991b1b)]' ,
    info: 'border border-[color:var(--app-info,#0369a1)] bg-transparent text-[color:var(--app-info-strong,#075985)]' ,
    neutral: 'border border-[color:var(--app-border,#e2e8f0)] bg-transparent text-[color:var(--app-text-subtle,#475569)]' ,
    default: 'border border-[color:var(--app-border,#e2e8f0)] bg-transparent text-[color:var(--app-text-subtle,#475569)]' ,
    inherit: 'border border-transparent bg-transparent text-inherit' ,
    muted: 'border border-[color:var(--app-border,#e2e8f0)] bg-transparent text-[color:var(--app-text-subtle,#475569)]' ,
    subtle: 'border border-[color:var(--app-border,#e2e8f0)] bg-transparent text-[color:var(--app-text-subtle,#475569)]' ,
    white: 'border border-[color:var(--app-border,#e2e8f0)] bg-transparent text-[color:var(--app-text,#0f172a)]' ,
  } ,
};

export const getBadgeRandomTone = (): TTone => {
  const randomIndex = Math.floor(Math.random() * OTone.length);

  return OTone[randomIndex] ?? 'primary';
}