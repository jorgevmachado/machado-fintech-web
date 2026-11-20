import type { TReducedSize } from '../base';

type TAccordionSizeRecord = {
  trigger: string;
  content: string;
  icon: string;
};

/**
 * `trigger` carrega a altura mínima de toque (`h-11` no `md`), não só o
 * padding: o trigger é o alvo inteiro do clique, e a linha precisa ser
 * confortável no mobile.
 */
export const ACCORDION_SIZE_CLASS_MAP: Record<TReducedSize, TAccordionSizeRecord> = {
  sm: {
    trigger: 'min-h-9 px-1 text-sm',
    content: 'px-1 text-sm',
    icon: 'h-4 w-4',
  },
  md: {
    trigger: 'min-h-11 px-1 text-sm',
    content: 'px-1 text-sm',
    icon: 'h-4 w-4',
  },
  lg: {
    trigger: 'min-h-12 px-1 text-base',
    content: 'px-1 text-base',
    icon: 'h-5 w-5',
  },
};