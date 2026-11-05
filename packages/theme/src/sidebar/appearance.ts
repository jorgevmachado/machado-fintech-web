import type { TThemeTone } from '../base';
import type { TSidebarThemeVariant } from './types';

export const SIDEBAR_APPEARANCE_PRIMARY_CLASS_MAP: TSidebarThemeVariant = {
  dark: {
    sidebar: `bg-gradient-to-b from-[#111d38] to-[#14213d]` ,
    border: `border-white/15` ,
    item: `text-slate-50/95` ,
    itemActive: `border-blue-300/50 bg-gradient-to-br from-blue-500/30 to-blue-900/30 font-bold shadow-[0_8px_18px_rgba(37,99,235,0.22)]` ,
    itemHover: `hover:border-blue-300/25 hover:bg-blue-500/20` ,
    text: `
        text-white
      ` ,
    toggle: `bg-slate-900/30 text-slate-50 hover:border-blue-300/25 hover:bg-blue-500/20 focus-visible:outline-yellow-400` ,
    child: `text-slate-100/95 hover:bg-blue-500/15 hover:text-white focus-visible:outline-yellow-400` ,
    childActive: `bg-blue-800/70 text-white` ,
    logout: `border-red-300/50 bg-red-700/80 text-white hover:bg-red-600/25 hover:border-red-200/80 hover:bg-red-600/25 focus-visible:outline-red-300` ,
  } ,
  light: {
    text: `text-slate-900` ,
    item: `text-slate-700` ,
    child: `text-slate-600` ,
    border: `border-slate-200` ,
    toggle: `bg-slate-100 text-slate-700` ,
    logout: `border-red-300 bg-red-600 text-white` ,
    sidebar: `bg-white` ,
    itemHover: `hover:bg-slate-100` ,
    itemActive: `bg-blue-100 text-blue-900 border-blue-300` ,
    childActive: `bg-blue-100text-blue-900` ,
  } ,
};

export const SIDEBAR_APPEARANCE_SECONDARY_CLASS_MAP: TSidebarThemeVariant = {
  dark: {

    sidebar: `
        bg-gradient-to-b
        from-[#2e1065]
        via-[#6d28d9]
        to-[#8b5cf6]
      `,

    border: `
        border-violet-300/20
      `,

    item: `
        text-white
      `,

    itemActive: `
        bg-violet-500/30
        border-violet-300/40
      `,

    itemHover: `
        hover:bg-violet-400/20
      `,

    text: `
        text-white
      `,

    toggle: `
        bg-violet-950/30
        text-white
      `,

    child: `
        text-violet-100
      `,

    childActive: `
        bg-violet-900/70
      `,

    logout: `
        border-red-300/50
        bg-red-700/80
      `,
  },
  light: {

    sidebar: `
        bg-gradient-to-b
        from-[#faf5ff]
        to-[#ddd6fe]
      `,

    border: `
        border-violet-200
      `,

    item: `
        text-slate-800
      `,

    itemActive: `
        bg-violet-100
        border-violet-300
      `,

    itemHover: `
        hover:bg-violet-50
      `,

    text: `
        text-slate-900
      `,

    toggle: `
        bg-violet-50
      `,

    child: `
        text-slate-600
      `,

    childActive: `
        bg-violet-100
      `,

    logout: `
        bg-red-600
      `,
  },
};

export const SIDEBAR_APPEARANCE_NEUTRAL_CLASS_MAP: TSidebarThemeVariant = {
  dark: {

    sidebar: `bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#374151]`,
    border: `border-slate-700`,

    item: `
        text-slate-100
      `,

    itemActive: `
        bg-slate-700/70
      `,

    itemHover: `
        hover:bg-slate-700/50
      `,

    text: `
        text-slate-100
      `,

    toggle: `
        bg-slate-900/40
      `,

    child: `
        text-slate-400
      `,

    childActive: `
        bg-slate-700
      `,

    logout: `
        bg-red-700
      `,
  },
  light: {

    sidebar: `bg-white`,
    border: `border-slate-200`,

    item: `text-slate-700`,

    itemActive: `bg-slate-100`,

    itemHover: `hover:bg-slate-100`,

    text: `text-slate-900`,

    toggle: `bg-slate-100`,

    child: `text-slate-500`,

    childActive: `bg-slate-100`,

    logout: `bg-red-600`,
  },
};

export const SIDEBAR_APPEARANCE_CLASS_MAP: Record<TThemeTone ,TSidebarThemeVariant> = {
  primary: SIDEBAR_APPEARANCE_PRIMARY_CLASS_MAP ,
  secondary: SIDEBAR_APPEARANCE_SECONDARY_CLASS_MAP ,
  neutral: SIDEBAR_APPEARANCE_NEUTRAL_CLASS_MAP ,
};