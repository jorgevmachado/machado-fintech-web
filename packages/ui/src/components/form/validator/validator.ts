import { type TFormField, FORM_FIELD_DEFINITIONS } from '../field';

import type {
  FormValidation,
  FormValidationRules,
  FormValidationResult,
  FormCommonValidationRules
} from './types';
import { FORM_VALIDATION_RULES } from './rules';
import { FormFieldValidation } from './types';

export class FormValidator {
  private readonly rules: FormValidationRules;
  private readonly commonRules: FormCommonValidationRules;

  constructor(
    rules: FormValidationRules = {},
    commonRules: FormCommonValidationRules = []
  ) {
    this.rules = rules;
    this.commonRules = [
      ...FORM_VALIDATION_RULES,
      ...commonRules
    ];
  }

  validateField(
    field: TFormField,
    value: string,
    data: Record<string, string> = {}
  ): FormFieldValidation {
    const commonValidation = this.validateCommonRules(field, value, data);

    if (commonValidation.isInvalid) {
      return {
        name: field.name,
        ...commonValidation
      }
    }

    const rule = this.rules[field.type];

    if (rule) {
      return {
        name: field.name,
        ...rule(field, value, data)
      }
    }

    const definition = FORM_FIELD_DEFINITIONS[field.type]

    if(!definition.validator) {
      return {
        name: field.name,
        isInvalid: false
      }
    }

    const result = definition.validator.tryCreate(
      value,
      this.buildValidatorConfig(field)
    );

    if(result.isFailure) {
      return {
        name: field.name,
        isInvalid: true,
        errorMessage: result.error
      }
    }

    return {
      name: field.name,
      isInvalid: false
    }
  }

  validateFields(
    fields: Array<TFormField>,
    data: Record<string, string> = {}
  ): FormValidation {
    const validations = fields.map(
      (field) => this.validateField(field ,data[field.name] ?? '' ,data));

    const fieldValidations = Object.fromEntries(
      validations.map(({ name ,...validation }) => [name ,validation])
    )

    const invalidField = validations.find(({ isInvalid }) => isInvalid);

    return {
      fields: fieldValidations,
      isInvalid: Boolean(invalidField),
      errorMessage: invalidField?.errorMessage,
    }
  }

  isFieldValid(
    field: TFormField,
    value: string,
    data: Record<string, string> = {}
  ): boolean {
    return !this.validateField(field, value, data).isInvalid;
  }

  isValid(
    fields: Array<TFormField>,
    data: Record<string, string> = {}
  ): boolean {
    return !this.validateFields(fields, data).isInvalid;
  }

  private validateCommonRules(
    field: TFormField,
    value: string,
    data: Record<string, string>
  ): FormValidationResult {
    for (const rule of this.commonRules) {

      const result = rule(field, value, data);
      if (result.isInvalid) {
        return result;
      }
    }
    return { isInvalid: false };
  }

  private buildValidatorConfig(field: TFormField): Record<string, unknown> {
    const config: Record<string, unknown> = {
      ...field.validatorConfig,
    }

    if(field.type !== 'select') {
      const presentation = field.presentation;
      if(presentation?.minLength !== undefined) {
        config.minLength = presentation.minLength;
      }
      if(presentation?.maxLength !== undefined) {
        config.maxLength = presentation.maxLength;
      }
    }

    return config;
  }
}