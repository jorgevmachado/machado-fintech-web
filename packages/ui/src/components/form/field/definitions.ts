import {
  Name,
  Email,
  Fullname,
  Password,
  Description,
} from '@fintech/shared';

import type { InputProps } from '../../input';
import type { FormValueObject} from '../validator';

import type { TFormFieldType } from './types';

export type FormFieldDefinition = {
  label?: string;
  component: 'input' | 'textarea' | 'select' | 'autocomplete';
  inputType?: InputProps['type'];
  validator?: FormValueObject;
  validation?: Record<string, unknown>;
  placeholder?: string;
}

export const FORM_FIELD_DEFINITIONS: Record<TFormFieldType, FormFieldDefinition> = {
  text: { component: 'input', inputType: 'text' },
  date: {
    label: 'form.label.date',
    component: 'input',
    inputType: 'date',
    placeholder: 'form.placeholder.date',
  },
  money: {
    component: 'input',
    inputType: 'money',
  },
  name: {
    label: 'form.label.name',
    component: 'input',
    inputType: 'text',
    validator: Name ,
    placeholder: 'form.placeholder.name',
  },
  email: {
    label: 'form.label.email',
    component: 'input',
    inputType: 'email',
    validator: Email,
    placeholder: 'form.placeholder.email',
  },
  phone: {
    label: 'form.label.phone',
    component: 'input',
    inputType: 'tel',
    placeholder: 'form.placeholder.phone',
  },
  fullname: {
    label: 'form.label.fullname',
    component: 'input',
    inputType: 'text',
    validator: Fullname,
    placeholder: 'form.placeholder.fullname',
  },
  password: {
    label: 'form.label.password',
    component: 'input',
    inputType: 'password',
    validator: Password,
    placeholder: 'form.placeholder.password',
  },
  description: {
    label: 'form.label.description',
    component: 'textarea',
    validator: Description,
    placeholder: 'form.placeholder.description',
  },
  password_confirmation: {
    label: 'form.label.password_confirmation',
    component: 'input',
    inputType: 'password',
    validator: Password,
    placeholder: 'form.placeholder.password_confirmation',
    validation: {
      matchField: 'password',
      errorMessage: 'form.validation.password.invalid.confirmation_mismatch'
    },
  },
  select: { component: 'select', label: 'form.label.select', placeholder: 'form.placeholder.select' },
  autocomplete: { component: 'autocomplete', label: 'form.label.autocomplete', placeholder: 'form.placeholder.autocomplete' },
};