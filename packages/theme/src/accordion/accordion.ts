import type { TReducedSize } from '../base';

import {
  ACCORDION_TRIGGER_CLASS_MAP,
  ACCORDION_VARIANT_CLASS_MAP,
  type TAccordionVariant,
} from './appearance';
import { ACCORDION_SIZE_CLASS_MAP } from './size';
import type {
  BuildAccordionThemeResult,
  BuildAccordionTriggerThemeResult,
} from './types';

type BuildAccordionThemeParams = {
  variant?: TAccordionVariant;
  size?: TReducedSize;
  className?: string;
};

type BuildAccordionTriggerThemeParams = BuildAccordionThemeParams & {
  isOpen?: boolean;
  disabled?: boolean;
};

const joinClasses = (classNames: Array<string | false | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const buildAccordionTheme = ({
  variant = 'default',
  size = 'md',
  className,
}: BuildAccordionThemeParams = {}): BuildAccordionThemeResult => {
  const variantClass = ACCORDION_VARIANT_CLASS_MAP[variant];
  const sizeClass = ACCORDION_SIZE_CLASS_MAP[size];

  return {
    root: joinClasses(['w-full', variantClass.root, className]),
    item: variantClass.item,
    content: joinClasses([sizeClass.content, variantClass.content]),
  };
};

/**
 * `rotate-180` fica só no `icon`. O trigger não recebe classe de rotação nem
 * de estado que já exista no item, para não duplicar classe concorrente numa
 * string que o navegador resolve pela ordem do CSS.
 */
export const buildAccordionTriggerTheme = ({
  variant = 'default',
  size = 'md',
  isOpen = false,
  disabled = false,
  className,
}: BuildAccordionTriggerThemeParams = {}): BuildAccordionTriggerThemeResult => {
  const sizeClass = ACCORDION_SIZE_CLASS_MAP[size];

  return {
    trigger: joinClasses([
      'flex w-full items-center justify-between gap-3 text-left font-semibold',
      'transition-colors duration-200',
      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500',
      sizeClass.trigger,
      ACCORDION_TRIGGER_CLASS_MAP[variant][isOpen ? 'open' : 'closed'],
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      className,
    ]),
    icon: joinClasses([
      'shrink-0 text-[color:var(--app-text-muted,#64748b)] transition-transform duration-200',
      sizeClass.icon,
      isOpen && 'rotate-180',
    ]),
  };
};