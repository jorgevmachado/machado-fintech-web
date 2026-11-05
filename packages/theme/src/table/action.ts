import { TABLE_COLOR_THEME } from './color';
import { colorClassName } from '../color';

export const buildTableActionTheme = (icon?: string, className?: string): string => {
  const classNameList: Array<string> = [
    'cursor-pointer',
    'transition-colors',
  ];

  const baseIconColor = !icon ? undefined : TABLE_COLOR_THEME[icon];
  if(baseIconColor) {
    classNameList.push(baseIconColor);
  }
  const classNameResult = classNameList.join(' ');

  return colorClassName(classNameResult, className) as string;
}