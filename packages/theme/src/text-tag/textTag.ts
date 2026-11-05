import {
  type TAlign,
  type TBreak,
  type TDecoration,
  type TDisplay,
  type TTag,
  type TTone,
  type TSize,
  type TWeight,
  type TTransform,
  type TLeading,
  type TTracking,
  type TFontFamily,
  type TWrap,
  type TLineClamp,
  type TWhitespace,
  BREAK_CLASS_MAP,
  DECORATION_CLASS_MAP,
  DISPLAY_CLASS_MAP,
  FONT_FAMILY_CLASS_MAP,
  LEADING_CLASS_MAP,
  LINE_CLAMP_CLASS_MAP,
  TEXT_ALIGN_CLASS_MAP,
  TEXT_TONE_CLASS_MAP,
  TEXT_SIZE_CLASS_MAP,
  TRACKING_CLASS_MAP,
  TRANSFORM_CLASS_MAP,
  WEIGHT_CLASS_MAP,
  WRAP_CLASS_MAP,
  WHITESPACE_CLASS_MAP,
} from '../base';

import { buildColorTone } from '../color';

export type TTextTag = {
  tone?: TTone;
  size?: TSize;
  color?: string;
  weight?: TWeight;
  leading?: TLeading;
  tracking?: TTracking;
  className?: string;
  fontFamily?: TFontFamily;
}

export const TEXT_TAG_CLASS_MAP: Record<TTag, TTextTag> = {
  blockquote: {
    tone: 'neutral',
    className: 'border-l-4 border-slate-200 pl-4 italic',
  },
  code: {
    size: 'sm',
    color: 'text-slate-800',
    fontFamily: 'mono',
    className: 'rounded-md bg-slate-100 px-1.5 py-0.5',
  },
  div: {
    size: 'base',
    tone:'neutral',
  },
  em: {
    tone:'neutral',
    className:'italic'
  },
  figcaption: {
    size: 'sm',
    tone: 'subtle',
  },
  h1: {
    size: '4xl',
    weight: 'bold',
    tracking: 'tight',
    color: 'text-slate-950',
    className:'md:text-5xl'
  },
  h2: {
    size: '3xl',
    weight: 'bold',
    tracking: 'tight',
    color: 'text-slate-950',
    className:'md:text-4xl'
  },
  h3: {
    size: '2xl',
    tone: 'default',
    weight: 'semibold',
    tracking: 'tight',
  },
  h4: {
    size: 'xl',
    weight: 'semibold',
    tone: 'default',
  },
  h5: {
    tone: 'default' ,
    size: 'lg' ,
    weight: 'semibold' ,
  },
  h6: {
    tone: 'default' ,
    size: 'base' ,
    weight: 'semibold' ,
  },
  label: {
    tone:'neutral',
    size: 'sm',
    weight: 'medium',
  },
  legend: {
    size: 'sm',
    weight: 'semibold',
    color: 'text-slate-800',
  },
  mark: {
    color: 'text-amber-950',
    className: 'bg-amber-100 px-1'
  },
  p: {
    tone:'neutral',
    size: 'base',
    leading: '7',
  },
  small: {
    size: 'sm',
    tone: 'subtle',
  },
  span: { tone:'inherit' },
  strong:{
    tone: 'default',
    weight: 'semibold',
  },
};

const appendMappedClass = <T extends string>(
  classNames: string[],
  value: T | undefined,
  classMap: Record<T, string>,
): void => {
  if (!value) {
    return;
  }

  classNames.push(classMap[value]);
};

type BuildTextTagThemParams = {
  tag: TTag;
  wrap?: TWrap;
  tone?: TTone;
  size?: TSize;
  align?: TAlign;
  color?: string;
  srOnly?: boolean;
  italic?: boolean;
  weight?: TWeight;
  display?: TDisplay;
  leading?: TLeading;
  truncate?: boolean;
  tracking?: TTracking;
  className?: string;
  lineClamp?: TLineClamp;
  transform?: TTransform;
  fontFamily?: TFontFamily;
  decoration?: TDecoration;
  whitespace?: TWhitespace;
  breakStrategy?: TBreak;
}

export const buildTextTagTheme = ({
  tag,
  wrap,
  tone,
  size,
  align,
  color,
  srOnly,
  italic,
  weight,
  display,
  leading,
  truncate,
  tracking,
  className,
  lineClamp,
  transform,
  fontFamily,
  decoration,
  whitespace,
  breakStrategy,
}: BuildTextTagThemParams) => {
  const classNames: Array<string> = [];
  const tagClassProps = TEXT_TAG_CLASS_MAP[tag];
  const tagColor = buildColorTone({
    tone,
    color,
    optColor: tagClassProps?.color ,
    optTone: tagClassProps?.tone ,
    classMap: TEXT_TONE_CLASS_MAP,
  });

  if (tagColor) {
    classNames.push(tagColor);
  }

  appendMappedClass(classNames, size ?? tagClassProps?.size, TEXT_SIZE_CLASS_MAP);
  appendMappedClass(classNames, weight ?? tagClassProps?.weight, WEIGHT_CLASS_MAP);
  appendMappedClass(classNames, tracking ?? tagClassProps?.tracking, TRACKING_CLASS_MAP);
  appendMappedClass(classNames, fontFamily ?? tagClassProps?.fontFamily, FONT_FAMILY_CLASS_MAP);
  appendMappedClass(classNames, leading ?? tagClassProps?.leading, LEADING_CLASS_MAP);

  if (tagClassProps?.className) {
    classNames.push(tagClassProps.className);
  }
  appendMappedClass(classNames, align, TEXT_ALIGN_CLASS_MAP);
  appendMappedClass(classNames, transform, TRANSFORM_CLASS_MAP);
  appendMappedClass(classNames, decoration, DECORATION_CLASS_MAP);
  appendMappedClass(classNames, display, DISPLAY_CLASS_MAP);
  appendMappedClass(classNames, wrap, WRAP_CLASS_MAP);
  appendMappedClass(classNames, whitespace, WHITESPACE_CLASS_MAP);
  appendMappedClass(classNames, breakStrategy, BREAK_CLASS_MAP);

  if (lineClamp !== undefined) {
    classNames.push(LINE_CLAMP_CLASS_MAP[lineClamp]);
  }

  if (italic) {
    classNames.push('italic');
  }

  if (truncate) {
    classNames.push('truncate');
  }

  if (srOnly) {
    classNames.push('sr-only');
  }

  if (className) {
    classNames.push(className);
  }

  return classNames;
}