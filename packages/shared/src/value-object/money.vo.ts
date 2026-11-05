import { Result ,ValueObject ,ValueObjectConfig } from '../base';

export type MoneyLocale = 'en-US' | 'pt-BR' | 'es-UE';

type ConvertToNumberResult = {
  value: number;
  regex: RegExp;
}

type TNotation = 'standard' | 'scientific' | 'engineering' | 'compact';

export interface MoneyConfig extends ValueObjectConfig {
  locale?: MoneyLocale,
  notation?: TNotation,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number,
}

export class Money extends ValueObject<string | number, MoneyConfig>{
  private static readonly INVALID_MONEY_LOCALE = 'form.validation.money.invalid.locale';
  private static readonly DEFAULT_LOCALE: MoneyLocale = 'en-US';
  private static readonly DEFAULT_MINIMUM_FRACTION_DIGITS = 2;
  private static readonly DEFAULT_MAXIMUM_FRACTION_DIGITS = 2;
  private static readonly CURRENCY_MAP: Record<MoneyLocale, string> = {
    'en-US': 'USD',
    'pt-BR': 'BRL',
    'es-UE': 'EUR',
  };
  private readonly _formatted: string;
  private readonly _value: number;

  constructor(value: string | number, config?: MoneyConfig) {

    super(value, config);

    const { value: rawValue, regex } = Money.convertToNumber(value);
    this._value = rawValue;
    this._formatted = Money.format(rawValue, regex, config);
  }

  get formatted(): string {
    return this._formatted;
  }

  get valueNumber(): number {
    return this._value;
  }

  public static create(value: string | number,config?: MoneyConfig): Money {
    const result = Money.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }

  public static tryCreate(value: string | number,config?: MoneyConfig): Result<Money> {
    try {
      return Result.ok(new Money(value, config));
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  private static convertToNumber(value: string | number): ConvertToNumberResult {
    if(typeof value === 'string') {
      const onlyDigits = value.replace(/\D/g, '');
      return {
        value: !onlyDigits ? 0 : Number.parseInt(onlyDigits, 10) / 100,
        regex: /\u00A0/g,
      }
    }
    return {
      value,
      regex: /\s/,
    };
  }

  private static format(value: number, regex: RegExp, config: MoneyConfig = {}): string {
    const locale = config.locale ?? Money.DEFAULT_LOCALE;
    const minimumFractionDigits = config.minimumFractionDigits ?? Money.DEFAULT_MINIMUM_FRACTION_DIGITS;
    const maximumFractionDigits = config.maximumFractionDigits ?? Money.DEFAULT_MAXIMUM_FRACTION_DIGITS;
    const currency = Money.CURRENCY_MAP[locale];

    if(!currency) {
      throw new Error(Money.INVALID_MONEY_LOCALE);
    }
    return new Intl
    .NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: config.notation,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value)
    .replace(regex, ' ');
  }
}