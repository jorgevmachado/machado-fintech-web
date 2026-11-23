'use client';

import { useRef } from 'react';

import { Button, Input, Lang, Text, useTranslationResolver } from '@fintech/ui';

import type { TReceiptIdentificationRule } from '../../domain';

export type IdentificationRuleDraft = TReceiptIdentificationRule & { key: string };

type ReceiptIdentificationRulesProps = {
  value: IdentificationRuleDraft[];
  onChange: (value: IdentificationRuleDraft[]) => void;
  validationAttempted: boolean;
};

export default function ReceiptIdentificationRules({
  value,
  onChange,
  validationAttempted,
}: ReceiptIdentificationRulesProps) {
  const { resolve } = useTranslationResolver();
  const nextKey = useRef(0);

  const addRule = () => {
    const key = `new-${nextKey.current++}`;
    onChange([...value, { key, pattern: '', weight: 100, is_active: true }]);
  };

  const updateRule = (
    key: string,
    field: 'pattern' | 'weight' | 'is_active',
    nextValue: string | number | boolean,
  ) => {
    onChange(
      value.map((rule) => (rule.key === key ? { ...rule, [field]: nextValue } : rule)),
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Text as="h2" weight="semibold">
          receipt.rules.identification.title
        </Text>
        <Button type="button" iconLeft="plus" onClick={addRule}>
          receipt.rules.identification.add
        </Button>
      </div>

      <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
        receipt.rules.identification.help
      </Text>

      {value.length === 0 && (
        <Text role="alert" color="text-[color:var(--app-negative-strong,#991b1b)]">
          receipt.rules.identification.required
        </Text>
      )}

      {value.map((rule, index) => {
        const invalidPattern = validationAttempted && !rule.pattern.trim();
        const invalidWeight = validationAttempted && !(rule.weight > 0);

        return (
          <fieldset
            key={rule.key}
            aria-label={resolve('receipt.rules.identification.item', { position: index + 1 })}
            className="space-y-4 rounded-xl border border-[color:var(--app-border,#e2e8f0)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <Text as="h3" weight="semibold">
                <Lang
                  langKey="receipt.rules.identification.item"
                  values={{ position: index + 1 }}
                />
              </Text>
              <div className="flex gap-2">
                <Button
                  type="button"
                  appearance="iconNoBorder"
                  iconLeft="trash"
                  tone="danger"
                  aria-label={resolve('receipt.rules.identification.remove')}
                  onClick={() =>
                    onChange(value.filter((entry) => entry.key !== rule.key))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <Input
                  name={`${rule.key}-pattern`}
                  label={resolve('receipt.rules.identification.pattern.label')}
                  placeholder={resolve('receipt.rules.identification.pattern.placeholder')}
                  value={rule.pattern}
                  required
                  isInvalid={invalidPattern}
                  errorMessage={
                    invalidPattern
                      ? resolve('receipt.rules.identification.pattern.required')
                      : undefined
                  }
                  onValueChange={(nextValue) =>
                    updateRule(rule.key, 'pattern', nextValue)
                  }
                />
              </div>
              <Input
                name={`${rule.key}-weight`}
                type="number"
                label={resolve('receipt.rules.identification.weight.label')}
                placeholder={resolve('receipt.rules.identification.weight.placeholder')}
                value={String(rule.weight)}
                required
                isInvalid={invalidWeight}
                errorMessage={
                  invalidWeight
                    ? resolve('receipt.rules.identification.weight.invalid')
                    : undefined
                }
                onValueChange={(nextValue) => {
                  // Campo vazio vira 0, que já é inválido — evita `NaN` no payload.
                  const parsed = Number.parseInt(nextValue, 10);
                  updateRule(rule.key, 'weight', Number.isNaN(parsed) ? 0 : parsed);
                }}
              />
            </div>
          </fieldset>
        );
      })}
    </section>
  );
}