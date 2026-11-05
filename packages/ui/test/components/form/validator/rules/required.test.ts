import { requiredRule } from '../../../../../src/components/form/validator/rules';

describe('requiredRule', () => {
  it('returns valid when the field is not required', () => {
    const field = {
      name: 'name',
      type: 'name' as const,
    };

    expect(
      requiredRule(field, ''),
    ).toEqual({
      isInvalid: false,
    });
  });

  it('returns valid when a required field has a value', () => {
    const field = {
      name: 'name',
      type: 'name' as const,
      required: true,
    };

    expect(
      requiredRule(field, 'Jorge'),
    ).toEqual({
      isInvalid: false,
    });
  });

  it('returns invalid when a required field is empty', () => {
    const field = {
      name: 'name',
      type: 'name' as const,
      required: true,
    };

    expect(
      requiredRule(field, ''),
    ).toEqual({
      isInvalid: true,
      errorMessage: 'form.validation.required',
    });
  });

  it('returns invalid when a required field contains only spaces', () => {
    const field = {
      name: 'name',
      type: 'name' as const,
      required: true,
    };

    expect(
      requiredRule(field, '   '),
    ).toEqual({
      isInvalid: true,
      errorMessage: 'form.validation.required',
    });
  });

  it('returns invalid when a required field contains only spaces with custom error message', () => {
    const field = {
      name: 'name',
      type: 'name' as const,
      required: true,
      validation: {
        errorMessage: 'Custom error message',
      },
    };

    expect(
      requiredRule(field, '   '),
    ).toEqual({
      isInvalid: true,
      errorMessage: 'Custom error message',
    });
  });

  it('uses the field label in the error message when available', () => {
    const field = {
      name: 'name',
      type: 'name' as const,
      label: 'Full name',
      required: true,
    };

    expect(
      requiredRule(field, ''),
    ).toEqual({
      isInvalid: true,
      errorMessage: 'form.validation.required',
    });
  });
});