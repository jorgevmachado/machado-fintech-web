'use client';

import { useRef } from 'react';

import {
  Button,
  ColorInput,
  IconCombobox,
  Input,
  Lang,
  Text,
  useTranslationResolver,
} from '@fintech/ui';

import type { TSubCategoryPersist } from '../../../domain';

export type SubcategoryDraft = Omit<TSubCategoryPersist, 'order'> & { key: string };

type SubcategoryFormProps = {
  value: SubcategoryDraft[];
  onChange: (value: SubcategoryDraft[]) => void;
  validationAttempted: boolean;
};

export default function SubcategoryForm({
  value,
  onChange,
  validationAttempted,
}: SubcategoryFormProps) {
  const { resolve } = useTranslationResolver();
  const nextKey = useRef(0);

  const addSubcategory = () => {
    const key = `new-${nextKey.current++}`;
    onChange([
      ...value,
      { key, name: '', color: '', icon: '', is_active: true },
    ]);
  };

  const updateSubcategory = (key: string, field: 'name' | 'color' | 'icon', nextValue: string) => {
    onChange(value.map((subcategory) =>
      subcategory.key === key ? { ...subcategory, [field]: nextValue } : subcategory,
    ));
  };

  const moveSubcategory = (key: string, direction: -1 | 1) => {
    const index = value.findIndex((subcategory) => subcategory.key === key);
    const target = index + direction;
    const subcategory = value[index];
    if (!subcategory || target < 0 || target >= value.length) {
      return;
    }

    const reordered = value.filter((entry) => entry.key !== key);
    reordered.splice(target, 0, subcategory);
    onChange(reordered);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Text as="h2" weight="semibold">category.subcategory.title</Text>
        <Button type="button" iconLeft="plus" onClick={addSubcategory}>
          category.subcategory.add
        </Button>
      </div>

      {validationAttempted && value.length === 0 && (
        <Text role="alert" color="text-red-600">category.subcategory.required</Text>
      )}

      {value.map((subcategory, index) => {
        const invalidName = validationAttempted && !subcategory.name.trim();
        return (
          <fieldset
            key={subcategory.key}
            aria-label={resolve('category.subcategory.form_title', { position: index + 1 })}
            className="space-y-4 rounded-xl border border-border/60 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <Text as="h3" weight="semibold">
                <Lang langKey="category.subcategory.form_title" values={{ position: index + 1 }} />
              </Text>
              <div className="flex gap-2">
                <Button
                  type="button"
                  appearance="iconNoBorder"
                  iconLeft="chevron-up"
                  aria-label={resolve('category.subcategory.move_up')}
                  disabled={index === 0}
                  onClick={() => moveSubcategory(subcategory.key, -1)}
                />
                <Button
                  type="button"
                  appearance="iconNoBorder"
                  iconLeft="chevron-down"
                  aria-label={resolve('category.subcategory.move_down')}
                  disabled={index === value.length - 1}
                  onClick={() => moveSubcategory(subcategory.key, 1)}
                />
                <Button
                  type="button"
                  appearance="iconNoBorder"
                  tone="danger"
                  iconLeft="trash"
                  aria-label={resolve('category.subcategory.remove')}
                  onClick={() => onChange(value.filter((entry) => entry.key !== subcategory.key))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Input
                name={`${subcategory.key}-name`}
                label={resolve('category.subcategory.name.label')}
                placeholder={resolve('category.subcategory.name.placeholder')}
                value={subcategory.name}
                required
                isInvalid={invalidName}
                errorMessage={invalidName ? resolve('category.subcategory.name.required') : undefined}
                onValueChange={(nextValue) => updateSubcategory(subcategory.key, 'name', nextValue)}
              />
              <ColorInput
                name={`${subcategory.key}-color`}
                label={resolve('category.subcategory.color.label')}
                aria-label={resolve('category.subcategory.color.label')}
                placeholder={resolve('category.color.placeholder')}
                value={subcategory.color}
                onValueChange={(nextValue) => updateSubcategory(subcategory.key, 'color', nextValue)}
              />
              <IconCombobox
                name={`${subcategory.key}-icon`}
                label={resolve('category.subcategory.icon.label')}
                placeholder={resolve('category.icon.placeholder')}
                value={subcategory.icon}
                onValueChange={(nextValue) => updateSubcategory(subcategory.key, 'icon', nextValue)}
              />
            </div>
          </fieldset>
        );
      })}
    </section>
  );
}
