import {
  ICON_SWITCH_ICON_ACTIVE_CLASS,
  ICON_SWITCH_ICON_INACTIVE_CLASS,
  ICON_SWITCH_THUMB_CLASS,
  ICON_SWITCH_TRACK_CLASS,
} from './appearance';
import { ICON_SWITCH_SIZE_CLASS_MAP, type TIconSwitchSize } from './size';

type BuildIconSwitchThemeParams = {
  size?: TIconSwitchSize;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  thumbClassName?: string;
};

export type BuildIconSwitchThemeResult = {
  track: string;
  thumb: string;
  /** Ícone dentro do indicador (estado ativo). */
  iconActive: string;
  /** Ícone no trilho, do lado oposto (estado inativo). */
  iconInactive: string;
};

const joinClasses = (classNames: Array<string | false | undefined>): string =>
  classNames.filter(Boolean).join(' ');

/**
 * Trilho neutro que não muda de cor com o estado: só o indicador desliza e os
 * ícones trocam de contraste. `checked` permanece no contrato para quem já
 * chama o builder, mas não influencia mais a cor do trilho.
 */
export const buildIconSwitchTheme = ({
  size = 'md',
  checked = false,
  disabled = false,
  className,
  thumbClassName,
}: BuildIconSwitchThemeParams): BuildIconSwitchThemeResult => {
  const sizeClass = ICON_SWITCH_SIZE_CLASS_MAP[size];

  return {
    track: joinClasses([
      'relative inline-flex shrink-0 items-center rounded-full',
      'transition-colors duration-200 ease-out',
      'focus-within:ring-2 focus-within:ring-blue-300 focus-within:ring-offset-2',
      sizeClass.track,
      ICON_SWITCH_TRACK_CLASS,
      disabled && 'opacity-70',
      className,
    ]),
    thumb: joinClasses([
      'inline-flex items-center justify-center rounded-full shadow-sm',
      'transition-transform duration-200 ease-out',
      ICON_SWITCH_THUMB_CLASS,
      sizeClass.thumb,
      checked ? sizeClass.thumbChecked : sizeClass.thumbUnchecked,
      thumbClassName,
    ]),
    iconActive: joinClasses([
      'transition-all duration-200 ease-out scale-110',
      sizeClass.icon,
      ICON_SWITCH_ICON_ACTIVE_CLASS,
    ]),
    iconInactive: joinClasses([
      'transition-all duration-200 ease-out scale-90 opacity-70',
      sizeClass.icon,
      ICON_SWITCH_ICON_INACTIVE_CLASS,
    ]),
  };
};