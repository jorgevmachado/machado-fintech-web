'use client';

import React ,{ useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';

import { Icon } from '../../primitives';
import type { ModalProps } from './types';
import { ModalFooter } from './footer';
import { useTranslationResolver } from '../../lang';

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: ModalProps) {
  const titleId = useId();
  const { resolveChildren: resolveTranslation } = useTranslationResolver();

  const [isMounted, setIsMounted] = useState(open);

  if (open && !isMounted) {
    setIsMounted(true);
  }

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted, onClose]);

  if (!isMounted) {
    return null;
  }

  const modalAnimationClass = open
    ? 'animate-modal-in'
    : 'animate-modal-out';

  const overlayAnimationClass = open
    ? 'animate-modal-overlay-in'
    : 'animate-modal-overlay-out';

  const handleOverlayMouseDown = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modal = (
    <div
      className={[
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'p-4',
        'bg-black/50 backdrop-blur-[2px]',
        overlayAnimationClass,
      ].join(' ')}
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'flex w-full max-w-lg flex-col',
          'max-h-[calc(100vh-2rem)]',
          'overflow-hidden',
          'rounded-xl',
          'border border-gray-200',
          'bg-white',
          'shadow-2xl',
          modalAnimationClass,
        ].join(' ')}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onAnimationEnd={() => {
          if (!open) {
            setIsMounted(false);
          }
        }}
      >
        <header
          className={[
            'flex shrink-0 items-center justify-between',
            'border-b border-gray-200',
            'px-6 py-4',
          ].join(' ')}
        >
          <h2
            id={titleId}
            className="text-lg font-semibold text-gray-900"
          >
            {resolveTranslation(title, 3)}
          </h2>

          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className={[
              'cursor-pointer',
              'inline-flex size-9 items-center justify-center',
              'rounded-md',
              'text-gray-500',
              'transition-colors',
              'hover:bg-gray-100',
              'hover:text-gray-900',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-gray-400',
            ].join(' ')}
          >
            <Icon icon="close" className="size-5" />
          </button>
        </header>

        <div
          className={[
            'min-h-0 flex-1 overflow-y-auto',
            'px-6 py-5',
          ].join(' ')}
        >
          {resolveTranslation(children, 3)}
        </div>

        {footer && (
          <ModalFooter {...footer} onClose={onClose} />
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}