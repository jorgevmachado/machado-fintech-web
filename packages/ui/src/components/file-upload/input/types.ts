import type { ChangeEvent } from 'react';

export type FileUploadInputProps = {
  accept?: Array<string>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  disabled?: boolean;
};