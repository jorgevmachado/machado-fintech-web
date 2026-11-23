import { receiptRulesMapper } from '../mappers/receipt-rules.mapper';
import type { TReceiptRulesApiData } from '../domain';

const apiData: TReceiptRulesApiData = {
  id: 'profile-1',
  name: 'Itaú',
  institution_id: 'e2f1c4e0-0000-4000-8000-000000000001',
  institution_code: 'ITAU_UNIBANCO',
  scope: 'private',
  is_active: true,
  identification_rules: [
    {
      id: 'rule-1',
      pattern: 'Ita[úu]',
      weight: 100,
      is_active: true,
    },
  ],
  field_rules: [
    {
      id: 'field-1',
      field_name: 'paid_amount',
      configuration: {
        strategy: 'regex',
        parser: 'decimal_br',
        patterns: ['Valor: (?P<value>.+)'],
        normalization: 'strip',
        fallback_field: null,
      },
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: null,
    },
  ],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: null,
};

describe('receipt rules mapper', () => {
  it('maps api data to the domain entity with real dates', () => {
    const entity = receiptRulesMapper.toDomain(apiData);

    expect(entity.id).toBe('profile-1');
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(entity.updated_at).toBeUndefined();
    expect(entity.isReadOnly).toBe(false);
  });

  it('keeps the field rule configuration untouched so a round trip is lossless', () => {
    const entity = receiptRulesMapper.toDomain(apiData);

    expect(entity.field_rules[0]?.configuration).toEqual(
      apiData.field_rules[0]?.configuration,
    );
    expect(receiptRulesMapper.toJson(entity).field_rules).toEqual(apiData.field_rules);
  });

  it('marks system profiles as read only', () => {
    const entity = receiptRulesMapper.toDomain({ ...apiData, scope: 'system' });

    expect(entity.isReadOnly).toBe(true);
  });

  it('fails the result when created_at is not a valid date', () => {
    const result = receiptRulesMapper.mapJsonResult({
      isFailure: false,
      isOk: true,
      instance: { ...apiData, created_at: 'not-a-date' },
      errors: [],
    } as never);

    expect(result.isFailure).toBe(true);
  });
});