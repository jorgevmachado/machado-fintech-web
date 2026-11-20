import type { TThemeVariant } from '../base';
import { NAVIGATION_SHELL_BACKGROUND_MAP, NAVIGATION_SHELL_VARS_MAP } from './appearance';

export type BuildNavigationThemeResult = {
  /** `background` inline do canvas: gradientes + cor de base, por variante. */
  background: string;
  /** Custom properties herdadas pelo conteúdo: superfícies, bordas e textos. */
  vars: Record<string, string>;
};

export const buildNavigationTheme = (variant: TThemeVariant = 'light'): BuildNavigationThemeResult => ({
  background: NAVIGATION_SHELL_BACKGROUND_MAP[variant],
  vars: NAVIGATION_SHELL_VARS_MAP[variant],
});