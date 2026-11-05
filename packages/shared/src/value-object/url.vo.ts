import {
  HttpUrl ,
  HttpUrlConfig ,
  Result ,
  ValidationError ,
} from '../base';

export class Url extends HttpUrl {
  private static readonly INVALID_URL = 'INVALID_URL';
  constructor(value?: string, config?: HttpUrlConfig) {
    const normalized = value?.trim();
    if(!normalized || !Url.isValid(normalized)) {
      throw new ValidationError({ code: 'url.invalid' });
    }
    super(value, config);
  }

  public static create(value?: string, config?: HttpUrlConfig): Url {
    const result = Url.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value?: string, config?: HttpUrlConfig): Result<Url> {
    try {
      const url = value?.trim();
      if (!url || !Url.isValid(url)) {
        throw new Error(Url.INVALID_URL);
      }
      return Result.ok(new Url(value, config));
    } catch {
      return Result.fail(Url.INVALID_URL);
    }
  }
}