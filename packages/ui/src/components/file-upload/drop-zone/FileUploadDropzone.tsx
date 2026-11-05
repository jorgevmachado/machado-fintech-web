'use client';

import type {
  KeyboardEvent,
  PropsWithChildren,
} from 'react';

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
      className={[
        'flex min-h-64 cursor-pointer flex-col items-center justify-center',
        'rounded-lg border-2 border-dashed p-8 text-center',
        'transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
      ]
      .filter(Boolean)
      .join(' ')}
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