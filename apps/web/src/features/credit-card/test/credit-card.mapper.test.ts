import { Result } from '@fintech/shared';

import type { TCreditCardApiData } from '../domain';
import {
  creditCardApiDataToDomain,
  creditCardApiPersistToJson,
  mapCreditCardJsonResult,
} from '../mappers/credit-card.mapper';

const card: TCreditCardApiData = {
  id: 'card-1',
  name: 'Card',
  brand: 'VISA',
  due_day: 15,
  closing_day: 5,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
};

describe('credit card limit mapping', () => {
  it.each([null, undefined])('treats a missing API limit (%s) as absent', (limit) => {
    expect(creditCardApiDataToDomain({ ...card, limit }).limit).toBeUndefined();
  });

  it('converts an API decimal string to a number in persistence data', () => {
    expect(creditCardApiPersistToJson({ ...card, limit: '20.10' }).limit).toBe(20.1);
  });

  it.each(['invalid', '', ' ', 'Infinity', Number.NaN])('surfaces invalid API limit %s as a failed result', (limit) => {
    const result = mapCreditCardJsonResult(Result.ok({ ...card, limit }));

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe(`Invalid creditCard limit: ${limit}`);
  });
});
