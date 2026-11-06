'use client';
import { type FormProps ,type FormValidation ,useAlert, Form } from '@fintech/ui';

import {
  Account ,
  TAccountPersist,
} from '@/src/features/account/domain';
import { useCallback ,useMemo } from 'react';


type AccountFormProps = {
  item?: Account;
  onSubmit: (item: TAccountPersist) => void;
  onCancel: () => void;
}

export default function AccountForm({ item, onSubmit, onCancel }: AccountFormProps) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => ({
    icon: item?.icon ?? '',
    name: item?.name ?? '',
    type: item?.type ?? '',
    color: item?.color ?? '',
    agency: item?.agency ?? '',
    description: item?.description ?? '',
    account_number: item?.account_number ?? '',
    financial_institution: item?.financial_institution ?? '',
  }), [item]);

  const fields: FormProps['fields'] = useMemo(() => [
    {
      type: 'text',
      name: 'name',
      label: 'account.name.label',
      placeholder: 'account.name.placeholder',
      required: true,
      value: initialValues.name ?? '',
    },
    {
      type: 'select',
      name: 'type',
      label: 'account.type.label',
      placeholder: 'account.brand.placeholder',
      required: true,
      value: initialValues.type ?? '',
      options: Account.types.map((type) => ({
        value: type,
        label: `account.type.${type.toLowerCase()}`,
      })),
    },
    {
      type: 'description',
      value: initialValues.description ?? '',
      required: false,
      presentation: {
        minLength: 0
      }
    },
    {
      type: 'text',
      name: 'financial_institution',
      label: 'account.financial_institution.label',
      placeholder: 'account.financial_institution.placeholder',
      required: false,
      value: initialValues.financial_institution ?? '',
    },
    {
      type: 'text',
      name: 'agency',
      label: 'account.agency.label',
      placeholder: 'account.agency.placeholder',
      required: false,
      value: initialValues.agency ?? '',
    },
    {
      type: 'text',
      name: 'account_number',
      label: 'account.account_number.label',
      placeholder: 'account.account_number.placeholder',
      required: false,
      value: initialValues.account_number ?? '',
    },
    {
      type: 'color',
      name: 'color',
      label: 'account.color.label',
      placeholder: 'account.color.placeholder',
      required: false,
      value: initialValues.color ?? '',
    },
    {
      type: 'icon-combobox',
      name: 'icon',
      label: 'account.icon.label',
      placeholder: 'account.icon.placeholder',
      required: false,
      value: initialValues.icon ?? '',
    },

  ], [initialValues]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    const { name, type } = data;
    if(!name?.trim() || !type?.trim()) {
      showAlert({
        variant: 'error',
        message: 'form.validation.required',
        position: 'top-right',
      });
      return;
    }
    onSubmit({
      id: item?.id,
      icon: data.icon,
      type: type as TAccountPersist['type'],
      name,
      color: data.color,
      agency: data.agency,
      is_active: typeof item?.is_active === 'boolean' ? item.is_active : true,
      description: data.description,
      account_number: data.account_number,
      financial_institution: data.financial_institution,
    })

  }, [item, onSubmit, showAlert]);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error',
      message: validation.errorMessage ?? 'account.form.validation.error',
      position: 'top-right',
    });
  }, [showAlert]);

  return (
    <Form
      fields={fields}
      layout={{
        cols: 2,
        fields: [
          { name: 'name', span: 2 },
          { name: 'type', span: 2 },
          { name: 'description', span: 2 },
          { name: 'financial_institution', span: 2 },
          { name: 'agency', span: 1 },
          { name: 'account_number', span: 1 },
          { name: 'color', span: 1 },
          { name: 'icon', span: 1 },

        ]
      }}
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
      onSuccess={handleOnSuccess}
      onError={handleOnError}
      className="space-y-4"
      initialValues={initialValues}
    />
  )
}