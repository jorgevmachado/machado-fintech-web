import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import { TBeneficiary ,TBeneficiaryApiData, Beneficiary } from '../domain';
import {
  mapListResult ,
  mapResult ,
  parseDate,
} from '@/src/shared/result.mapper';

export function beneficiaryApiDataToDomain(data: TBeneficiaryApiData): TBeneficiary {
  return Beneficiary.create({
    id: data.id,
    name: data.name,
    created_at: parseDate(data.created_at, 'created_at', 'beneficiary'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'beneficiary'),
  })
}

export function beneficiaryJsonToDomain(data: TBeneficiaryApiData): TBeneficiary {
  return beneficiaryApiDataToDomain(data);
}

export function beneficiaryDomainToJson(data: TBeneficiary): TBeneficiaryApiData {
  return {
    id: data.id,
    name: data.name,
    created_at: data.created_at.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
  }
}

export function beneficiaryApiDataToJson(data: TBeneficiaryApiData): TBeneficiaryApiData {
  return beneficiaryDomainToJson(beneficiaryApiDataToDomain(data));
}

export function mapBeneficiaryJsonResult(result: TResult<TBeneficiaryApiData>): TResult<Beneficiary> {
  return mapResult(result, beneficiaryJsonToDomain);
}

export function mapBeneficiaryJsonListResult(
  result: TResult<TPaginatedListResponse<TBeneficiaryApiData>| Array<TBeneficiaryApiData>>,
): TResult<TPaginatedListResponse<Beneficiary> | Array<Beneficiary>> {
  return mapListResult(result, beneficiaryJsonToDomain);
}