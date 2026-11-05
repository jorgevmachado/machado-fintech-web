import type { TThemeVariant } from '../theme';

export type TThemeSwitcherOptions = {
  icon: 'sun' | 'moon';
  label: string;
  variant: TThemeVariant;
}

export type TThemeSwitcherTheme = {
  selected: string;
  unselected: string;
  container: string;
}

export type TThemeSwitcherThemeVariant = Record<TThemeVariant, TThemeSwitcherTheme>