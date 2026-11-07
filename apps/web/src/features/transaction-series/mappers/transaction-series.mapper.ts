import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import { TTransactionSeries ,TTransactionSeriesApiData, TransactionSeries } from '../domain';
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

export function transactionSeriesApiDataToDomain(data: TTransactionSeriesApiData): TTransactionSeries {
  return TransactionSeries.create({
    id: data.id,
    kind: data.kind,
    name: data.name,
    note: data.note,
    month: data.month,
    value: data.value,
    account: accountApiDataToDomain(data.account),
    subcategory: data.subcategory ? subcategoryApiDataToDomain(data.subcategory) : undefined,
    credit_card: data.credit_card ? creditCardApiDataToDomain(data.credit_card) : undefined,
    direction: data.direction,
    installments: data.installments,
    day_of_month: data.day_of_month,
    created_at: parseDate(data.created_at, 'created_at', 'transaction'),
    start_date: parseDate(data.start_date, 'start_date', 'transaction'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'transaction'),
    end_date: data.end_date == null
      ? undefined
      : parseDate(data.end_date, 'end_date', 'transaction'),
    frequency_interval: data.frequency_interval,
    frequency_unit: data.frequency_unit,
    week_day: data.week_day,
  })
}

export function transactionSeriesJsonToDomain(data: TTransactionSeriesApiData): TTransactionSeries {
  return transactionSeriesApiDataToDomain(data);
}

export function transactionSeriesDomainToJson(data: TTransactionSeries): TTransactionSeriesApiData {
  return {
    id: data.id,
    kind: data.kind,
    name: data.name,
    note: data.note,
    month: data.month,
    value: data.value,
    account: accountDomainToJson(data.account),
    subcategory: data.subcategory ? subcategoryDomainToJson(data.subcategory) : undefined,
    credit_card: data.credit_card ? creditCardDomainToJson(data.credit_card) : undefined,
    direction: data.direction,
    installments: data.installments,
    day_of_month: data.day_of_month,
    created_at: data.created_at.toISOString(),
    start_date: data.start_date.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
    ...(data.end_date
      ? { end_date: data.end_date.toISOString() }
      : {}),
    frequency_interval: data.frequency_interval,
    frequency_unit: data.frequency_unit,
    week_day: data.week_day,
  }
}

export function transactionSeriesApiDataToJson(data: TTransactionSeriesApiData): TTransactionSeriesApiData {
  return transactionSeriesDomainToJson(transactionSeriesApiDataToDomain(data));
}

export function mapTransactionSeriesJsonResult(result: TResult<TTransactionSeriesApiData>): TResult<TransactionSeries> {
  return mapResult(result, transactionSeriesJsonToDomain);
}

export function mapTransactionSeriesJsonListResult(
  result: TResult<TPaginatedListResponse<TTransactionSeriesApiData>| Array<TTransactionSeriesApiData>>,
): TResult<TPaginatedListResponse<TransactionSeries> | Array<TransactionSeries>> {
  return mapListResult(result, transactionSeriesJsonToDomain);
}