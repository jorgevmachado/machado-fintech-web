import React from 'react';

import type { BaseInputProps } from '../../../types';

import type { InputProps } from '../../input';
import type { TextareaProps } from '../../textarea';
import type { AutocompleteProps } from '../../autocomplete';
import type { SelectProps } from '../../select';

export type TFormTextFieldType = 'text' | 'name' | 'fullname' | 'date' | 'money';

export type TFormTextAreaFieldType = 'description';

export type TFormCredentialFieldType = 'password' | 'password_confirmation';

export type TFormContactFieldType = 'email' | 'phone';

export type TFormSelectFieldType = 'select';

export type TFormAutocompleteFieldType = 'autocomplete';

export type TFormFieldType =
  | TFormTextFieldType
  | TFormTextAreaFieldType
  | TFormCredentialFieldType
  | TFormContactFieldType
  | TFormSelectFieldType
  | TFormAutocompleteFieldType;

export type TFormFieldPresentation = Pick<
  BaseInputProps,
  | 'size'
  | 'variant'
  | 'fullWidth'
  | 'leadingIcon'
  | 'trailingIcon'
  | 'helperText'
  | 'loadingText'
  | 'isLoading'
  | 'showClearButton'
  | 'uppercaseLabel'
  | 'switchLanguage'
  | 'helperClassName'
  | 'containerClassName'
  | 'inputWrapperClassName'
  | 'clearButtonAriaLabel'
  | 'onClear'
>;

export type TFormInputPresentation = TFormFieldPresentation & Pick<InputProps, 'mask' | 'minLength' | 'maxLength'>;

export type TFormTextareaPresentation = TFormFieldPresentation & Pick<
  TextareaProps,
  | 'rows'
  | 'minLength'
  | 'maxLength'
  | 'showCharacterCount'
>;

export type TFormSelectPresentation = TFormFieldPresentation;

export type TFormAutocompletePresentation = TFormFieldPresentation & Pick<
  AutocompleteProps,
  | 'maxLength'
  | 'minLength'
  | 'maxOptions'
  | 'filterOptions'
  | 'noResultsText'
  | 'onInputKeyDown'
  | 'onSelectOption'
  | 'optionClassName'
  | 'listboxClassName'
  | 'loadingPlaceholder'
>;

export type TFormValidation = {
  matchField?: string;
  errorMessage?: string;
}

type TBaseFormField = {
  name: string;
  label?: string;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  validation?: TFormValidation;
  placeholder?: string;
  validatorConfig?: Record<string, unknown>;
}

export type TFormInputField = TBaseFormField & {
  type: TFormTextFieldType | TFormCredentialFieldType | TFormContactFieldType;
  presentation?: TFormInputPresentation;
}

export type TFormTextareaField = TBaseFormField & {
  type: TFormTextAreaFieldType;
  presentation?: TFormTextareaPresentation;
}

export type TFormSelectField = TBaseFormField & {
  type: TFormSelectFieldType;
  options: SelectProps['options'];
  presentation?: TFormSelectPresentation;
}

export type TFormAutocompleteField = TBaseFormField & {
  type: TFormAutocompleteFieldType;
  options: AutocompleteProps['options'];
  presentation?: TFormAutocompletePresentation;
}

export type TFormField =
  | TFormInputField
  | TFormTextareaField
  | TFormSelectField
  | TFormAutocompleteField;


export type TFormFieldController = {
  value: string;
  isInvalid?: boolean;
  onValueBlur?: (value: string, name: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  errorMessage?: string;
  onValueChange?: (value: string, name: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export type FormFieldProps = TFormField & TFormFieldController;