'use client';
import { useCallback, useMemo } from 'react';

import { type FormProps ,type FormValidation ,useAlert, Form } from '@fintech/ui';

import { Payer ,TPayerPersist } from '@/src/features/payer';

type PayerFormProps = {
  item?: Payer;
  onSubmit: (item: TPayerPersist) => void;
  onCancel: () => void;
};

export default function PayerForm({ item, onSubmit, onCancel }: PayerFormProps) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => ({
    name: item?.name ?? '',
  }), [item]);

  const fields: FormProps['fields'] = useMemo(() => [
    {
      type: 'text',
      name: 'name',
      label: 'finance.payer.name.label',
      placeholder: 'finance.payer.name.placeholder',
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