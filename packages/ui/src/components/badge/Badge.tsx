import React from 'react';

import { buildBadgeTheme } from '@fintech/theme';

import { useTranslationResolver } from '../../lang';

import type { BadgeProps } from './types';

export default function Badge({
  tone = 'primary' ,
  random = false ,
  size = 'md' ,
  variant = 'soft' ,
  shape = 'pill' ,
  children ,
  iconLeft ,
  iconRight ,
  className ,
  ...spanProps
}: BadgeProps) {
  const { resolveChildren: resolveTranslation } = useTranslationResolver();
  return (
    <span
      { ...spanProps }
      className={buildBadgeTheme({ tone, random, size, variant, shape, className })}
    >
      { iconLeft ? <span aria-hidden="true" className="inline-flex shrink-0">{ iconLeft }</span> : null }
      { resolveTranslation(children, 3) }
      { iconRight ?
        <span aria-hidden="true" className="inline-flex shrink-0">{ iconRight }</span> : null }
    </span>
  );
}