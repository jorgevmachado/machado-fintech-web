'use client';

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
  onRemove,
}: FileUploadFileProps) {
  return (
    <div
      data-testid="file-upload-file"
      className={[
        'flex items-center gap-3 rounded-lg border p-3',
        error ? 'border-destructive/50 bg-destructive/5' : 'border-border',
      ]
      .filter(Boolean)
      .join(' ')}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted"
        >
          📄
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {file.name}
          </p>

          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>

          {error && (
            <p className="text-xs text-destructive">
              {error.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label={`Remover ${file.name}`}
        className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        disabled={disabled}
        onClick={() => onRemove(file)}
      >
        ×
      </button>
    </div>
  );
}