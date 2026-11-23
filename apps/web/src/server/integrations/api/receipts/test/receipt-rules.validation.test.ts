/** @jest-environment node */
import {
  parseReceiptRulesCreateBody,
  parseReceiptRulesFilterQuery,
  parseReceiptRulesUpdateBody,
} from '../receipt-rules.validation';
import { RequestValidationError } from '@/src/server/validation/request-validation';

const rule = { pattern: 'Ita[úu]', weight: 100, is_active: true };

const createBody = {
  name: 'Itaú',
  institution_id: 'e2f1c4e0-0000-4000-8000-000000000001',
  is_active: true,
  identification_rules: [rule],
};

describe('receipt rules create validation', () => {
  it('accepts a create body with an institution id and one identification rule', async () => {
    await expect(
      parseReceiptRulesCreateBody({ json: async () => createBody }),
    ).resolves.toEqual(createBody);
  });

  it('rejects a create body without institution_id', async () => {
    const withoutInstitution = {
      name: createBody.name,
      is_active: createBody.is_active,
      identification_rules: createBody.identification_rules,
    };

    await expect(
      parseReceiptRulesCreateBody({ json: async () => withoutInstitution }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects an identification rule whose id is present on create', async () => {
    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({
          ...createBody,
          identification_rules: [{ ...rule, id: 'rule-1' }],
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects an identification rule whose weight is not a positive integer', async () => {
    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({
          ...createBody,
          identification_rules: [{ ...rule, weight: 1.5 }],
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('accepts field_rules on create so a profile can be born with extraction rules', async () => {
    const fieldRule = {
      field_name: 'payer',
      configuration: {
        strategy: 'regex',
        patterns: ['Pagador: (?P<value>.+)'],
        parser: 'text',
        normalization: 'strip',
        fallback_field: null,
      },
      is_active: true,
    };

    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({ ...createBody, field_rules: [fieldRule] }),
      }),
    ).resolves.toEqual({ ...createBody, field_rules: [fieldRule] });
  });

  it('rejects a field rule whose id is present on create', async () => {
    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({
          ...createBody,
          field_rules: [
            {
              id: 'field-1',
              field_name: 'payer',
              configuration: { strategy: 'not_found' },
              is_active: true,
            },
          ],
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects two field rules for the same receipt field', async () => {
    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({
          ...createBody,
          field_rules: [
            { field_name: 'payer', configuration: { strategy: 'not_found' }, is_active: true },
            { field_name: 'payer', configuration: { strategy: 'not_found' }, is_active: true },
          ],
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects a field rule with an unknown field_name', async () => {
    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({
          ...createBody,
          field_rules: [
            {
              field_name: 'not_a_field',
              configuration: { strategy: 'not_found' },
              is_active: true,
            },
          ],
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects a regex configuration without patterns', async () => {
    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({
          ...createBody,
          field_rules: [
            {
              field_name: 'payer',
              configuration: {
                strategy: 'regex',
                patterns: [],
                parser: 'text',
                normalization: 'strip',
                fallback_field: null,
              },
              is_active: true,
            },
          ],
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects a source configuration without identified_value', async () => {
    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({
          ...createBody,
          field_rules: [
            {
              field_name: 'source_institution',
              configuration: {
                strategy: 'source',
                matches: [],
                mappings: [],
                extraction: null,
              },
              is_active: true,
            },
          ],
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects an unknown strategy', async () => {
    await expect(
      parseReceiptRulesCreateBody({
        json: async () => ({
          ...createBody,
          field_rules: [
            {
              field_name: 'payer',
              configuration: { strategy: 'magic' },
              is_active: true,
            },
          ],
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });
});

describe('receipt rules update validation', () => {
  it('accepts a reconciled identification_rules list with ids on existing rules', async () => {
    await expect(
      parseReceiptRulesUpdateBody({
        json: async () => ({
          name: 'Itaú',
          is_active: false,
          identification_rules: [{ ...rule, id: 'rule-1' }],
        }),
      }),
    ).resolves.toEqual({
      name: 'Itaú',
      is_active: false,
      identification_rules: [{ ...rule, id: 'rule-1' }],
    });
  });

  it('rejects an update body carrying institution_id', async () => {
    await expect(
      parseReceiptRulesUpdateBody({
        json: async () => ({
          name: 'Itaú',
          is_active: true,
          identification_rules: [],
          institution_id: createBody.institution_id,
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('rejects an update body whose identification_rules is null', async () => {
    await expect(
      parseReceiptRulesUpdateBody({
        json: async () => ({
          name: 'Itaú',
          is_active: true,
          identification_rules: null,
        }),
      }),
    ).rejects.toBeInstanceOf(RequestValidationError);
  });

  it('omits field_rules when the body does not carry it, preserving the stored rules', async () => {
    const parsed = await parseReceiptRulesUpdateBody({
      json: async () => ({
        name: 'Itaú',
        is_active: true,
        identification_rules: [],
      }),
    });

    expect(parsed).not.toHaveProperty('field_rules');
  });

  it('accepts a reconciled field_rules list carrying ids on existing rules', async () => {
    const fieldRule = {
      id: 'field-1',
      field_name: 'payer',
      configuration: { strategy: 'not_found' },
      is_active: false,
    };

    await expect(
      parseReceiptRulesUpdateBody({
        json: async () => ({
          name: 'Itaú',
          is_active: true,
          identification_rules: [],
          field_rules: [fieldRule],
        }),
      }),
    ).resolves.toEqual({
      name: 'Itaú',
      is_active: true,
      identification_rules: [],
      field_rules: [fieldRule],
    });
  });
});

describe('receipt rules filter query', () => {
  it('accepts the fields the API filters by', () => {
    expect(
      parseReceiptRulesFilterQuery(
        new URLSearchParams('page=1&limit=12&scope=private&is_active=true'),
      ),
    ).toEqual({ page: '1', limit: '12', scope: 'private', is_active: 'true' });
  });

  it('rejects unsupported query parameters', () => {
    expect(() =>
      parseReceiptRulesFilterQuery(new URLSearchParams('unknown=1')),
    ).toThrow(RequestValidationError);
  });

  it('rejects a scope that is neither system nor private', () => {
    expect(() =>
      parseReceiptRulesFilterQuery(new URLSearchParams('scope=public')),
    ).toThrow(RequestValidationError);
  });
});