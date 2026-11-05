import {
  Result ,
  ValueObject,
  type ValueObjectConfig,
} from '../base';

export interface TextConfig extends ValueObjectConfig {
  minLength?: number;
  maxLength?: number;
}

export class Text extends ValueObject<string, TextConfig> {
  protected static readonly TOO_SHORT: string = `'form.validation.text.invalid.min_length', { min: value }`;
  protected static readonly TOO_LONG: string = `'form.validation.text.invalid.max_length', { max: value }`;
  protected static readonly DEFAULT_MIN_LENGTH: number = 1;
  protected static readonly DEFAULT_MAX_LENGTH = Number.MAX_SAFE_INTEGER;

  protected constructor(value: string, config?: TextConfig) {
    super(value, config);
  }

  public static create(value: string, config?: TextConfig): Text {
    const result = this.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(text: string, config?: TextConfig): Result<Text> {
    try {
      const value = text?.trim() ?? '';
      const min = config?.minLength ?? this.DEFAULT_MIN_LENGTH;
      const max = config?.maxLength ?? this.DEFAULT_MAX_LENGTH;

      if (value.length < min) {
        throw new Error(this.TOO_SHORT.replaceAll('value', min.toString()));
      }
      if (max && value.length > max) {
        throw new Error(this.TOO_LONG.replaceAll('value', max.toString()));
      }

      return Result.ok(new this(value, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
