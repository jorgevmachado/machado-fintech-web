import { Result } from '../result';
import type { TCrudList } from '../crud/paginate';

/** Aplica `mapper` item a item, preservando o `meta` quando a lista é paginada. */
export function mapList<TInput, TOutput>(
  items: TCrudList<TInput>,
  mapper: (value: TInput) => TOutput,
): TCrudList<TOutput> {
  if (Array.isArray(items)) {
    return items.map(mapper);
  }

  return {
    ...items,
    items: items.items.map(mapper),
  };
}

/**
 * Aplica `mapper` ao `instance` de um `Result`.
 *
 * Uma falha é propagada sem tocar no valor; uma exceção do `mapper` vira `Result.fail`.
 */
export function mapResult<TInput, TOutput>(
  result: Result<TInput>,
  mapper: (value: TInput) => TOutput,
): Result<TOutput> {
  if (result.isFailure) {
    return Result.fail(result.errors);
  }

  return Result.try(() => mapper(result.instance));
}

/** Aplica `mapper` a uma lista (paginada ou não) dentro de um `Result`. */
export function mapListResult<TInput, TOutput>(
  result: Result<TCrudList<TInput>>,
  mapper: (value: TInput) => TOutput,
): Result<TCrudList<TOutput>> {
  return mapResult(result, (items) => mapList(items, mapper));
}