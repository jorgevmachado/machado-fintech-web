'use client';

import { Button, Lang, Text, useTranslationResolver } from '@fintech/ui';

import type { ReceiptRules, TReceiptFieldRuleSummary } from '../../domain';

import ReceiptFieldRuleCard from './receipt-field-rule-card';

type ReceiptRulesProfilePanelProps = {
  profile: ReceiptRules;
  onEditProfile: (profile: ReceiptRules) => void;
  onDeleteProfile: (profile: ReceiptRules) => void;
  onCreateFieldRule: (profile: ReceiptRules) => void;
  onEditFieldRule: (profile: ReceiptRules, rule: TReceiptFieldRuleSummary) => void;
  onDeleteFieldRule: (profile: ReceiptRules, rule: TReceiptFieldRuleSummary) => void;
};

/**
 * Conteúdo do accordion de um perfil.
 *
 * As regras de identificação aparecem aqui, mas são editadas pelo botão **Editar** do perfil —
 * é o formulário do perfil que as reconcilia. As regras de campo têm ciclo próprio: cada card
 * abre o formulário daquele campo, e o PUT reconcilia só a coleção de `field_rules`.
 */
export default function ReceiptRulesProfilePanel({
  profile,
  onEditProfile,
  onDeleteProfile,
  onCreateFieldRule,
  onEditFieldRule,
  onDeleteFieldRule,
}: ReceiptRulesProfilePanelProps) {
  const { resolve } = useTranslationResolver();

  return (
    <div className="space-y-6">
      {!profile.isReadOnly && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            appearance="outline"
            iconLeft="edit"
            onClick={() => onEditProfile(profile)}
          >
            receipt.rules.profile.edit
          </Button>
          <Button
            type="button"
            appearance="outline"
            tone="danger"
            iconLeft="trash"
            onClick={() => onDeleteProfile(profile)}
          >
            receipt.rules.profile.delete
          </Button>
        </div>
      )}

      <section className="space-y-3">
        <Text as="h3" weight="semibold">
          receipt.rules.identification.title
        </Text>

        {profile.identification_rules.length === 0 ? (
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
            receipt.rules.identification.empty
          </Text>
        ) : (
          <ul className="space-y-2">
            {profile.identification_rules.map((rule, index) => (
              <li
                key={rule.id ?? `${rule.pattern}-${index}`}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-[color:var(--app-border,#e2e8f0)] px-3 py-2"
              >
                <code className="min-w-0 truncate text-xs">
                  {rule.pattern}
                </code>
                <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
                  {resolve('receipt.rules.identification.weight.short', {
                    weight: rule.weight,
                  })}
                </Text>
                {!rule.is_active && (
                  <Text size="sm" color="text-[color:var(--app-negative-strong,#991b1b)]">
                    <Lang langKey="receipt.rules.inactive" />
                  </Text>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Text as="h3" weight="semibold">
            receipt.rules.field_rules.title
          </Text>
          {!profile.isReadOnly && (
            <Button
              type="button"
              iconLeft="plus"
              onClick={() => onCreateFieldRule(profile)}
            >
              receipt.rules.field_rules.add
            </Button>
          )}
        </div>

        {profile.field_rules.length === 0 ? (
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
            receipt.rules.field_rules.empty
          </Text>
        ) : (
          <ul className="space-y-2">
            {profile.field_rules.map((rule) => (
              <ReceiptFieldRuleCard
                key={rule.id}
                rule={rule}
                onEdit={(target) => onEditFieldRule(profile, target)}
                onDelete={(target) => onDeleteFieldRule(profile, target)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}