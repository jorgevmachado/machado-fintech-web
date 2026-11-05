import type { TFormField } from '../../field';
import type { FormValidationRule } from '../types'

export const matchField: FormValidationRule = (
  field: TFormField,
  value: string,
  data: Record<string, string>
) => {
  const matchField = field.validation?.matchField;

  if(!matchField) {
    return { isInvalid: false }
  }

  if(value === data[matchField]) {
    return { isInvalid: false }
  }

  return {
    isInvalid: true,
    errorMessage: field?.validation?.errorMessage ?? 'form.validation.match_field.invalid'
  }
}