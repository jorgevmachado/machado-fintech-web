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

/**
 * Cobre as duas formas de cor do projeto: utilitário de paleta
 * (`text-sky-700`) e valor arbitrário de token (`text-[color:var(--app-…) ]`).
 * Sem a segunda, um override custom conviveria com a cor base e o CSS
 * resolveria pela ordem, não pela intenção de quem chamou.
 */
export const regexTailwindColor = /(?:\btext-\w+-\d+\b|\bhover:bg-\w+-\d+\b|\btext-\[color:[^\]]+\]|\bhover:bg-\[color:[^\]]+\])/g;

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