import type { TReducedSize } from '../base';

type TTabsSizeRecord = {
  list: string;
  trigger: string;
};

/**
 * O espaçamento da lista e o do trigger mudam juntos: um `string` só obrigaria
 * o componente a separar as classes por papel. `sm` é mais baixo (`h-8`) para
 * caber em toolbars sem inflar a altura da barra.
 */
export const TABS_SIZE_CLASS_MAP: Record<TReducedSize, TTabsSizeRecord> = {
  sm: {
    list: 'gap-1',
    trigger: 'h-8 px-2.5 text-xs',
  },
  md: {
    list: 'gap-1.5',
    trigger: 'h-10 px-4 text-sm',
  },
  lg: {
    list: 'gap-2',
    trigger: 'h-11 px-5 text-base',
  },
};