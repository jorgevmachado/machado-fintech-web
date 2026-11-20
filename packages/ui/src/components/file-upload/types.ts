import type { ReactNode } from 'react';

import type { TThemeVariant ,TReducedSize ,TTone } from '@fintech/theme';

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
  /**
   * Acento do dropzone e do card de arquivo rejeitado. Sem ele o componente
   * usava os tokens do shadcn (`primary`, `muted-foreground`, `destructive`),
   * que este projeto não define — as classes não geravam CSS.
   */
  tone?: TTone;
  size?: TReducedSize;
  className?: string;
  /**
   * Tema explícito (`light` | `dark`). Omitido, o componente usa as custom
   * properties `--app-*` herdadas do shell e acompanha a troca de tema
   * sozinho; informado, aplica a paleta literal do tema — necessário fora do
   * shell (portal, modal), onde essas variáveis não existem.
   */
  variant?: TThemeVariant;
};