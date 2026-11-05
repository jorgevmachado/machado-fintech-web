import React from 'react';

import type {
  FormCommonValidationRules ,
  FormValidation ,
  FormValidationRules,
} from './validator';
import type { FormFieldProps } from './field';
import type { FormActionsProps } from './actions';
import type { FormLayoutProps } from './layout';

type OptionalName<T> = T extends unknown
  ? Omit<T, 'name'> & {
  name?: string;
}
  : never;

export type FormProps = Omit<React.FormHTMLAttributes<HTMLFormElement> ,'onSubmit' | 'onError'> & {
  rules?: FormValidationRules;
  fields: Array<OptionalName<FormFieldProps>>;
  layout?: Omit<FormLayoutProps, 'children'>;
  actions?: FormActionsProps;
  onError?: (validation: FormValidation) => void;
  onSuccess?: (data: Record<string ,string>) => void;
  commonRules?: FormCommonValidationRules;
  initialValues: Record<string ,string>;
}