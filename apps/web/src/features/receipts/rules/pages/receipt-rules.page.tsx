'use client';

import { useEffect } from 'react';

import { Button, Pagination, Text, useModal, useTranslationResolver } from '@fintech/ui';

import { Delete } from '@/src/components';

import {
  ReceiptRules,
  TReceiptFieldRule,
  TReceiptFieldRuleSummary,
  TReceiptRulesPersist,
} from '../domain';
import { useReceiptRules } from '../hooks';
import { ReceiptFieldRuleForm, ReceiptRulesForm, ReceiptRulesList } from '../components';

export default function ReceiptRulesPage() {
  const { modal, openModal, closeModal } = useModal();
  const { resolve } = useTranslationResolver();
  const {
    meta,
    isLoading,
    items,
    fetchList,
    persist,
    persistFieldRules,
    seed,
    goToPage,
    remove,
  } = useReceiptRules();

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  const handleProfileSubmit = async (item: TReceiptRulesPersist) => {
    await persist(item);
    closeModal();
  };

  const handleProfileDelete = async (identifier: string) => {
    await remove(identifier);
    closeModal();
  };

  const openProfileForm = (item?: ReceiptRules) => {
    openModal({
      title: item?.id
        ? `receipt.rules.edit.title, {name: ${item.name}}`
        : 'receipt.rules.create.title',
      children: (
        <ReceiptRulesForm
          key={item?.id ?? 'new'}
          item={item}
          profiles={items}
          onSubmit={handleProfileSubmit}
          onCancel={closeModal}
        />
      ),
    });
  };

  const openProfileDelete = (item: ReceiptRules) => {
    openModal({
      title: `receipt.rules.delete.confirm, {name: ${item.name}}`,
      children: (
        <Delete
          identifier={item.id}
          onClose={closeModal}
          onSubmit={handleProfileDelete}
        />
      ),
    });
  };

  /**
   * As regras de campo são persistidas por reconciliação: o PUT leva a coleção completa, então
   * montamos a nova lista a partir do perfil e devolvemos ao backend.
   */
  const saveFieldRules = async (profile: ReceiptRules, rules: TReceiptFieldRule[]) => {
    await persistFieldRules(profile, rules);
    closeModal();
  };

  const toPersistRule = (rule: TReceiptFieldRuleSummary): TReceiptFieldRule => ({
    id: rule.id,
    field_name: rule.field_name,
    configuration: rule.configuration,
    is_active: rule.is_active,
  });

  const openFieldRuleForm = (profile: ReceiptRules, rule?: TReceiptFieldRuleSummary) => {
    openModal({
      title: rule
        ? `receipt.rules.field_rules.edit.title, {field: ${resolve(
            `receipt.rules.field.${rule.field_name}`,
          )}}`
        : 'receipt.rules.field_rules.create.title',
      children: (
        <ReceiptFieldRuleForm
          key={rule?.id ?? `new-${profile.id}`}
          item={rule}
          usedFieldNames={profile.field_rules.map((current) => current.field_name)}
          onSubmit={(submitted) => {
            const nextRules = rule
              ? profile.field_rules.map((current) =>
                  current.id === rule.id ? submitted : toPersistRule(current),
                )
              : [...profile.field_rules.map(toPersistRule), submitted];
            void saveFieldRules(profile, nextRules);
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const openFieldRuleDelete = (
    profile: ReceiptRules,
    rule: TReceiptFieldRuleSummary,
  ) => {
    openModal({
      title: `receipt.rules.field_rules.delete.confirm, {field: ${resolve(
        `receipt.rules.field.${rule.field_name}`,
      )}}`,
      children: (
        <Delete
          identifier={rule.id}
          onClose={closeModal}
          onSubmit={() => {
            const nextRules = profile.field_rules
              .filter((current) => current.id !== rule.id)
              .map(toPersistRule);
            void saveFieldRules(profile, nextRules);
          }}
        />
      ),
    });
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <Text as="h1" weight="semibold">
            receipt.rules.title
          </Text>
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
            receipt.rules.subtitle
          </Text>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            appearance="outline"
            iconLeft="refresh"
            onClick={() => void seed()}
            disabled={isLoading}
          >
            receipt.rules.seed.label
          </Button>
          <Button iconLeft="plus" onClick={() => openProfileForm()}>
            receipt.rules.create.title
          </Button>
        </div>
      </header>

      {isLoading && items.length === 0 ? (
        <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
          receipt.rules.loading
        </Text>
      ) : (
        <ReceiptRulesList
          items={items}
          onEditProfile={openProfileForm}
          onDeleteProfile={openProfileDelete}
          onCreateFieldRule={(profile) => openFieldRuleForm(profile)}
          onEditFieldRule={openFieldRuleForm}
          onDeleteFieldRule={openFieldRuleDelete}
        />
      )}

      {meta && items.length > 0 && (
        <Pagination
          isLoading={isLoading}
          currentPage={meta.current_page}
          totalPages={meta.total_pages}
          onPageChange={(page) => void goToPage(page)}
        />
      )}

      {modal}
    </section>
  );
}