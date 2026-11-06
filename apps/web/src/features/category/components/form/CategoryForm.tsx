'use client';

import { useMemo, useState } from 'react';

import {
  Form,
  useAlert,
  type FormProps,
  type FormValidation,
} from '@fintech/ui';

import type {
  Category,
  TCategoryPersist,
} from '../../domain';

import SubcategoryForm, { type SubcategoryDraft } from './subcategory-form';

type CategoryFormProps = {
  item?: Category;
  onSubmit: (data: TCategoryPersist) => void;
  onCancel: () => void;
};

export default function CategoryForm({
  item,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const { showAlert } = useAlert();
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [subcategories, setSubcategories] = useState<SubcategoryDraft[]>(() =>
    [...(item?.subcategories ?? [])]
      .sort((left, right) => left.order - right.order)
      .map((subcategory) => ({
        key: subcategory.id,
        id: subcategory.id,
        name: subcategory.name,
        icon: subcategory.icon ?? '',
        color: subcategory.color ?? '',
        is_active: subcategory.is_active,
      })),
  );

  const initialValues = useMemo(() => ({
    name: item?.name ?? '',
    color: item?.color ?? '',
    icon: item?.icon ?? '',
  }), [item]);

  const fields: FormProps['fields'] = [
    {
      type: 'text',
      name: 'name',
      value: initialValues.name,
      label: 'category.name.label',
      placeholder: 'category.name.placeholder',
      required: true,
    },
    {
      type: 'color',
      name: 'color',
      value: initialValues.color,
      label: 'category.color.label',
      placeholder: 'category.color.placeholder',
    },
    {
      type: 'icon-combobox',
      name: 'icon',
      value: initialValues.icon,
      label: 'category.icon.label',
      placeholder: 'category.icon.placeholder',
    },
  ];

  const handleOnError = (validation: FormValidation) => {
    setValidationAttempted(true);
    showAlert({
      variant: 'error',
      message: validation.errorMessage ?? 'form.validation.required',
      position: 'top-right',
    });
  };

  const handleOnSuccess = (data: Record<string, string>) => {
    setValidationAttempted(true);
    const name = data.name?.trim() ?? '';
    const errorMessage = !name
      ? 'form.validation.required'
      : subcategories.length === 0
        ? 'category.subcategory.required'
        : subcategories.some((subcategory) => !subcategory.name.trim())
          ? 'category.subcategory.name.required'
          : undefined;

    if (errorMessage) {
      showAlert({ variant: 'error', message: errorMessage, position: 'top-right' });
      return;
    }

    onSubmit({
      id: item?.id,
      name,
      color: data.color,
      icon: data.icon,
      is_active: item?.is_active ?? true,
      subcategories: subcategories.map((subcategory, index) => ({
        ...(subcategory.id ? { id: subcategory.id } : {}),
        name: subcategory.name.trim(),
        color: subcategory.color,
        icon: subcategory.icon,
        is_active: subcategory.is_active,
        order: index + 1,
      })),
    });
  };

  return (
    <Form
      noValidate
      fields={fields}
      initialValues={initialValues}
      layout={{
        cols: 2,
        fields:[
          { name: 'name', span: 2},
          { name: 'color', span: 1},
          { name: 'icon', span: 1},
        ]
    }}
      onError={handleOnError}
      onSuccess={handleOnSuccess}
      actions={{
        justify: 'end',
        submit: { children: 'form.action.save' },
        cancel: { children: 'form.action.cancel', onClick: onCancel },
      }}
    >
      <SubcategoryForm
        value={subcategories}
        onChange={setSubcategories}
        validationAttempted={validationAttempted}
      />
    </Form>
  );
}