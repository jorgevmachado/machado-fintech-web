import type { TFormField } from '../field';

export type FormValidationResult = {
  isInvalid: boolean;
  errorMessage?: string;
}

export type FormFieldValidation = FormValidationResult & {
  name: string;
}

export type FormValidation = FormValidationResult & {
  fields: Record<string, FormValidationResult>;
}

export type FormValueObject<T = string> = {
  tryCreate: (value: T, config?: Record<string, unknown>) => {
    isOk: boolean;
    error?: string;
    errors?: Array<string>;
    instance?: unknown;
    isFailure: boolean;
  };
}

export type FormValueObjectValidators = Partial<
  Record<TFormField['type'], FormValueObject>
>;

export type FormValidationRule = (
  field: TFormField,
  value: string,
  data: Record<string, string>
) => FormValidationResult;

export type FormValidationRules = Partial<
  Record<TFormField['type'], FormValidationRule>
>;

export type FormCommonValidationRules = Array<FormValidationRule>;