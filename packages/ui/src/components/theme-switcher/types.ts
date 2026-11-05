import type { TThemeTone, TThemeVariant } from '@fintech/theme';

export type ThemeMode = TThemeVariant;

export type ThemeSwitcherProps = {
  tone?: TThemeTone;
  variant?: ThemeMode;
  onChange?: (theme: ThemeMode) => void;
  defaultVariant?: ThemeMode;
};
