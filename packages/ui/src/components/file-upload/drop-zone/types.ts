import type { DragEvent ,PropsWithChildren } from 'react';

export type FileUploadDropzoneProps = PropsWithChildren<{
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
  disabled?: boolean;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  isDragActive: boolean;
}>;