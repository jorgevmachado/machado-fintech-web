import type { TThemeVariant } from '../base';

export type TNavbarVariantsTheme = {
  icon: string;
  title: string;
  header: string;
  button: string;
  subtitle: string;
}

export type TNavbarThemeVariant = Record<TThemeVariant, TNavbarVariantsTheme>;

export type BuildNavbarThemeResult = {
  icon: string;
  title: string;
  header: string;
  button: string;
  subtitle: string;
};