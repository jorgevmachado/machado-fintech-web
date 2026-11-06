import type { Result as TResult, TPaginatedListResponse } from '@fintech/shared';

import {
  CreditCard ,
  TCreditCardApiData ,
  TCreditCardPersistApiData,
} from '../domain';

import { mapListResult, mapResult, parseDate } from '../../../shared/result.mapper';

function parseCreditCardLimit(value: TCreditCardApiData['limit']): number | undefined {
  if (value == null) {
    return undefined;
  }

  const limit = Number(value);
  if (!Number.isFinite(limit) || (typeof value === 'string' && !value.trim())) {
    throw new Error(`Invalid creditCard limit: ${value}`);
  }

  return limit;
}

export function creditCardApiDataToDomain(data: TCreditCardApiData): CreditCard {
  return CreditCard.create({
    id: data.id,
    icon: data.icon,
    name: data.name,
    brand: data.brand,
    limit: parseCreditCardLimit(data.limit),
    color: data.color,
    due_day: data.due_day,
    is_active: data.is_active,
    closing_day: data.closing_day,
    description: data.description,
    last_four_digits: data.last_four_digits,
    created_at: parseDate(data.created_at, 'created_at', 'creditCard'),
    updated_at: data.updated_at == null
      ? undefined
      : parseDate(data.updated_at, 'updated_at', 'creditCard'),
  });
}

export function creditCardJsonToDomain(data: TCreditCardApiData): CreditCard {
  return creditCardApiDataToDomain(data);
}

export function creditCardDomainToJson(data: CreditCard): TCreditCardApiData {
  return {
    id: data.id,
    icon: data.icon,
    name: data.name,
    brand: data.brand,
    limit: data.limit,
    color: data.color,
    due_day: data.due_day,
    is_active: data.is_active,
    closing_day: data.closing_day,
    description: data.description,
    last_four_digits: data.last_four_digits,
    created_at: data.created_at.toISOString(),
    ...(data.updated_at
      ? { updated_at: data.updated_at.toISOString() }
      : {}),
  };
}

export function creditCardApiDataToJson(data: TCreditCardApiData): TCreditCardApiData {
  return creditCardDomainToJson(creditCardApiDataToDomain(data));
}

export function creditCardApiPersistToJson(data: TCreditCardApiData): TCreditCardPersistApiData {
  return {
    icon: data.icon,
    name: data.name,
    brand: data.brand,
    limit: parseCreditCardLimit(data.limit),
    color: data.color,
    due_day: data.due_day,
    is_active: data.is_active,
    closing_day: data.closing_day,
    description: data.description,
    last_four_digits: data.last_four_digits,
  }
}

export function mapCreditCardJsonResult(
  result: TResult<TCreditCardApiData>,
): TResult<CreditCard> {
  return mapResult(result, creditCardJsonToDomain);
}

export function mapCreditCardJsonListResult(
  result: TResult<TPaginatedListResponse<TCreditCardApiData> | Array<TCreditCardApiData>>,
): TResult<TPaginatedListResponse<CreditCard> | Array<CreditCard>> {
  return mapListResult(result, creditCardJsonToDomain);
}
