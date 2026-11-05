import {
  Result ,
  ValueObject,
  type ValueObjectConfig,
} from '../base';

export interface NameConfig extends ValueObjectConfig {
  minLength?: number;
  maxLength?: number;
}

export class Name extends ValueObject<string, NameConfig> {
  protected static readonly TOO_SHORT: string = `'form.validation.name.invalid.min_length', { min: value }`;
  protected static readonly TOO_LONG: string = `'form.validation.name.invalid.max_length', { max: value }`;
  protected static readonly DEFAULT_MIN_LENGTH: number = 2;
  protected static readonly DEFAULT_MAX_LENGTH = 50;

  protected constructor(value: string, config?: NameConfig) {
    super(value, config);
  }

  public static create(value: string, config?: NameConfig): Name {
    const result = this.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(name: string, config?: NameConfig): Result<Name> {
    try {
      const value = name?.trim() ?? '';
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
