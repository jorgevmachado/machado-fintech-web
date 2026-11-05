import type { FileUploadError } from '../types';

export type FileUploadFileProps = {
  file: File;
  error?: FileUploadError;
  disabled?: boolean;
  onRemove: (file: File) => void;
};