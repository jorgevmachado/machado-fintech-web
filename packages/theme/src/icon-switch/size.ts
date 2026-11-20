export const OIconSwitchSize = ['sm', 'md', 'lg'] as const;

export type TIconSwitchSize = typeof OIconSwitchSize[number];

type TIconSwitchSizeRecord = {
  track: string;
  thumb: string;
  thumbChecked: string;
  thumbUnchecked: string;
  icon: string;
};

/**
 * Trilho largo o bastante para dois ícones, com o thumb (indicador) deslizando
 * de uma extremidade à outra. As larguras são explícitas para que o
 * deslocamento (`translate-x-*`) seja exato.
 */
export const ICON_SWITCH_SIZE_CLASS_MAP: Record<TIconSwitchSize, TIconSwitchSizeRecord> = {
  sm: {
    track: 'h-7 w-12 p-0.5',
    thumb: 'h-6 w-6',
    thumbChecked: 'translate-x-5',
    thumbUnchecked: 'translate-x-0',
    icon: 'h-4 w-4',
  },
  md: {
    track: 'h-9 w-16 p-1',
    thumb: 'h-7 w-7',
    thumbChecked: 'translate-x-7',
    thumbUnchecked: 'translate-x-0',
    icon: 'h-4 w-4',
  },
  lg: {
    track: 'h-11 w-20 p-1',
    thumb: 'h-9 w-9',
    thumbChecked: 'translate-x-9',
    thumbUnchecked: 'translate-x-0',
    icon: 'h-5 w-5',
  },
};