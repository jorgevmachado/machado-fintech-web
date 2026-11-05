import type { TThemeTone ,TThemeVariant } from '../base';
import type { BuildSidebarThemeResult } from './types';
import {
  SIDEBAR_APPEARANCE_CLASS_MAP ,
} from './appearance';

const normalizeClassString = (value: Array<string>): string => {
  const valueString = value.join(' ');
  return valueString.replace(/\s+/g, ' ').trim();
}

const buildSidebarAsideTheme = (sidebar: string, border: string): string => {
  const list = [
    'z-[100] flex shrink-0 flex-col overflow-hidden',
    'border-r',
    'p-4 px-3',
    'shadow-[8px_0_26px_rgba(2,6,23,0.16)]',
    'transition-[width] duration-300 ease-in-out',
    'max-[900px]:fixed',
    'max-[900px]:left-0',
    'max-[900px]:top-[72px]',
    'max-[900px]:h-[calc(100vh-72px)]',
    'max-[900px]:w-[min(82vw,260px)]',
    'max-[900px]:-translate-x-[102%]',
    sidebar,
    border,
  ];
  return normalizeClassString(list);
}

const buildSidebarButtonLogoutTheme = (value: string): string => {
  const list = [
    'mt-3 flex w-full',
    'items-center gap-3',
    'overflow-hidden',
    'whitespace-nowrap',
    'rounded-xl',
    'border',
    'px-3 py-[11px]',
    'text-sm',
    'font-bold',
    'cursor-pointer',
    'transition-all duration-200',
    'hover:-translate-y-px',
    'focus-visible:outline-2',
    value
  ];
  return normalizeClassString(list);
}

const buildSidebarButtonItemTheme = (item: string, hover: string): string => {
  const list = [
    'appearance-none',
    'flex min-w-0 flex-1 items-center gap-3',
    'overflow-hidden whitespace-nowrap',
    'rounded-xl border border-transparent',
    'px-3 py-[11px]',
    'text-[0.92rem]',
    'transition-all duration-200',
    'hover:translate-x-px',
    'focus-visible:outline-2',
    'focus-visible:outline-yellow-400',
    item,
    hover,
  ];
  return normalizeClassString(list);
}

const buildSidebarButtonChildrenTheme = (toggle: string): string => {
  const list = [
    'appearance-none',
    'cursor-pointer',
    'inline-flex',
    'w-[38px]',
    'items-center',
    'justify-center',
    'rounded-xl',
    'border',
    'border-transparent',
    'transition-colors',
    'focus-visible:outline-2',
    toggle
  ];
  return normalizeClassString(list);
}

const buildSidebarButtonChildTheme = (value: string): string => {
  const list = [
    'appearance-none',
    'cursor-pointer',
    'flex min-h-[34px]',
    'items-center gap-2',
    'rounded-lg',
    'px-2.5 py-2',
    'text-sm',
    'font-semibold',
    'transition-colors',
    'focus-visible:outline-2',
    value
  ];
  return normalizeClassString(list);
}



export const buildSidebarTheme = (tone: TThemeTone = 'neutral' ,variant: TThemeVariant = 'light'): BuildSidebarThemeResult => {
  const appearance = SIDEBAR_APPEARANCE_CLASS_MAP[tone][variant];
  return {
    text: appearance.text,
    aside: buildSidebarAsideTheme(appearance.sidebar, appearance.border),
    buttonLogout: buildSidebarButtonLogoutTheme(appearance.logout),

    buttonItem: buildSidebarButtonItemTheme(appearance.item, appearance.itemHover),
    buttonItemActive: appearance.itemActive,

    buttonChildren: buildSidebarButtonChildrenTheme(appearance.toggle),

    buttonChildContent: 'ml-[18px] flex flex-col gap-1 border-l border-slate-400/30 pl-3',
    buttonChild: buildSidebarButtonChildTheme(appearance.child),
    buttonChildActive: appearance.childActive,
  }
}