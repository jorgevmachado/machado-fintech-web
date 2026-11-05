import { Result ,ValueObject ,type ValueObjectConfig } from '../base';

export interface FileConfig extends  ValueObjectConfig {
  accept?: Array<string>;
  maxSize?: number;
  maxFiles?: number;
}

export class FileVO extends ValueObject<File, FileConfig> {
  protected static readonly INVALID_TYPE: string = 'file.validation.invalid_type';
  protected static readonly TOO_LARGE: string = 'file.validation.too_large, {{ max: value }}';
  protected static readonly DEFAULT_MAX_SIZE: number = 10 * 1024 * 1024; // 10MB
  protected static readonly DEFAULT_ACCEPT: Array<string> = [
    'application/pdf',
    'image/jpeg',
    'image/png',
  ];
  private readonly _fileKey: string;

  protected constructor(value: File, config?: FileConfig) {
    super(value, config);
    this._fileKey = FileVO.getFileKey(value);
  }

  get fileKey(): string {
    return this._fileKey;
  }

  public static getFileKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  public static isAcceptedFileType(file: File, accept: Array<string>): boolean {
    return accept.includes(file.type);
  }

  public static tryCreate(file: File, config?: FileConfig): Result<FileVO> {
    const accept = config?.accept || FileVO.DEFAULT_ACCEPT;
    const maxSize = config?.maxSize || FileVO.DEFAULT_MAX_SIZE;
    try {
      if (!FileVO.isAcceptedFileType(file ,accept)) {
        throw new Error(FileVO.INVALID_TYPE);
      }
      if (file.size > maxSize) {
        const sizeInMB = (maxSize / (1024 * 1024)).toFixed(2);
        throw new Error(FileVO.TOO_LARGE.replaceAll('value' ,sizeInMB));
      }
      return Result.ok(new FileVO(file, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  public static create(file: File, config?: FileConfig): FileVO {
    const result = FileVO.tryCreate(file, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }
}