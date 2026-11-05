import {
  Result ,
  ValueObject,
  type ValueObjectConfig,
} from '../base';

export class Email extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_EMAIL = 'form.validation.email.invalid';
  constructor(value: string, config?: ValueObjectConfig) {
    const email = value?.trim().toLowerCase();
    if (!Email.isValid(email)) {
      throw new Error(Email.INVALID_EMAIL);
    }

    super(email, config);
  }

  get username(): string {
    return this.value.split('@')?.[0] ?? '';
  }

  get domain(): string {
    return this.value.split('@')?.[1] ?? '';
  }

  public static create(value: string, config?: ValueObjectConfig): Email {
    const result = Email.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string, config?: ValueObjectConfig): Result<Email> {
    try {
      const email = value.trim().toLowerCase();
      if (!Email.isValid(email)) {
        throw new Error(Email.INVALID_EMAIL);
      }
      return Result.ok(new Email(email, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  public static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }
}