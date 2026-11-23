import type { TReducedSize ,TTone } from '../base';

export const OSwitchVariations = ['solid', 'outline'] as const;

export type TSwitchVariation = typeof OSwitchVariations[number];

export const OSwitchLabelPosition = ['start', 'end'] as const;

export type TSwitchLabelPosition = typeof OSwitchLabelPosition[number];

export const SWITCH_SIZE_CLASS_MAP: Record<TReducedSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'h-5 w-9 p-0.5',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11 p-0.5',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-8 w-14 p-1',
    thumb: 'h-6 w-6',
    translate: 'translate-x-6',
  },
};

export const SWITCH_TONE_CLASS_MAP: Record<TTone, { on: string; off: string; ring: string; border: string }> = {
  default: {
    on: 'bg-[color:var(--app-track-active,#0f172a)]',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-slate-500',
    border: 'border-[color:var(--app-text-subtle,#475569)]',
  },
  muted: {
    on: 'bg-[color:var(--app-track-active,#0f172a)]',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-slate-500',
    border: 'border-[color:var(--app-text-subtle,#475569)]',
  },
  white: {
    // `on` fica branco de propósito: este tom existe para um trilho claro sobre
    // superfície escura (navbar), não para acompanhar a página.
    on: 'bg-white',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-slate-300',
    border: 'border-[color:var(--app-border,#e2e8f0)]',
  },
  subtle: {
    on: 'bg-slate-500',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-slate-400',
    border: 'border-[color:var(--app-text-muted,#64748b)]',
  },
  primary: {
    on: 'bg-blue-600',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-blue-500',
    border: 'border-blue-500',
  },
  secondary: {
    on: 'bg-[color:var(--app-track-active,#0f172a)]',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-slate-500',
    border: 'border-[color:var(--app-text-subtle,#475569)]',
  },
  success: {
    on: 'bg-emerald-600',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-emerald-500',
    border: 'border-emerald-500',
  },
  warning: {
    on: 'bg-amber-500',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-amber-500',
    border: 'border-amber-500',
  },
  danger: {
    on: 'bg-red-600',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-red-500',
    border: 'border-red-500',
  },
  info: {
    on: 'bg-sky-600',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-sky-500',
    border: 'border-sky-500',
  },
  neutral: {
    on: 'bg-slate-500',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-slate-400',
    border: 'border-slate-400',
  },
  inherit: {
    on: 'bg-inherit',
    off: 'bg-[color:var(--app-track,#cbd5e1)]',
    ring: 'focus-within:ring-slate-400',
    border: 'border-inherit',
  },
};