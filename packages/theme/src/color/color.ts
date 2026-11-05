import type { TTone } from '../base';

type BuildColorToneParams = {
  tone?: TTone;
  color?: string;
  optTone?: TTone;
  optColor?: string;
  classMap?: Record<TTone ,string>;
}
export const buildColorTone = ({
    tone,
    color,
    optTone,
    optColor,
    classMap
  }: BuildColorToneParams
): string | undefined => {
  if (color) {
    return color;
  }

  if (tone && classMap) {
    return classMap[tone];
  }

  if (optTone && classMap) {
    return classMap[optTone];
  }

  if (optColor) {
    return optColor;
  }

  return undefined;
};

export const regexTailwindColor = /(?:\btext-\w+-\d+\b|\bhover:bg-\w+-\d+\b)/g;

export const updateColorClassName = (className: string, newClassName: string): string => {
  const cleanClassNameColor = className.replace(regexTailwindColor, '').trim();
  return `${cleanClassNameColor} ${newClassName}`.replace(/\s+/g, ' ').trim();
}

export const colorClassName = (className?: string, newClassName?: string): string | undefined => {
  if(!className) {
    return newClassName;
  }

  if(!newClassName) {
    return className;
  }

  return updateColorClassName(className, newClassName);
}