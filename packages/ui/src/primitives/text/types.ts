import { ComponentPropsWithoutRef } from 'react';

import type {
  TAlign ,
  TBreak ,
  TDecoration ,
  TDisplay ,
  TFontFamily ,
  TLeading ,
  TLineClamp ,
  TSize ,
  TTag ,
  TTone ,
  TTracking ,
  TTransform ,
  TWeight ,
  TWhitespace ,
  TWrap ,
} from '@fintech/theme';

export type TextOwnProps<T extends TTag = 'p'> = {
  as?: T;
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

export type TextTagProps = {
  tone?: TTone;
  size?: TSize;
  color?: string;
  weight?: TWeight;
  className?: string;
};

export type TextProps<T extends TTag = 'p'> = TextOwnProps<T> & Omit<ComponentPropsWithoutRef<T> ,keyof TextOwnProps<T>> & {
  currentDepth?: number;
};