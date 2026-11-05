'use client';

import React ,{ useMemo } from 'react';

import { buildButtonTheme } from '@fintech/theme';

import { Icon } from '../../primitives';

import type { ButtonProps } from './types';
import { useTranslationResolver } from '../../lang';


export default function Button({
  tone = 'primary',
  type = 'button',
  size = 'md',
  disabled = false,
  children,
  iconLeft,
  iconRight,
  fullWidth = false,
  isLoading = false,
  className = '',
  appearance = 'solid',
  loadingText = 'Loading...',
  ...buttonProps
}: ButtonProps) {
  const { resolveChildren: resolveTranslation } = useTranslationResolver();

  const hasContent = Boolean(children);
  const hasSingleIcon = !hasContent && Boolean(iconLeft || iconRight);
  const isIconVariant = appearance === 'icon' || appearance === 'iconNoBorder';

  const buttonClassName = useMemo(() => {
    const classNameList = buildButtonTheme({
      size: size ?? 'md',
      tone: tone ?? 'solid',
      iconOnly: hasSingleIcon || isIconVariant,
      disabled,
      fullWidth,
      className,
      appearance:  appearance ?? 'solid',
    });
    return classNameList.filter(Boolean).join(' ');
  }, [
    size,
    tone,
    fullWidth,
    hasSingleIcon,
    isIconVariant,
    disabled,
    className,
    appearance,
  ]);

  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClassName}
    >
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          {hasContent ? resolveTranslation(loadingText, 3) : null}
        </>
      ) : (
        <>
          {iconLeft && <Icon icon={iconLeft} aria-hidden="true" className="inline-flex shrink-0"/>}
          {children && <span>{resolveTranslation(children, 3)}</span>}
          {iconRight && <Icon icon={iconRight} aria-hidden="true" className="inline-flex shrink-0"/>}
        </>
      )}
    </button>
  );
};
