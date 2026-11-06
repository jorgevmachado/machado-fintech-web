'use client';
import { useCallback, useMemo } from 'react';

import { Money } from '@fintech/shared';

import {
  Form,
  type FormProps,
  type FormValidation,
  useAlert,
} from '@fintech/ui';

import { CreditCard ,TCreditCardPersist } from '../../domain';

type CreditCardFormProps = {
  item?: CreditCard;
  onSubmit: (item: TCreditCardPersist) => void;
  onCancel: () => void;
}
export default function CreditCardForm({
  item,
  onSubmit,
  onCancel
}: CreditCardFormProps
) {
  const { showAlert } = useAlert();

  const initialValues: Record<string, string> = useMemo(() => ({
    icon: item?.icon ?? '',
    name: item?.name ?? '',
    color: item?.color ?? '',
    brand: item?.brand ?? '',
    limit: item?.limit?.toFixed(2) ?? '',
    due_day: item?.due_day?.toString() ?? '',
    description: item?.description ?? '',
    closing_day: item?.closing_day?.toString() ?? '',
    last_four_digits: item?.last_four_digits ?? '',
  }), [item]);

  const fields: FormProps['fields'] = useMemo(() => [
    {
      type: 'text',
      name: 'name',
      label: 'credit-card.name.label',
      placeholder: 'credit-card.name.placeholder',
      required: true,
      value: initialValues.name ?? '',
    },
    {
      type: 'select',
      name: 'brand',
      label: 'credit-card.brand.label',
      placeholder: 'credit-card.brand.placeholder',
      required: true,
      value: initialValues.brand ?? '',
      options: CreditCard.brands.map((brand) => ({
        value: brand.toUpperCase(),
        label: brand,
      })),
    },
    {
      type: 'text',
      name: 'last_four_digits',
      label: 'credit-card.last_four_digits.label',
      placeholder: 'credit-card.last_four_digits.placeholder',
      required: false,
      value: initialValues.last_four_digits ?? '',
      presentation: {
        minLength: 4,
        maxLength: 4,
      }
    },
    {
      type: 'text',
      name: 'due_day',
      label: 'credit-card.due_day.label',
      placeholder: 'credit-card.due_day.placeholder',
      required: true,
      value: initialValues.due_day ?? '',
    },
    {
      type: 'text',
      name: 'closing_day',
      label: 'credit-card.closing_day.label',
      placeholder: 'credit-card.closing_day.placeholder',
      required: true,
      value: initialValues.closing_day ?? '',
    },
    {
      type: 'money',
      name: 'limit',
      label: 'credit-card.limit.label',
      placeholder: 'credit-card.limit.placeholder',
      required: true,
      value: initialValues.limit ?? '',
    },
    {
      type: 'color',
      name: 'color',
      label: 'credit-card.color.label',
      placeholder: 'credit-card.color.placeholder',
      required: true,
      value: initialValues.color ?? '',
    },
    {
      type: 'icon-combobox',
      name: 'icon',
      label: 'credit-card.icon.label',
      placeholder: 'credit-card.icon.placeholder',
      required: false,
      value: initialValues.icon ?? '',
    },
    {
      type: 'description',
      value: initialValues.description ?? '',
      required: false,
      presentation: {
        minLength: 0
      }
    }
  ], [initialValues]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    const { name, brand, due_day, closing_day } = data;
    if (!name?.trim() || !brand?.trim() || !due_day?.trim() || !closing_day?.trim()) {
      showAlert({
        variant: 'error',
        message: 'form.validation.required',
        position: 'top-right',
      });
      return;
    }

    const limitFormatted = data.limit ? Money.tryCreate(data.limit).instance.valueNumber : undefined;
    const limit = limitFormatted !== undefined && !isNaN(limitFormatted) ? limitFormatted : undefined;

    onSubmit({
      id: item?.id,
      icon: data.icon,
      name,
      brand: brand as TCreditCardPersist['brand'],
      limit,
      color: data?.color,
      due_day: parseInt(due_day, 10),
      is_active: typeof item?.is_active === 'boolean' ? item.is_active : true,
      closing_day: parseInt(closing_day, 10),
      description: data.description,
      last_four_digits: data.last_four_digits,
    });
  }, [item, onSubmit, showAlert]);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error',
      message: validation.errorMessage ?? 'auth.form.validation.error',
      position: 'top-right',
    });
  }, [showAlert]);

  return (
    <>
      <Form
        fields={fields}
        layout={{
          cols: 2,
          fields: [
            { name: 'name', span: 1 },
            { name: 'brand', span: 1 },
            { name: 'due_day', span: 1 },
            { name: 'closing_day', span: 1 },
            { name: 'limit', span: 1 },
            { name: 'last_four_digits', span: 1 },
            { name: 'color', span: 1 },
            { name: 'icon', span: 1 },
            { name: 'description', span: 2 },
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
        onError={handleOnError}
        onSuccess={handleOnSuccess}
        className="space-y-4"
        initialValues={initialValues}
      />
    </>
  );
}