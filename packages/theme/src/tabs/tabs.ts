import type { TReducedSize } from '../base';

import { TABS_LIST_CLASS_MAP, TABS_TRIGGER_CLASS_MAP, type TTabsVariant } from './appearance';
import { TABS_SIZE_CLASS_MAP } from './size';

type BuildTabsThemeParams = {
  variant?: TTabsVariant;
  size?: TReducedSize;
  className?: string;
};

type BuildTabsTriggerThemeParams = BuildTabsThemeParams & {
  isActive?: boolean;
  disabled?: boolean;
};

export type BuildTabsThemeResult = {
  root: string;
  list: string;
  panel: string;
};

const joinClasses = (classNames: Array<string | false | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const buildTabsTheme = ({
  variant = 'underline',
  size = 'md',
  className,
}: BuildTabsThemeParams = {}): BuildTabsThemeResult => {
  const sizeClass = TABS_SIZE_CLASS_MAP[size];

  return {
    root: joinClasses(['flex flex-col gap-4', className]),
    list: joinClasses(['flex w-full items-center', sizeClass.list, TABS_LIST_CLASS_MAP[variant]]),
    panel: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
  };
};

/**
 * Um trigger só pode estar num estado por vez, então o builder escolhe a
 * entrada do mapa em vez de concatenar as duas: sem `tailwind-merge`, duas
 * cores na mesma string são resolvidas pela ordem do CSS, não pela ordem de
 * escrita.
 */
export const buildTabsTriggerTheme = ({
  variant = 'underline',
  size = 'md',
  isActive = false,
  disabled = false,
  className,
}: BuildTabsTriggerThemeParams = {}): string => {
  const sizeClass = TABS_SIZE_CLASS_MAP[size];

  return joinClasses([
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'transition-colors duration-200',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
    sizeClass.trigger,
    TABS_TRIGGER_CLASS_MAP[variant][isActive ? 'active' : 'inactive'],
    disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    className,
  ]);
};