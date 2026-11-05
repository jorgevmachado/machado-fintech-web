import {
  DateVO,
  Result,
  type Result as TResult,
  type TPaginatedListResponse,
} from '@fintech/shared';

export type TListResult<T> = Array<T> | TPaginatedListResponse<T>;

export function parseDate(
  value: string,
  field: string,
  resource: string,
  parser: (value: string) => Date | undefined = DateVO.format.dateTimeStringToDate,
): Date {
  const date = parser(value);
  if (!date) {
    throw new Error(`Invalid ${resource} ${field}: ${value}`);
  }

  return date;
}

export function mapList<TInput, TOutput>(
  items: TListResult<TInput>,
  mapper: (value: TInput) => TOutput,
): TListResult<TOutput> {
  if (Array.isArray(items)) {
    return items.map(mapper);
  }

  return {
    ...items,
    items: items.items.map(mapper),
  };
}

export function mapResult<TInput, TOutput>(
  result: TResult<TInput>,
  mapper: (value: TInput) => TOutput,
): TResult<TOutput> {
  if (result.isFailure) {
    return Result.fail(result.errors);
  }

  return Result.try(() => mapper(result.instance));
}

export function mapListResult<TInput, TOutput>(
  result: TResult<TListResult<TInput>>,
  mapper: (value: TInput) => TOutput,
): TResult<TListResult<TOutput>> {
  return mapResult(result, (items) => mapList(items, mapper));
}
