'use client';
import { useCallback, useMemo } from 'react';

import { type FormProps ,type FormValidation ,useAlert, Form } from '@fintech/ui';

import { Institution ,TInstitutionPersist } from '@/src/features/institution';

type InstitutionFormProps = {
  item?: Institution;
  onSubmit: (item: TInstitutionPersist) => void;
  onCancel: () => void;
};

export default function InstitutionForm({ item, onSubmit, onCancel }: InstitutionFormProps) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => ({
    name: item?.name ?? '',
  }), [item]);

  const fields: FormProps['fields'] = useMemo(() => [
    {
      type: 'text',
      name: 'name',
      label: 'institution.name.label',
      placeholder: 'institution.name.placeholder',
      required: true,
      value: initialValues.name ?? '',
    },
  ], [initialValues]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    onSubmit({
      id: item?.id,
      name: data.name ?? '',
    });
  }, [item, onSubmit]);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error',
      message: validation.errorMessage ?? 'auth.form.validation.error',
      position: 'top-right',
    });
  }, [showAlert]);

  return (
    <Form
      fields={fields}
      actions={{
        justify: 'end',
        submit: {
          children: 'form.action.save',
        },
        cancel: {
          children: 'form.action.cancel',
          onClick: onCancel,
        },
      }}
      onError={handleOnError}
      onSuccess={handleOnSuccess}
      className="space-y-4"
      initialValues={initialValues}
    />
  );
}