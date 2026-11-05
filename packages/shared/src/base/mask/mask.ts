export type MaskValue = string | number;

export type MaskPattern =
  | string
  | ((rawValue: string) => string);

export interface MaskConfig {
  token?: string;
  transform?: (value: string) => string;
  characterPattern?: RegExp;
  showRemainingLiterals?: boolean;
}

interface MaskAccumulator {
  valueIndex: number;
  formattedValue: string;
}

export class Mask {
  private static readonly DEFAULT_TOKEN = '#';
  private static readonly DEFAULT_CHARACTER_PATTERN = /[a-zA-Z0-9]/;
  private static readonly DEFAULT_SHOW_REMAINING_LITERALS = false;

  constructor(
    readonly pattern: MaskPattern,
    readonly config?: MaskConfig,
  ) {}

  static create(
    pattern: MaskPattern,
    config?: MaskConfig,
  ): Mask {
    return new Mask(pattern, config);
  }

  format(value: MaskValue): string {
    const rawValue = String(value);

    return typeof this.pattern === 'function'
      ? this.pattern(rawValue)
      : this.applyPattern(rawValue, this.pattern);
  }

  private applyPattern(rawValue: string, pattern: string): string {
    const token =
      this.config?.token ??
      Mask.DEFAULT_TOKEN;

    const characterPattern =
      this.config?.characterPattern ??
      Mask.DEFAULT_CHARACTER_PATTERN;

    const showRemainingLiterals =
      this.config?.showRemainingLiterals ??
      Mask.DEFAULT_SHOW_REMAINING_LITERALS;

    const characters = [...rawValue].filter(
      (character) =>
        new RegExp(
          characterPattern.source,
          characterPattern.flags.replace('g', ''),
        ).test(character),
    );

    if (!characters.length) {
      return '';
    }

    const result = [...pattern].reduce<MaskAccumulator>(
      (accumulator, character) => {
        if (character === token) {
          return accumulator.valueIndex >= characters.length
            ? accumulator
            : {
              formattedValue:
                `${accumulator.formattedValue}${characters[accumulator.valueIndex]}`,
              valueIndex: accumulator.valueIndex + 1,
            };
        }

        if (
          !showRemainingLiterals &&
          accumulator.valueIndex >= characters.length
        ) {
          return accumulator;
        }

        return {
          formattedValue:
            `${accumulator.formattedValue}${character}`,
          valueIndex: accumulator.valueIndex,
        };
      },
      {
        formattedValue: '',
        valueIndex: 0,
      },
    );

    return this.config?.transform
      ? this.config.transform(result.formattedValue)
      : result.formattedValue;
  }
}