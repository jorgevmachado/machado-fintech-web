'use client';

import { useRef } from 'react';

import { Button, Input, Text, useTranslationResolver } from '@fintech/ui';

export type TextMappingDraft = {
  key: string;
  contains: string;
  value: string;
};

type ReceiptTextMappingsProps = {
  title: string;
  containsLabel: string;
  valueLabel: string;
  value: TextMappingDraft[];
  onChange: (value: TextMappingDraft[]) => void;
};

/** Editor de pares `contains` → `value`, usado por `matches` e `mappings` de `source`. */
export default function ReceiptTextMappings({
  title,
  containsLabel,
  valueLabel,
  value,
  onChange,
}: ReceiptTextMappingsProps) {
  const { resolve } = useTranslationResolver();
  const nextKey = useRef(0);

  const addMapping = () => {
    onChange([...value, { key: `new-${nextKey.current++}`, contains: '', value: '' }]);
  };

  const updateMapping = (
    key: string,
    field: 'contains' | 'value',
    nextValue: string,
  ) => {
    onChange(
      value.map((mapping) =>
        mapping.key === key ? { ...mapping, [field]: nextValue } : mapping,
      ),
    );
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Text as="h3" weight="semibold">
          {title}
        </Text>
        <Button type="button" iconLeft="plus" onClick={addMapping}>
          receipt.rules.field_rules.mappings.add
        </Button>
      </div>

      {value.length === 0 && (
        <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
          receipt.rules.field_rules.mappings.empty
        </Text>
      )}

      {value.map((mapping) => (
        <div key={mapping.key} className="grid gap-3 md:grid-cols-2">
          <Input
            name={`${mapping.key}-contains`}
            label={resolve(containsLabel)}
            value={mapping.contains}
            onValueChange={(nextValue) =>
              updateMapping(mapping.key, 'contains', nextValue)
            }
          />
          <Input
            name={`${mapping.key}-value`}
            label={resolve(valueLabel)}
            value={mapping.value}
            onValueChange={(nextValue) =>
              updateMapping(mapping.key, 'value', nextValue)
            }
          />
        </div>
      ))}
    </section>
  );
}