import { Result } from '@fintech/shared';

import { getApiErrorStatusCode } from '../api-response';

describe('getApiErrorStatusCode', () => {
  it('returns success for successful API results', () => {
    expect(getApiErrorStatusCode(Result.ok({}))).toBe(200);
  });

  it('preserves an upstream unauthorized status', () => {
    const result = Result.fail([{
      error: 'Unauthorized',
      message: 'Token expired',
      statusCode: 401,
    } as unknown as string]);

    expect(getApiErrorStatusCode(result)).toBe(401);
  });

  it('uses validation status for failures without an HTTP status', () => {
    expect(getApiErrorStatusCode(Result.fail('Invalid data'))).toBe(422);
  });
});
