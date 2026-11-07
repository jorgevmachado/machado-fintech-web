import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import { TTransaction ,TTransactionApiData, Transaction } from '../domain';
import {
  mapListResult ,
  mapResult ,
  parseDate,
} from '@/src/shared/result.mapper';
import {
  accountApiDataToDomain ,accountDomainToJson,
} from '@/src/features/account/mappers/account.mapper';
import {
  subcategoryApiDataToDomain ,
  subcategoryDomainToJson,
} from '@/src/features/category';
import {
  creditCardApiDataToDomain ,creditCardDomainToJson,
} from '@/src/features/credit-card/mappers/credit-card.mapper';

export function transactionApiDataToDomain(data: TTransactionApiData): TTransaction {
  return Transaction.create({
    id: data.id,
    name: data.name,
    note: data.note,
    value: data.value,
    status: data.status,
    account: accountApiDataToDomain(data.account),
    subcategory: data.subcategory ? subcategoryApiDataToDomain(data.subcategory) : undefined,
    credit_card: data.credit_card ? creditCardApiDataToDomain(data.credit_card) : undefined,
    direction: data.direction,
    created_at: parseDate(data.created_at, 'created_at', 'transaction'),
    expected_on: parseDate(data.expected_on, 'expected_on', 'transaction'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'transaction'),
    settled_on: data.settled_on == null
      ? undefined
      : parseDate(data.settled_on, 'settled_on', 'transaction'),
  })
}

export function transactionJsonToDomain(data: TTransactionApiData): TTransaction {
  return transactionApiDataToDomain(data);
}

export function transactionDomainToJson(data: TTransaction): TTransactionApiData {
  return {
    id: data.id,
    name: data.name,
    note: data.note,
    value: data.value,
    status: data.status,
    account: accountDomainToJson(data.account),
    subcategory: data.subcategory ? subcategoryDomainToJson(data.subcategory) : undefined,
    credit_card: data.credit_card ? creditCardDomainToJson(data.credit_card) : undefined,
    direction: data.direction,
    created_at: data.created_at.toISOString(),
    expected_on: data.expected_on.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
    ...(data.settled_on
      ? { settled_on: data.settled_on.toISOString() }
      : {}),
  }
}

export function transactionApiDataToJson(data: TTransactionApiData): TTransactionApiData {
  return transactionDomainToJson(transactionApiDataToDomain(data));
}

export function mapTransactionJsonResult(result: TResult<TTransactionApiData>): TResult<Transaction> {
  return mapResult(result, transactionJsonToDomain);
}

export function mapTransactionJsonListResult(
  result: TResult<TPaginatedListResponse<TTransactionApiData>| Array<TTransactionApiData>>,
): TResult<TPaginatedListResponse<Transaction> | Array<Transaction>> {
  return mapListResult(result, transactionJsonToDomain);
}