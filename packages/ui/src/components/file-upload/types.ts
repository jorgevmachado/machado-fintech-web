import type { ReactNode } from 'react';

export type FileUploadErrorCode =
  | 'INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'MAX_FILES_EXCEEDED';

export type FileUploadError = {
  code: FileUploadErrorCode;
  message: string;
};

export type FileUploadProps = {
  value?: Array<File>;
  accept?: Array<string>;
  onError?: (error: FileUploadError, file: File) => void;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onFilesChange?: (files: Array<File>) => void;
};