import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import { TPayer ,TPayerApiData, Payer } from '../domain';
import {
  mapListResult ,
  mapResult ,
  parseDate,
} from '@/src/shared/result.mapper';

export function payerApiDataToDomain(data: TPayerApiData): TPayer {
  return Payer.create({
    id: data.id,
    name: data.name,
    created_at: parseDate(data.created_at, 'created_at', 'payer'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'payer'),
  })
}

export function payerJsonToDomain(data: TPayerApiData): TPayer {
  return payerApiDataToDomain(data);
}

export function payerDomainToJson(data: TPayer): TPayerApiData {
  return {
    id: data.id,
    name: data.name,
    created_at: data.created_at.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
  }
}

export function payerApiDataToJson(data: TPayerApiData): TPayerApiData {
  return payerDomainToJson(payerApiDataToDomain(data));
}

export function mapPayerJsonResult(result: TResult<TPayerApiData>): TResult<Payer> {
  return mapResult(result, payerJsonToDomain);
}

export function mapPayerJsonListResult(
  result: TResult<TPaginatedListResponse<TPayerApiData>| Array<TPayerApiData>>,
): TResult<TPaginatedListResponse<Payer> | Array<Payer>> {
  return mapListResult(result, payerJsonToDomain);
}