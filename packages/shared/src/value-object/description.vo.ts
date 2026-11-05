import  {
  Result ,
} from '../base';

import { Text, type TextConfig } from './text.vo';

export class Description extends Text {
  protected static readonly TOO_SHORT: string = `'form.validation.description.invalid.min_length', { min: value }`;
  protected static readonly TOO_LONG: string = `'form.validation.description.invalid.max_length', { max: value }`;

  protected static override readonly DEFAULT_MIN_LENGTH = 10;
  protected static override readonly DEFAULT_MAX_LENGTH = 200;

  public static override tryCreate(value: string, config?: TextConfig): Result<Description> {
    return super.tryCreate(value, config) as Result<Description>;
  }

  public static override create(value: string, config?: TextConfig): Description {
    const result = this.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }
}