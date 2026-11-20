'use client';

import { buildFileUploadFileTheme } from '@fintech/theme';

import type { FileUploadFileProps } from './types';

const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FileUploadFile({
  file,
  error,
  disabled = false,
  className,
  variant,
  onRemove,
}: FileUploadFileProps) {
  const theme = buildFileUploadFileTheme({
    hasError: Boolean(error),
    disabled,
    className,
    variant,
  });

  return (
    <div
      data-testid="file-upload-file"
      className={theme.root}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          aria-hidden="true"
          className={theme.thumbnail}
        >
          📄
        </div>

        <div className="min-w-0">
          <p className={theme.name}>
            {file.name}
          </p>

          <p className={theme.size}>
            {formatFileSize(file.size)}
          </p>

          {error && (
            <p className={theme.error}>
              {error.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label={`Remover ${file.name}`}
        className={theme.remove}
        disabled={disabled}
        onClick={() => onRemove(file)}
      >
        ×
      </button>
    </div>
  );
}