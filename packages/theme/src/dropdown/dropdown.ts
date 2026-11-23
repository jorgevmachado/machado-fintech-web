import type { TReducedSize, TTone } from '../base';

import {
  DROPDOWN_ITEM_SELECTED_CLASS,
  DROPDOWN_ITEM_TONE_CLASS_MAP,
  DROPDOWN_TRIGGER_SHELL_CLASS_MAP,
  DROPDOWN_TRIGGER_TONE_CLASS_MAP,
  type TDropdownAppearance,
  type TDropdownPlacement,
} from './appearance';
import { DROPDOWN_SIZE_CLASS_MAP } from './size';

type BuildDropdownThemeParams = {
  size?: TReducedSize;
  tone?: TTone;
  appearance?: TDropdownAppearance;
  placement?: TDropdownPlacement;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
};

export type BuildDropdownThemeResult = {
  trigger: string;
  menu: string;
  item: string;
  /** Item com o tom resolvido num único ponto (sem classes concorrentes). */
  itemFor: (tone?: TTone) => string;
  itemSelected: string;
  separator: string;
  check: string;
};

const PLACEMENT_CLASS_MAP: Record<TDropdownPlacement, string> = {
  'bottom-start': 'left-0 top-full mt-1',
  'bottom-end': 'right-0 top-full mt-1',
  'top-start': 'bottom-full left-0 mb-1',
  'top-end': 'bottom-full right-0 mb-1',
};

const joinClasses = (classNames: Array<string | false | undefined>): string =>
  classNames.filter(Boolean).join(' ');

/**
 * O projeto não usa `tailwind-merge`, então classes de cor concorrentes na
 * mesma string são resolvidas pela ordem do CSS, não pela ordem de escrita.
 * Aqui o tom do item é escolhido uma única vez, evitando `text-slate-700` e
 * `text-red-700` juntos no mesmo elemento.
 */
const ITEM_BASE_CLASSES = [
  'flex w-full items-center gap-2 text-left transition-colors',
  'focus:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');

export const buildDropdownTheme = ({
  size = 'md',
  tone = 'default',
  appearance = 'outline',
  placement = 'bottom-end',
  fullWidth = false,
  disabled = false,
  className,
  menuClassName,
}: BuildDropdownThemeParams): BuildDropdownThemeResult => {
  const sizeClass = DROPDOWN_SIZE_CLASS_MAP[size];

  return {
    trigger: joinClasses([
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
      'transition-colors duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      DROPDOWN_TRIGGER_SHELL_CLASS_MAP[appearance],
      DROPDOWN_TRIGGER_TONE_CLASS_MAP[appearance][tone],
      sizeClass.trigger,
      appearance === 'icon' && 'w-auto p-2',
      fullWidth && 'w-full',
      className,
    ]),
    menu: joinClasses([
      'absolute z-50 flex max-h-72 min-w-[160px] flex-col overflow-y-auto',
      'rounded-xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] py-1 shadow-lg',
      'focus:outline-none',
      PLACEMENT_CLASS_MAP[placement],
      fullWidth && 'w-full',
      menuClassName,
    ]),
    // Sem tone aqui: o componente resolve o tom do item via `itemFor`.
    item: joinClasses([ITEM_BASE_CLASSES, sizeClass.item, DROPDOWN_ITEM_TONE_CLASS_MAP.default]),
    itemFor: (itemTone: TTone = 'default') =>
      joinClasses([ITEM_BASE_CLASSES, sizeClass.item, DROPDOWN_ITEM_TONE_CLASS_MAP[itemTone]]),
    itemSelected: DROPDOWN_ITEM_SELECTED_CLASS,
    separator: 'my-1 h-px w-full bg-[color:var(--app-border,#e2e8f0)]',
    check: sizeClass.icon,
  };
};