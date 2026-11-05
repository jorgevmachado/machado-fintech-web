import type { TThemeTone } from '../../tone';

import type { TThemeSwitcherOptions ,TThemeSwitcherThemeVariant } from './types';

export const THEME_SWITCHER_OPTIONS: readonly TThemeSwitcherOptions[] = [
  { variant: 'light', label: 'Light theme', icon: 'sun' },
  { variant: 'dark', label: 'Dark theme', icon: 'moon' },
];

export const THEME_SWITCHER_CLASS_MAP: Record<TThemeTone, TThemeSwitcherThemeVariant> = {
  primary: {
    light: {
      container: 'border-slate-200 bg-white',
      selected: 'border-slate-300 bg-slate-100 text-slate-900 shadow-sm',
      unselected: 'border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
    },
    dark: {
      container: 'border-white/15 bg-gradient-to-br from-[#14213d] via-[#1e3a8a] to-[#233876]',
      selected: 'border-white/30 bg-white/20 text-white shadow-sm',
      unselected: 'border-transparent bg-transparent text-white/70 hover:bg-white/15 hover:text-white',
    },
  },
  secondary: {
    light: {
      container: 'border-violet-100 bg-gradient-to-br from-[#faf5ff] via-[#ede9fe] to-[#ddd6fe]',
      selected: 'border-violet-200 bg-white text-violet-700 shadow-sm',
      unselected: 'border-transparent bg-transparent text-slate-600 hover:bg-white/70 hover:text-violet-700',
    },
    dark: {
      container: 'border-violet-300/20 bg-gradient-to-br from-[#2e1065] via-[#6d28d9] to-[#8b5cf6]',
      selected: 'border-violet-200/50 bg-white/20 text-white shadow-sm',
      unselected: 'border-transparent bg-transparent text-violet-100/80 hover:bg-white/15 hover:text-white',
    },
  },
  neutral: {
    light: {
      container: 'border-slate-200 bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#e2e8f0]',
      selected: 'border-slate-300 bg-white text-slate-900 shadow-sm',
      unselected: 'border-transparent bg-transparent text-slate-500 hover:bg-white/70 hover:text-slate-900',
    },
    dark: {
      container: 'border-slate-700 bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]',
      selected: 'border-slate-500 bg-white/15 text-white shadow-sm',
      unselected: 'border-transparent bg-transparent text-slate-300 hover:bg-white/10 hover:text-white',
    },
  },
}