'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import {
  THEME_SWITCHER_CLASS_MAP ,
  THEME_SWITCHER_OPTIONS ,
} from '@fintech/theme';

import { Icon } from '../../primitives';

import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  persistTheme,
  subscribeTheme,
} from './theme-storage';

import type { ThemeMode, ThemeSwitcherProps } from './types';

export { THEME_STORAGE_KEY } from './theme-storage';

export default function ThemeSwitcher({
  tone = 'primary',
  variant,
  onChange,
  defaultVariant = 'light',
}: ThemeSwitcherProps) {
  /**
   * A preferência vem de `useSyncExternalStore`, não de um inicializador de
   * `useState`: o initializer roda no SSR com `light` e no cliente com o valor
   * do storage, o que diverge o `aria-pressed` do HTML do servidor. Com o
   * snapshot de servidor fixo em `undefined`, a hidratação bate e o React relê
   * o storage logo depois.
   */
  const storedTheme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode | undefined>(undefined);
  const selectedValue = variant ?? selectedTheme ?? storedTheme ?? defaultVariant;
  const isControlled = variant !== undefined;
  const classes = THEME_SWITCHER_CLASS_MAP[tone][selectedValue];

  /**
   * Um único ponto escreve o tema no documento. É o que faz os tokens `--app-*`
   * de `:root`/`html[data-theme]` valerem para tudo que está fora do shell —
   * inclusive o `Modal`, que vive em portal, e o `Alert`.
   *
   * A persistência só acontece no modo não-controlado. No modo controlado o
   * consumidor é o dono do estado e também da preferência: gravar aqui faria o
   * switcher sobrescrever, a cada montagem, a escolha salva pela visita
   * anterior com o `variant` que o consumidor passou como prop.
   */
  useEffect(() => {
    document.documentElement.dataset.theme = selectedValue;

    if (!isControlled) {
      persistTheme(selectedValue);
    }
  }, [isControlled, selectedValue]);

  const handleSelect = useCallback((nextValue: ThemeMode) => {
    if (nextValue === selectedValue) {
      return;
    }

    if (!isControlled) {
      setSelectedTheme(nextValue);
    }

    onChange?.(nextValue);
  }, [isControlled, onChange, selectedValue]);

  return (
    <div
      role="group"
      aria-label="Theme"
      className={`inline-flex items-center gap-1 rounded-full border p-1 transition-colors duration-200 ${classes.container}`}
    >
      {THEME_SWITCHER_OPTIONS.map(option => {
        const isSelected = selectedValue === option.variant;

        return (
          <button
            key={option.variant}
            type="button"
            aria-label={option.label}
            aria-pressed={isSelected}
            onClick={() => handleSelect(option.variant)}
            className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 ${
              isSelected ? classes.selected : classes.unselected
            }`}
          >
            <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center leading-none">
              <Icon icon={option.icon} className="!inline-flex !align-middle text-base leading-none" />
            </span>
          </button>
        );
      })}
    </div>
  );
}