import { Result ,ValueObject ,ValueObjectConfig } from '../base';

export type StringConfig = ValueObjectConfig;

export class StringVO extends ValueObject<string, StringConfig> {
  private static readonly INVALID_STRING = 'string.invalid';
  private readonly _snakeCase: string;
  constructor(value: string, config?: StringConfig) {
    StringVO.validate(value);
    super(value, config);
    this._snakeCase = StringVO.toSnakeCase(value);
  }

  get snakeCase(): string {
    return this._snakeCase;
  }

  public static tryCreate(value: string, config?: StringConfig):Result<StringVO> {
    try {
      return Result.ok(new StringVO(value, config));
    } catch {
      return Result.fail(StringVO.INVALID_STRING);
    }
  }

  public static create(value: string, config?: StringConfig): StringVO {
    const result = StringVO.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static toSnakeCase(value?: string): string {
    if (!value) {
      return '';
    }
    const matches = value.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g);

    if (!matches) {
      return value;
    }

    return matches.map((word) => word.toLowerCase()).join('_');
  }

  private static validate(value: string): void {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(StringVO.INVALID_STRING);
    }
  }
}