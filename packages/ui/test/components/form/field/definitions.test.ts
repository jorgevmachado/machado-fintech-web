import {
  Name,
  Email,
  Fullname,
  Password,
  Description,
} from '@fintech/shared';

import { FORM_FIELD_DEFINITIONS  } from '../../../../src/components/form/field';

describe('FORM_FIELD_DEFINITIONS', () => {
  it('defines text field', () => {
    expect(FORM_FIELD_DEFINITIONS.text).toEqual({
      component: 'input',
      inputType: 'text',
    });
  });

  it('defines name field with Name value object', () => {
    expect(FORM_FIELD_DEFINITIONS.name).toEqual({
      label: 'form.label.name',
      component: 'input',
      inputType: 'text',
      validator: Name,
      placeholder: 'form.placeholder.name',
    });
  });

  it('defines email field with Email value object', () => {
    expect(FORM_FIELD_DEFINITIONS.email).toEqual({
      label: 'form.label.email',
      component: 'input',
      inputType: 'email',
      validator: Email,
      placeholder: 'form.placeholder.email',
    });
  });

  it('defines phone field', () => {
    expect(FORM_FIELD_DEFINITIONS.phone).toEqual({
      label: 'form.label.phone',
      component: 'input',
      inputType: 'tel',
      placeholder: 'form.placeholder.phone',
    });
  });
  it('defines money field', () => {
    expect(FORM_FIELD_DEFINITIONS.money).toEqual({
      component: 'input',
      inputType: 'money',
    });
  });

  it('defines fullname field with Fullname value object', () => {
    expect(FORM_FIELD_DEFINITIONS.fullname).toEqual({
      label: 'form.label.fullname',
      component: 'input',
      inputType: 'text',
      validator: Fullname,
      placeholder: 'form.placeholder.fullname',
    });
  });

  it('defines password field with Password value object', () => {
    expect(FORM_FIELD_DEFINITIONS.password).toEqual({
      label: 'form.label.password',
      component: 'input',
      inputType: 'password',
      validator: Password,
      placeholder: 'form.placeholder.password',
    });
  });

  it('defines description field with Description value object', () => {
    expect(FORM_FIELD_DEFINITIONS.description).toEqual({
      label: 'form.label.description',
      component: 'textarea',
      validator: Description,
      placeholder: 'form.placeholder.description',
    });
  });

  it('defines password confirmation as password input', () => {
    expect(FORM_FIELD_DEFINITIONS.password_confirmation).toEqual({
      label: 'form.label.password_confirmation',
      component: 'input',
      inputType: 'password',
      validator: Password,
      placeholder: 'form.placeholder.password_confirmation',
      validation: {
        matchField: 'password',
        errorMessage: 'form.validation.password.invalid.confirmation_mismatch',
      },
    });
  });

  it('defines all supported form field types', () => {
    expect(Object.keys(FORM_FIELD_DEFINITIONS)).toEqual([
      'text',
      'date',
      'money',
      'name',
      'email',
      'phone',
      'fullname',
      'password',
      'description',
      'password_confirmation',
      'select',
      'autocomplete',
    ]);
  });
});