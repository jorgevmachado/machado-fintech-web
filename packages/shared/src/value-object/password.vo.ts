import {
  Result ,
  ValueObject,
  type ValueObjectConfig,
} from '../base';


export interface PasswordConfig extends ValueObjectConfig {
  type?: 'strong' | 'weak';
  minLength?: number;
}

export class Password extends ValueObject<string, PasswordConfig> {
  protected static readonly TYPE: PasswordConfig['type'] = 'weak';
  protected static readonly DEFAULT_MIN_LENGTH: number = 8;
  protected static readonly TOO_SHORT: string = `'form.validation.password.invalid.min_length', { min: value }`;
  protected static readonly PASSWORD_MUST_CONTAIN_LETTER: string = 'form.validation.password.invalid.least_one_letter';
  protected static readonly PASSWORD_MUST_CONTAIN_NUMBER: string = 'form.validation.password.invalid.least_one_number';
  protected static readonly PASSWORD_MUST_CONTAIN_SPECIAL_CHARACTER: string = 'form.validation.password.invalid.least_one_special_character';
  protected static readonly PASSWORD_MUST_CONTAIN_UPPER_CHARACTER: string = 'form.validation.password.invalid.least_one_upper_character';



  protected constructor(value: string, config?: PasswordConfig) {
    super(value, config);
  }

  public static create(value: string, config?: PasswordConfig): Password {
    const result = this.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(password: string, config?: PasswordConfig): Result<Password> {
    try {
      const value = password?.trim() ?? '';
      const min = config?.minLength ?? this.DEFAULT_MIN_LENGTH;
      const type = config?.type ?? this.TYPE;

      if (value.length < min) {
        throw new Error(this.TOO_SHORT.replaceAll('value', min.toString()));
      }

      if(type === 'strong') {
        this.validateStrongPassword(value);
      }

      return Result.ok(new this(value, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  private static validateStrongPassword(value: string): void {
    const leastOneLetter = /[a-zA-Z]/;
    if(!leastOneLetter.test(value)) {
      throw new Error(this.PASSWORD_MUST_CONTAIN_LETTER);
    }

    const leastOneNumber = /[0-9]/;
    if(!leastOneNumber.test(value)) {
      throw new Error(this.PASSWORD_MUST_CONTAIN_NUMBER);
    }

    const leastOneSpecialCharacter= /[^a-zA-Z0-9]/;
    if(!leastOneSpecialCharacter.test(value)) {
      throw new Error(this.PASSWORD_MUST_CONTAIN_SPECIAL_CHARACTER);
    }

    const leastOneUpperCharacter = /[A-Z]/;
    if(!leastOneUpperCharacter.test(value)) {
      throw new Error(this.PASSWORD_MUST_CONTAIN_UPPER_CHARACTER);
    }
}
}
