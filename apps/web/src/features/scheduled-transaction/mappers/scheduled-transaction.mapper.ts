import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import { TScheduledTransaction ,TScheduledTransactionApiData, ScheduledTransaction } from '../domain';
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
import {
  transactionSeriesApiDataToDomain ,transactionSeriesDomainToJson,
} from '@/src/features/transaction-series/mappers/transaction-series.mapper';

export function scheduledTransactionApiDataToDomain(data: TScheduledTransactionApiData): TScheduledTransaction {
  return ScheduledTransaction.create({
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
    occurrence_on: parseDate(data.occurrence_on, 'occurrence_on', 'transaction'),
    occurrence_index: data.occurrence_index,
    transaction_serie: transactionSeriesApiDataToDomain(data.transaction_serie),
  })
}

export function scheduledTransactionJsonToDomain(data: TScheduledTransactionApiData): TScheduledTransaction {
  return scheduledTransactionApiDataToDomain(data);
}

export function scheduledTransactionDomainToJson(data: TScheduledTransaction): TScheduledTransactionApiData {
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
    occurrence_on: data.occurrence_on.toISOString(),
    occurrence_index: data.occurrence_index,
    transaction_serie: transactionSeriesDomainToJson(data.transaction_serie),
  }
}

export function scheduledTransactionApiDataToJson(data: TScheduledTransactionApiData): TScheduledTransactionApiData {
  return scheduledTransactionDomainToJson(scheduledTransactionApiDataToDomain(data));
}

export function mapScheduledTransactionJsonResult(result: TResult<TScheduledTransactionApiData>): TResult<ScheduledTransaction> {
  return mapResult(result, scheduledTransactionJsonToDomain);
}

export function mapScheduledTransactionJsonListResult(
  result: TResult<TPaginatedListResponse<TScheduledTransactionApiData>| Array<TScheduledTransactionApiData>>,
): TResult<TPaginatedListResponse<ScheduledTransaction> | Array<ScheduledTransaction>> {
  return mapListResult(result, scheduledTransactionJsonToDomain);
}