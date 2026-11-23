'use client';

import { Accordion, Lang, Text, type TAccordionItem } from '@fintech/ui';

import { ReceiptRules } from '../../domain';

import ReceiptRulesProfilePanel from './receipt-rules-profile-panel';

export type ReceiptRulesListActions = {
  onEditProfile: (profile: ReceiptRules) => void;
  onDeleteProfile: (profile: ReceiptRules) => void;
  onCreateFieldRule: (profile: ReceiptRules) => void;
  onEditFieldRule: (
    profile: ReceiptRules,
    rule: ReceiptRules['field_rules'][number],
  ) => void;
  onDeleteFieldRule: (
    profile: ReceiptRules,
    rule: ReceiptRules['field_rules'][number],
  ) => void;
};

type ReceiptRulesListProps = {
  items: ReceiptRules[];
} & ReceiptRulesListActions;

function profileTitle(item: ReceiptRules) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="font-semibold">{item.name}</span>
      <span className="text-xs text-[color:var(--app-text-muted,#64748b)]">
        {item.institution_code ?? <Lang langKey="receipt.rules.general_profile" />}
      </span>
      {item.isReadOnly && (
        <span className="text-xs text-[color:var(--app-text-muted,#64748b)]">
          <Lang langKey="receipt.rules.system_profile" />
        </span>
      )}
      {!item.is_active && (
        <span className="text-xs text-[color:var(--app-negative-strong,#991b1b)]">
          <Lang langKey="receipt.rules.inactive" />
        </span>
      )}
    </span>
  );
}

export default function ReceiptRulesList({ items, ...actions }: ReceiptRulesListProps) {
  if (items.length === 0) {
    return (
      <div>
        <Lang langKey="receipt.rules.empty" />
      </div>
    );
  }

  const accordionItems: TAccordionItem[] = items.map((item) => ({
    value: item.id,
    title: profileTitle(item),
    content: <ReceiptRulesProfilePanel profile={item} {...actions} />,
  }));

  return (
    <div className="space-y-4">
      <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
        receipt.rules.expand_help
      </Text>
      <Accordion mode="multiple" items={accordionItems} />
    </div>
  );
}