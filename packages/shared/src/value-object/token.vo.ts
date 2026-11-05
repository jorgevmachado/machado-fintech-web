import {
  Result ,
  ValueObject,
  type ValueObjectConfig,
} from '../base';

export type PayloadToken = {
  exp: number;
  [key: string]: unknown;
}

type GenerateParams = {
  alg?: string;
  typ?: string;
  seconds?: number;
  payload?: Record<string, unknown>;
  signature: string;
}

export class Token extends ValueObject<string, ValueObjectConfig> {
  private static readonly INVALID_TOKEN = 'form.validation.token.invalid';
  private static readonly DEFAULT_EXPIRATION_IN_SECONDS = 60 * 60 * 24; // 1 day
  private _payload: PayloadToken;
  constructor(value: string, config?: ValueObjectConfig) {
    const payload = Token.parsePayload(value);
    super(value, config);

    this._payload = payload;
  }

  get payload(): PayloadToken {
    return this._payload;
  }

  get expiration(): number {
    return this._payload.exp * 1000;
  }

  get isExpired(): boolean {
    return Date.now() >= this.expiration;
  }

  public static create(value: string, config?: ValueObjectConfig): Token {
    const result = Token.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(token: string, config?: ValueObjectConfig): Result<Token> {
    try {
      return Result.ok(new Token(token, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  private static parsePayload(value: string): PayloadToken {
    const tokenParts = value.split('.');

    if (tokenParts.length !== 3) {
      throw new Error(Token.INVALID_TOKEN);
    }

    const payloadAsString = this.decodeBase64Url(tokenParts[1]);

    if (payloadAsString === undefined) {
      throw new Error(Token.INVALID_TOKEN);
    }

    try {
      const payload = JSON.parse(payloadAsString) as unknown;

      if (!this.isValidPayload(payload)) {
        throw new Error(Token.INVALID_TOKEN);
      }

      return payload;
    } catch {
      throw new Error(Token.INVALID_TOKEN);
    }
  }

  public static decodeBase64Url(value?: string): string | undefined {
    if(!value) {
      return undefined;
    }
    try {
      return Buffer.from(value, 'base64url').toString('utf-8');
    } catch {
      return undefined;
    }
  }

  private static encodeBase64Url(value: string): string {
    return Buffer.from(value).toString('base64url');
  }

  private static isValidPayload(payload: unknown): payload is PayloadToken {
    if (typeof payload !== 'object' || payload === null) {
      return false;
    }

    const payloadRecord = payload as Record<string, unknown>;
    const exp = payloadRecord.exp;

    return typeof exp === 'number' && Number.isFinite(exp);
  }

  public static generate({
    alg = 'none',
    typ = 'JWT',
    seconds = this.DEFAULT_EXPIRATION_IN_SECONDS,
    payload: customPayload = {},
    signature,
  }: GenerateParams): string {
    const header = this.encodeBase64Url(JSON.stringify({ alg, typ }));
    const payload = this.encodeBase64Url(
      JSON.stringify({
        ...customPayload,
        exp: Math.floor(Date.now() / 1000) + seconds
      })
    );

    const signatureEncoded = this.encodeBase64Url(signature);

    return `${header}.${payload}.${signatureEncoded}`;
  }
}