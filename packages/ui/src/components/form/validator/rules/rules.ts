import type { FormCommonValidationRules } from '../types';

import { requiredRule } from './required';
import { matchField } from './match-field';

export const FORM_VALIDATION_RULES: FormCommonValidationRules = [
  requiredRule,
  matchField,
];