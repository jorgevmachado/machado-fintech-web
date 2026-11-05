import { type TTone } from '../base';
import {
  BUTTON_APPEARANCE_CLASS_MAP ,
  type TButtonAppearance,
} from './appearance';
import { BUTTON_SIZE_CLASS_MAP ,type TButtonSize } from './size';

type BuildButtonThemeParams = {
  size: TButtonSize;
  tone: TTone;
  iconOnly?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  appearance: TButtonAppearance;
};

export const buildButtonTheme = ({
  size,
  tone,
  iconOnly = false,
  disabled = false,
  fullWidth = false,
  className,
  appearance,
}: BuildButtonThemeParams) => {
  const classNameList: Array<string> = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-xl',
    'font-semibold',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-60',
  ];
  classNameList.push(disabled ? 'cursor-not-allowed' : 'cursor-pointer');
  classNameList.push(BUTTON_APPEARANCE_CLASS_MAP[appearance][tone]);
  classNameList.push(iconOnly ? BUTTON_SIZE_CLASS_MAP[size].iconOnly : BUTTON_SIZE_CLASS_MAP[size].default);
  if (fullWidth) {
    classNameList.push('w-full');
  }

  if (className) {
    classNameList.push(className);
  }

  return classNameList;
}