'use client';

import React, {
  useCallback,
  useRef,
  useState,
} from 'react';

import { FileUploadDropzone } from './drop-zone';
import { FileUploadFile } from './file';
import { FileUploadInput } from './input';
import type {
  FileUploadError,
  FileUploadProps,
} from './types';

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

const DEFAULT_ACCEPT = [
  'application/pdf',
  'image/jpeg',
  'image/png',
];

const getFileKey = (file: File): string =>
  `${file.name}-${file.size}-${file.lastModified}`;

const isAcceptedFileType = (
  file: File,
  accept: string[],
): boolean => accept.includes(file.type);

const createError = (
  code: FileUploadError['code'],
  message: string,
): FileUploadError => ({
  code,
  message,
});

export default function FileUpload({
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  maxFiles,
  multiple = false,
  disabled = false,
  value,
  onFilesChange,
  onError,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<
    Record<string, FileUploadError>
  >({});
  const [isDragActive, setIsDragActive] = useState(false);

  const files = value ?? internalFiles;

  const updateFiles = useCallback(
    (nextFiles: File[]) => {
      if (value === undefined) {
        setInternalFiles(nextFiles);
      }

      onFilesChange?.(nextFiles);
    },
    [onFilesChange, value],
  );

  const validateFile = useCallback(
    (file: File): FileUploadError | undefined => {
      if (!isAcceptedFileType(file, accept)) {
        return createError(
          'INVALID_TYPE',
          'Tipo de arquivo não permitido.',
        );
      }

      if (file.size > maxSize) {
        return createError(
          'FILE_TOO_LARGE',
          `O arquivo deve ter no máximo ${Math.round(
            maxSize / 1024 / 1024,
          )} MB.`,
        );
      }

      return undefined;
    },
    [accept, maxSize],
  );

  const addFiles = useCallback(
    (selectedFiles: File[]) => {
      if (disabled || selectedFiles.length === 0) {
        return;
      }

      const filesToAdd = multiple
        ? selectedFiles
        : selectedFiles.slice(0, 1);

      const currentKeys = new Set([
        ...files.map(getFileKey),
        ...rejectedFiles.map(getFileKey),
      ]);

      const nextErrors: Record<string, FileUploadError> = {};
      const validFiles: File[] = [];
      const nextRejectedFiles: File[] = [];

      for (const file of filesToAdd) {
        const key = getFileKey(file);

        if (currentKeys.has(key)) {
          continue;
        }

        const error = validateFile(file);

        if (error) {
          nextErrors[key] = error;
          nextRejectedFiles.push(file);
          currentKeys.add(key);

          onError?.(error, file);

          continue;
        }

        validFiles.push(file);
        currentKeys.add(key);
      }

      if (maxFiles !== undefined) {
        const availableSlots = Math.max(
          maxFiles - files.length,
          0,
        );

        const filesWithinLimit = validFiles.slice(
          0,
          availableSlots,
        );

        const filesExceedingLimit = validFiles.slice(
          availableSlots,
        );

        for (const file of filesExceedingLimit) {
          const error = createError(
            'MAX_FILES_EXCEEDED',
            `Você pode adicionar no máximo ${maxFiles} arquivos.`,
          );

          const key = getFileKey(file);

          nextErrors[key] = error;
          nextRejectedFiles.push(file);

          onError?.(error, file);
        }

        if (filesWithinLimit.length > 0) {
          updateFiles([
            ...files,
            ...filesWithinLimit,
          ]);
        }
      } else if (validFiles.length > 0) {
        updateFiles([
          ...files,
          ...validFiles,
        ]);
      }

      if (nextRejectedFiles.length > 0) {
        setRejectedFiles((currentRejectedFiles) => [
          ...currentRejectedFiles,
          ...nextRejectedFiles,
        ]);
      }

      if (Object.keys(nextErrors).length > 0) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          ...nextErrors,
        }));
      }
    },
    [
      disabled,
      files,
      maxFiles,
      multiple,
      onError,
      rejectedFiles,
      updateFiles,
      validateFile,
    ],
  );

  const removeFile = useCallback(
    (file: File) => {
      const key = getFileKey(file);

      const isAcceptedFile = files.some(
        (currentFile) =>
          getFileKey(currentFile) === key,
      );

      if (isAcceptedFile) {
        updateFiles(
          files.filter(
            (currentFile) =>
              getFileKey(currentFile) !== key,
          ),
        );
      } else {
        setRejectedFiles((currentRejectedFiles) =>
          currentRejectedFiles.filter(
            (currentFile) =>
              getFileKey(currentFile) !== key,
          ),
        );
      }

      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        delete nextErrors[key];

        return nextErrors;
      });
    },
    [files, updateFiles],
  );

  const openFilePicker = useCallback(() => {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(
        Array.from(event.target.files ?? []),
      );

      event.target.value = '';
    },
    [addFiles],
  );

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) {
        return;
      }

      dragCounterRef.current += 1;
      setIsDragActive(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) {
        return;
      }

      dragCounterRef.current -= 1;

      if (dragCounterRef.current === 0) {
        setIsDragActive(false);
      }
    },
    [disabled],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!disabled) {
        event.dataTransfer.dropEffect = 'copy';
      }
    },
    [disabled],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      dragCounterRef.current = 0;
      setIsDragActive(false);

      if (disabled) {
        return;
      }

      addFiles(
        Array.from(event.dataTransfer.files),
      );
    },
    [addFiles, disabled],
  );

  const displayedFiles = [
    ...files,
    ...rejectedFiles,
  ];

  return (
    <div className="flex flex-col gap-4">
      <FileUploadInput
        ref={inputRef}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
      />

      <FileUploadDropzone
        disabled={disabled}
        isDragActive={isDragActive}
        onClick={openFilePicker}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl">
            ↑
          </span>

          <p className="text-sm font-medium">
            Arraste seus comprovantes aqui
          </p>

          <p className="text-sm text-muted-foreground">
            ou clique para selecionar
          </p>

          <p className="text-xs text-muted-foreground">
            PDF, JPG ou PNG
          </p>
        </div>
      </FileUploadDropzone>

      {displayedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {displayedFiles.map((file) => {
            const key = getFileKey(file);

            return (
              <FileUploadFile
                key={key}
                file={file}
                error={errors[key]}
                disabled={disabled}
                onRemove={removeFile}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
