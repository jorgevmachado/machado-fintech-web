import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import { TInstitution ,TInstitutionApiData, Institution } from '../domain';
import {
  mapListResult ,
  mapResult ,
  parseDate,
} from '@/src/shared/result.mapper';

export function institutionApiDataToDomain(data: TInstitutionApiData): TInstitution {
  return Institution.create({
    id: data.id,
    name: data.name,
    created_at: parseDate(data.created_at, 'created_at', 'institution'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'institution'),
  })
}

export function institutionJsonToDomain(data: TInstitutionApiData): TInstitution {
  return institutionApiDataToDomain(data);
}

export function institutionDomainToJson(data: TInstitution): TInstitutionApiData {
  return {
    id: data.id,
    name: data.name,
    created_at: data.created_at.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
  }
}

export function institutionApiDataToJson(data: TInstitutionApiData): TInstitutionApiData {
  return institutionDomainToJson(institutionApiDataToDomain(data));
}

export function mapInstitutionJsonResult(result: TResult<TInstitutionApiData>): TResult<Institution> {
  return mapResult(result, institutionJsonToDomain);
}

export function mapInstitutionJsonListResult(
  result: TResult<TPaginatedListResponse<TInstitutionApiData>| Array<TInstitutionApiData>>,
): TResult<TPaginatedListResponse<Institution> | Array<Institution>> {
  return mapListResult(result, institutionJsonToDomain);
}