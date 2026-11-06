import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import { TAccount ,TAccountApiData, Account } from '../domain';
import {
  mapListResult ,
  mapResult ,
  parseDate,
} from '@/src/shared/result.mapper';

export function accountApiDataToDomain(data: TAccountApiData): TAccount {
  return Account.create({
    id: data.id,
    icon: data.icon,
    type: data.type,
    name: data.name,
    color: data.color,
    agency: data.agency,
    is_active: data.is_active,
    description: data.description,
    account_number: data.account_number,
    financial_institution: data.financial_institution,
    created_at: parseDate(data.created_at, 'created_at', 'account'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'account'),
  })
}

export function accountJsonToDomain(data: TAccountApiData): TAccount {
  return accountApiDataToDomain(data);
}

export function accountDomainToJson(data: TAccount): TAccountApiData {
  return {
    id: data.id,
    icon: data.icon,
    type: data.type,
    name: data.name,
    color: data.color,
    agency: data.agency,
    is_active: data.is_active,
    description: data.description,
    account_number: data.account_number,
    financial_institution: data.financial_institution,
    created_at: data.created_at.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
  }
}

export function accountApiDataToJson(data: TAccountApiData): TAccountApiData {
  return accountDomainToJson(accountApiDataToDomain(data));
}

export function mapAccountJsonResult(result: TResult<TAccountApiData>): TResult<Account> {
  return mapResult(result, accountJsonToDomain);
}

export function mapAccountJsonListResult(
  result: TResult<TPaginatedListResponse<TAccountApiData>| Array<TAccountApiData>>,
): TResult<TPaginatedListResponse<Account> | Array<Account>> {
  return mapListResult(result, accountJsonToDomain);
}