'use client';

import type {
  KeyboardEvent,
  PropsWithChildren,
} from 'react';

import { buildFileUploadDropzoneTheme } from '@fintech/theme';

import type { FileUploadDropzoneProps } from './types';

export default function FileUploadDropzone({
  onDrop,
  onClick,
  children,
  disabled = false,
  onDragOver,
  onDragEnter,
  onDragLeave,
  isDragActive,
  tone = 'primary',
  size = 'md',
  className,
  variant,
}: PropsWithChildren<FileUploadDropzoneProps>) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      aria-disabled={disabled}
      aria-label="File upload area"
      className={buildFileUploadDropzoneTheme({
        size,
        tone,
        isDragActive,
        disabled,
        className,
        variant,
      })}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
}