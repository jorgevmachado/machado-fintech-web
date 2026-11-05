import type { TThemeTone, TThemeVariant } from '../base';
import { BuildNavbarThemeResult } from './types';
import { NAVBAR_APPEARANCE_CLASS_MAP } from './appearance';

const normalizeClassString = (value: Array<string>): string => {
  const valueString = value.join(' ');
  return valueString.replace(/\s+/g, ' ').trim();
}

const buildNavbarIconTheme = (value: string): string => {
  const list = [
    'flex' ,
    'h-[42px]' ,
    'w-[42px]' ,
    'items-center' ,
    'justify-center' ,
    'rounded-full' ,
    'border' ,
    'transition-transform' ,
    'duration-200' ,
    'hover:scale-105' ,
    value
  ];
  return normalizeClassString(list);
};

const buildNavbarTitleTheme = (value: string): string => {
  const list = [
    'm-0' ,
    'text-[1.05rem]' ,
    'font-extrabold' ,
    'leading-tight' ,
    'tracking-[0.3px]' ,
    value
  ];
  return normalizeClassString(list);
};

const buildNavbarHeaderTheme = (value: string): string => {
  const list =
    [
      'sticky' ,
      'top-0' ,
      'z-[120]' ,
      'flex' ,
      'min-h-[72px]' ,
      'items-center' ,
      'justify-between' ,
      'px-6' ,
      value
    ]
  return normalizeClassString(list);
};

const buildNavbarButtonTheme = (value: string): string => {
  const list = [
    'flex' ,
    'h-10' ,
    'w-10' ,
    'items-center' ,
    'justify-center' ,
    'rounded-xl' ,
    'cursor-pointer' ,
    'flex-shrink-0' ,
    'border' ,
    'transition-all' ,
    'duration-200' ,
    'hover:-translate-y-px' ,
    'focus-visible:outline-2' ,
    'focus-visible:outline-yellow-400' ,
    'focus-visible:outline-offset-2' ,
    value
  ];
  return normalizeClassString(list);
};

const buildNavbarSubtitleTheme = (value: string): string => {
  const list =
    [
      'm-0' ,
      'text-[0.74rem]' ,
      'uppercase' ,
      'tracking-[0.5px]' ,
      'max-[900px]:hidden' ,
      value
    ];
  return normalizeClassString(list);
};

export const buildNavbarTheme = (
  tone: TThemeTone = 'neutral' ,variant: TThemeVariant = 'light'): BuildNavbarThemeResult => {
  const appearance = NAVBAR_APPEARANCE_CLASS_MAP[tone][variant]
  return {
    icon: buildNavbarIconTheme(appearance?.icon) ,
    title: buildNavbarTitleTheme(appearance?.title) ,
    header: buildNavbarHeaderTheme(appearance?.header) ,
    button: buildNavbarButtonTheme(appearance?.button) ,
    subtitle: buildNavbarSubtitleTheme(appearance?.subtitle) ,
  };
};