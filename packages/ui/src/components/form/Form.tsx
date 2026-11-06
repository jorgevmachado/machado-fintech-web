'use client';

import React ,{ useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { type TFormField, FormField, FORM_FIELD_DEFINITIONS } from './field';
import {
  type FormValidation ,
  FormValidator
} from './validator';

import type { FormProps } from './types';

import { useFormController } from './controller';

import { FormActions } from './actions';
import { FormLayout } from './layout';

const Form = React.forwardRef<HTMLFormElement ,FormProps>(({
  rules ,
  fields ,
  layout,
  actions,
  onError,
  onSuccess,
  children,
  className,
  commonRules ,
  initialValues ,
  ...props
} ,ref) => {
  const controller = useFormController({ initialValues });
  const initialDataSignature = useMemo(() => JSON.stringify(initialValues) , [initialValues]);
  const previousInitialDataSignatureRef = useRef(initialDataSignature);

  const inputFields: Array<TFormField> = useMemo(() => {
    return fields.map((field) => {
      const name = field?.name ?? field.type;
      const definition = FORM_FIELD_DEFINITIONS[field.type];
      return {
        ...field,
        name,
        label: field?.label ?? definition?.label,
        validation: field?.validation ?? definition?.validation,
        placeholder: field?.placeholder ?? definition?.placeholder
      }
    })
  }, [fields])

  const validator = useMemo(() => new FormValidator(rules ,commonRules),[rules ,commonRules]);

  const [validations, setValidations] = useState<FormValidation['fields']>({});

  const handleValueChange = useCallback((field: TFormField, value: string) => {
      controller.setValue(field.name, value);
    },[controller]);

  const handleOnValueBlur = useCallback((field: TFormField) => {
    const validation = validator.validateField(
      field,
      controller.getValue(field.name),
      controller.data
    )
    setValidations((prev) => ({
      ...prev,
      [field.name]: {
        isInvalid: validation.isInvalid,
        errorMessage: validation.errorMessage
      }
    }));
  }, [controller, validator]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validator.validateFields(inputFields, controller.data);
    setValidations(validation.fields);

    if(validation.isInvalid) {
      onError?.(validation);
      return;
    }

    onSuccess?.(controller.data);
  }, [controller, validator, inputFields, onError, onSuccess]);

  const formClassName = useMemo(() => {
    const classNameList = [
      'space-y-4'
    ]
    if(className) {
      classNameList.push(className);
    }
    return classNameList.join(' ');
  }, [className]);

  useEffect(() => {
    if(previousInitialDataSignatureRef.current === initialDataSignature) {
      return;
    }
    previousInitialDataSignatureRef.current = initialDataSignature;
    controller.reset();
    setValidations({});
  } ,[initialDataSignature, initialValues, controller]);

  return (
    <form
      {...props}
      ref={ref}
      onSubmit={handleSubmit}
      className={formClassName}
    >
      <FormLayout {...layout}>
        {inputFields.map((field) => {
          const validation = validations[field.name];

          return (
            <FormField
              key={field.name}
              {...field}
              value={controller.getValue(field.name)}
              isInvalid={validation?.isInvalid}
              onValueBlur={() => handleOnValueBlur(field)}
              errorMessage={validation?.errorMessage}
              onValueChange={(value) => handleValueChange(field, value)}
            />
          )
        })}
      </FormLayout>

      {children}

      {actions && (
        <FormActions {...actions} />
      )}

    </form>
  );
});

Form.displayName = 'Form';

export default Form;
