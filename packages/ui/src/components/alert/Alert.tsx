'use client';

import React from 'react';

import { ALERT_VARIANT_CLASS_MAP, ALERT_VARIANT_ICON_MAP } from '@fintech/theme';

import { useTranslationResolver } from '../../lang';
import { Icon } from '../../primitives';

import type { AlertProps } from './types';

export default function Alert({ title, variant, onClose, visible = true, className, description }: AlertProps) {

  const { resolve: resolveTranslation } = useTranslationResolver();

  if (!visible) {
    return null;
  }

  const style = ALERT_VARIANT_CLASS_MAP[variant];
  const icon = ALERT_VARIANT_ICON_MAP[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={ `
        flex
        w-full
        max-w-sm
        items-start
        gap-3
        rounded-lg
        border
        p-4
        shadow-lg
        animate-in
        fade-in
        slide-in-from-top-2
        ${ style }
        ${ className }
      ` }
    >

      <div
        className="
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-full
          font-bold
        "
        data-testid={`alert-icon-${variant}`}
      >
        <Icon icon={icon} size="xl" />
      </div>


      <div className="flex-1">

        <h3 className="text-sm font-semibold" data-testid="alert-title">
          { resolveTranslation(title) }
        </h3>


        { description && (
          <p className="mt-1 text-sm opacity-80" data-testid="alert-description">
            { resolveTranslation(description) }
          </p>
        ) }

      </div>


      { onClose && (
        <button
          type="button"
          onClick={ onClose }
          aria-label="Close"
          data-testid="alert-close"
          className="rounded p-1 text-sm opacity-60 transition hover:opacity-100 cursor-pointer"
        >
          ✕
        </button>
      ) }

    </div>
  );
}
