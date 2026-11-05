import { matchField } from '../../../../../src/components/form/validator/rules';
import type { TFormField } from '../../../../../src/components/form/field';

describe('matchField', () => {
  const createField = (
    overrides: Partial<TFormField> = {},
  ): TFormField => ({
    name: 'password_confirmation',
    type: 'password_confirmation',
    ...overrides,
  });

  it('returns valid when matchField is not configured', () => {
    const field = createField();

    const result = matchField(
      field,
      'password123',
      {
        password: 'password123',
      },
    );

    expect(result).toEqual({
      isInvalid: false,
    });
  });

  it('returns valid when value matches the configured field', () => {
    const field = createField({
      validation: {
        matchField: 'password',
      },
    });

    const result = matchField(
      field,
      'password123',
      {
        password: 'password123',
      },
    );

    expect(result).toEqual({
      isInvalid: false,
    });
  });

  it('returns invalid when value does not match the configured field', () => {
    const field = createField({
      validation: {
        matchField: 'password',
      },
    });

    const result = matchField(
      field,
      'password456',
      {
        password: 'password123',
      },
    );

    expect(result).toEqual({
      isInvalid: true,
      errorMessage: 'form.validation.match_field.invalid',
    });
  });

  it('returns the custom error message when value does not match', () => {
    const field = createField({
      validation: {
        matchField: 'password',
        errorMessage: 'As senhas não são iguais.',
      },
    });

    const result = matchField(
      field,
      'password456',
      {
        password: 'password123',
      },
    );

    expect(result).toEqual({
      isInvalid: true,
      errorMessage: 'As senhas não são iguais.',
    });
  });

  it('uses the configured field from matchField', () => {
    const field = createField({
      validation: {
        matchField: 'confirmation',
      },
    });

    const result = matchField(
      field,
      '123456',
      {
        password: '123456',
        confirmation: '123456',
      },
    );

    expect(result).toEqual({
      isInvalid: false,
    });
  });
});

