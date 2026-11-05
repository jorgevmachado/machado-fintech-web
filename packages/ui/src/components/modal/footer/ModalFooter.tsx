'use client';

import React from 'react';

import { ALIGN_JUSTIFY_CLASS_MAP } from '@fintech/theme';

import Button from '../../button';

import type { ModalFooterProps } from './types';

export default function ModalFooter({
  layout,
  onClose,
  primary,
  secondary,
}: ModalFooterProps) {

  const footerOrderClass = layout?.invert
    ? 'flex-row-reverse'
    : 'flex-row';

  return (
    <footer
      className={[
        'flex shrink-0 items-center',
        ALIGN_JUSTIFY_CLASS_MAP[layout?.align ?? 'right'],
        footerOrderClass,
        'gap-3',
        'border-t border-gray-200',
        'px-6 py-4',
      ].join(' ')}
    >
      {secondary && (
        <Button {...secondary} tone={secondary.tone ?? 'danger'} onClick={secondary.onClick ?? onClose} />
      )}

      <Button {...primary} onClick={primary.onClick ?? onClose} />
    </footer>
  )
}