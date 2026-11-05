'use client';

import { useState } from 'react';

import {
  THEME_SWITCHER_CLASS_MAP ,
  THEME_SWITCHER_OPTIONS ,
} from '@fintech/theme';

import { Icon } from '../../primitives';

import type { ThemeMode, ThemeSwitcherProps } from './types';

export default function ThemeSwitcher({
  tone = 'primary',
  variant,
  onChange,
  defaultVariant = 'light',
}: ThemeSwitcherProps) {
  const [internalValue, setInternalValue] = useState<ThemeMode>(defaultVariant);
  const selectedValue = variant ?? internalValue;
  const isControlled = variant !== undefined;
  const classes = THEME_SWITCHER_CLASS_MAP[tone][selectedValue];

  const handleSelect = (nextValue: ThemeMode) => {
    if (nextValue === selectedValue) {
      return;
    }

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

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
