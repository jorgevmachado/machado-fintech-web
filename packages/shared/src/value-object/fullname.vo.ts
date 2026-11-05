import {
  Result ,
  ValueObject,
  type ValueObjectConfig,
} from '../base';

import { Name, type NameConfig } from './name.vo';

export class Fullname extends Name {
  protected static readonly TOO_SHORT: string = `'form.validation.fullname.invalid.min_length', { min: value }`;
  protected static readonly TOO_LONG: string = `'form.validation.fullname.invalid.max_length', { max: value }`;
  protected static readonly FULL_NAME_REQUIRED: string = 'form.validation.fullname.invalid.first_last_required';
  protected static readonly FULL_NAME_TOO_SHORT: string = `'form.validation.fullname.invalid.first_last_too_short', { min: value }`;

  public static override create(name: string, config?: NameConfig): Fullname {
    const result = this.tryCreate(name, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static override tryCreate(name: string, config?: NameConfig): Result<Fullname> {
    const result = super.tryCreate(name, config);
    if(result.isFailure) {
      return result;
    }
    try {
      const value = result.instance.value;
      Fullname.validateFullName(value, config?.minLength ?? this.DEFAULT_MIN_LENGTH);
      return Result.ok(new this(value, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  private static validateFullName(value: string, min: number): void {
    const words = value.split(/\s+/).filter((w) => w.length > 0);
    if(words.length < 2) {
      throw new Error(this.FULL_NAME_REQUIRED);
    }

    const first = words[0];
    const last = words[words.length - 1];
    if ((first && first.length < min) || (last && last.length < min)) {
      throw new Error(this.FULL_NAME_TOO_SHORT.replaceAll('value', min.toString()));
    }
  }
}
