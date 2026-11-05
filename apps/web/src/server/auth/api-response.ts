import type { Result } from '@fintech/shared';

export function getApiErrorStatusCode(result: Result<unknown>): number {
  if (!result.isFailure) {
    return 200;
  }

  const [error] = result.errors as unknown[];
  if (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number' &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
  ) {
    return error.statusCode;
  }

  return 422;
}
