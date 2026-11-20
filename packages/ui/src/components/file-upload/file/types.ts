import type { FileUploadError } from '../types';

import type { TThemeVariant } from '@fintech/theme';

export type FileUploadFileProps = {
  file: File;
  error?: FileUploadError;
  disabled?: boolean;
  className?: string;
  variant?: TThemeVariant;
  onRemove: (file: File) => void;
};