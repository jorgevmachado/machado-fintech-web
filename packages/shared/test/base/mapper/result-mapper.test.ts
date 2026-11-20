import { mapList, mapListResult, mapResult, Result, type TPaginatedListResponse } from '../../../src';

const meta = {
  total: 2,
  limit: 10,
  offset: 0,
  total_pages: 1,
  current_page: 1,
};

describe('mapResult', () => {
  test('maps a successful result', () => {
    const result = mapResult(Result.ok(2), (value) => value * 2);

    expect(result.isOk).toBeTruthy();
    expect(result.instance).toBe(4);
  });

  test('preserves a failed result', () => {
    const failed = Result.fail<number>('request failed');
    const result = mapResult(failed, (value) => value * 2);

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toEqual(failed.errors);
  });

  test('converts a mapper exception into a failed result', () => {
    const result = mapResult(Result.ok(2), () => {
      throw new Error('mapping failed');
    });

    expect(result.isFailure).toBeTruthy();
    expect(result.error).toBe('mapping failed');
  });
});

describe('mapList', () => {
  test('maps a plain array', () => {
    expect(mapList([1, 2], (value) => value * 2)).toEqual([2, 4]);
  });

  test('maps a paginated response and preserves the metadata', () => {
    const paginated: TPaginatedListResponse<number> = { items: [1, 2], meta };

    expect(mapList(paginated, (value) => value * 2)).toEqual({ items: [2, 4], meta });
  });

  test('maps an empty array to an empty array', () => {
    expect(mapList([], (value: number) => value * 2)).toEqual([]);
  });
});

describe('mapListResult', () => {
  test('maps a successful list result', () => {
    const result = mapListResult(Result.ok([1, 2]), (value) => value * 2);

    expect(result.isOk).toBeTruthy();
    expect(result.instance).toEqual([2, 4]);
  });

  test('preserves a failed list result', () => {
    const failed = Result.fail<Array<number>>('request failed');
    const result = mapListResult(failed, (value) => value * 2);

    expect(result.isFailure).toBeTruthy();
    expect(result.errors).toEqual(failed.errors);
  });
});