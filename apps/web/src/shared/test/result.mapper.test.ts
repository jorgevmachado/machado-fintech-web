import { Result } from '@fintech/shared';

import { mapList, mapListResult, mapResult, parseDate } from '../result.mapper';

describe('result mapper', () => {
  it('parses dates and reports the resource and field for invalid values', () => {
    expect(parseDate('2026-10-08T12:00:00.000Z', 'created_at', 'payer'))
      .toEqual(new Date('2026-10-08T12:00:00.000Z'));
    expect(() => parseDate('invalid', 'created_at', 'payer'))
      .toThrow('Invalid payer created_at: invalid');
  });

  it('maps successful results', () => {
    const result = mapResult(Result.ok(2), (value) => value * 2);

    expect(result.isOk).toBe(true);
    expect(result.instance).toBe(4);
  });

  it('preserves failed results', () => {
    const failed = Result.fail<number>('request failed');
    const result = mapResult(failed, (value: number) => value * 2);

    expect(result.isFailure).toBe(true);
    expect(result.errors).toEqual(failed.errors);
  });

  it('converts mapper exceptions to failed results', () => {
    const result = mapResult(Result.ok(2), () => {
      throw new Error('mapping failed');
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('mapping failed');
  });

  it('maps arrays and preserves paginated metadata', () => {
    expect(mapList([1, 2], (value) => value * 2)).toEqual([2, 4]);
    expect(mapList({
      items: [1, 2],
      meta: {
        total: 2,
        limit: 10,
        offset: 0,
        total_pages: 1,
        current_page: 1,
      },
    }, (value) => value * 2)).toEqual({
      items: [2, 4],
      meta: {
        total: 2,
        limit: 10,
        offset: 0,
        total_pages: 1,
        current_page: 1,
      },
    });
  });

  it('maps successful and failed list results', () => {
    const result = mapListResult(Result.ok([1, 2]), (value) => value * 2);
    const failed = Result.fail<Array<number>>('request failed');
    const failedResult = mapListResult(failed, (value: number) => value * 2);

    expect(result.isOk).toBe(true);
    expect(result.instance).toEqual([2, 4]);
    expect(failedResult.isFailure).toBe(true);
    expect(failedResult.errors).toEqual(failed.errors);
  });
});
