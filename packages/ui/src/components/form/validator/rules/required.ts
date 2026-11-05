import type { TFormField } from '../../field';
import type { FormValidationRule } from '../types'
export const requiredRule: FormValidationRule = (field: TFormField, value: string) => {
  if(!field.required) {
    return { isInvalid: false }
  }

  if(value.trim()) {
    return { isInvalid: false }
  }

  return {
    isInvalid: true,
    errorMessage: field?.validation?.errorMessage ?? 'form.validation.required'
  }
}