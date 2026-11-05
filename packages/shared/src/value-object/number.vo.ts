import { Result, ValueObject, type ValueObjectConfig } from '../base';

export type NumberConfig = ValueObjectConfig;

export class NumberVO extends ValueObject<number, NumberConfig> {
  private static readonly INVALID_NUMBER = 'number.invalid';

  private constructor(value: number, config?: NumberConfig) {
    super(value, config);
  }

  public static tryCreate(value: unknown, config?: NumberConfig): Result<NumberVO> {
    if (typeof value !== 'number' && typeof value !== 'string') {
      return Result.fail(NumberVO.INVALID_NUMBER);
    }

    if (typeof value === 'string' && value.trim() === '') {
      return Result.fail(NumberVO.INVALID_NUMBER);
    }

    const parsed = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(parsed)) {
      return Result.fail(NumberVO.INVALID_NUMBER);
    }

    return Result.ok(new NumberVO(parsed, config));
  }

  public static create(value: unknown, config?: NumberConfig): NumberVO {
    const result = NumberVO.tryCreate(value, config);
    result.validator.throwsIfFailed();
    return result.instance;
  }
}
