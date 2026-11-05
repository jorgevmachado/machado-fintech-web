'use client';

import { forwardRef } from 'react';

import type { FileUploadInputProps } from './types';

const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(
  function FileUploadInput(
    { accept, multiple = false, disabled = false, onChange },
    ref,
  ) {
    return (
      <input
        ref={ref}
        type="file"
        accept={accept?.join(',')}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        hidden
      />
    );
  },
);

export default FileUploadInput;
