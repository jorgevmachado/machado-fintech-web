'use client';

import { Icon, Lang, Text, useTranslationResolver } from '@fintech/ui';

import type { TReceiptFieldRuleSummary } from '../../domain';

type ReceiptFieldRuleCardProps = {
  rule: TReceiptFieldRuleSummary;
  onEdit: (rule: TReceiptFieldRuleSummary) => void;
  onDelete: (rule: TReceiptFieldRuleSummary) => void;
};

/** Card de uma regra de campo, com editar/excluir próprios. */
export default function ReceiptFieldRuleCard({
  rule,
  onEdit,
  onDelete,
}: ReceiptFieldRuleCardProps) {
  const { resolve } = useTranslationResolver();
  const { configuration } = rule;

  /*
   * Os valores entram já traduzidos: o resolver não traduz chave dentro de parâmetro, então
   * `parser: receipt.rules...` apareceria cru na tela.
   */
  const summary =
    configuration.strategy === 'regex'
      ? resolve('receipt.rules.field_rules.summary.regex', {
          parser: resolve(`receipt.rules.field_rules.parser.${configuration.parser}`),
          count: configuration.patterns.length,
        })
      : configuration.strategy === 'source'
        ? resolve('receipt.rules.field_rules.summary.source', {
            value: configuration.identified_value,
          })
        : configuration.strategy === 'constant'
          ? resolve('receipt.rules.field_rules.summary.constant', {
              value: configuration.value,
            })
          : null;

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--app-border,#e2e8f0)] px-3 py-2">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Text size="sm" weight="semibold">
            {resolve(`receipt.rules.field.${rule.field_name}`)}
          </Text>
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
            {resolve(`receipt.rules.field_rules.strategy.${configuration.strategy}`)}
          </Text>
          {!rule.is_active && (
            <Text size="sm" color="text-[color:var(--app-negative-strong,#991b1b)]">
              <Lang langKey="receipt.rules.inactive" />
            </Text>
          )}
        </div>
        {summary && (
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
            {summary}
          </Text>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Icon
          icon="edit"
          aria-label={resolve('receipt.rules.field_rules.edit.action')}
          onClick={() => onEdit(rule)}
          className="cursor-pointer transition-colors text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))]"
        />
        <Icon
          icon="trash"
          aria-label={resolve('receipt.rules.field_rules.delete.action')}
          onClick={() => onDelete(rule)}
          className="cursor-pointer transition-colors text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]"
        />
      </div>
    </li>
  );
}