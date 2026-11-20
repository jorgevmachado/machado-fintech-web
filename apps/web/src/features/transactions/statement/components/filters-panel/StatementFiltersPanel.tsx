'use client';

import type { ReactNode } from 'react';

import { Button } from '@fintech/ui';

import { FilterPill } from '@/src/components';
import {
  TransactionDirectionMap ,
  type TransactionDirectionEnum ,
  type TransactionStatusEnum,
} from '@/src/features/transactions/transaction';
import { TRANSACTION_STATUS_LABELS } from '@/src/features/transactions/statement/components/transaction-status-badge';
import type { StatementFilterName } from '@/src/features/transactions/statement/hooks/use-statement-preferences';
import type { TransactionSelectOption } from '@/src/features/transactions/transaction/hooks/use-transaction-options';
import type { TStatementFilter } from '@/src/features/transactions/statement/domain';

const DIRECTION_LABELS: Record<TransactionDirectionEnum, string> = {
  [TransactionDirectionMap.IN]: 'Entrada',
  [TransactionDirectionMap.OUT]: 'Saída',
};

const DIRECTIONS = Object.values(TransactionDirectionMap);
const STATUSES = Object.keys(TRANSACTION_STATUS_LABELS) as TransactionStatusEnum[];

type StatementFilterSetter = <TName extends StatementFilterName>(
  name: TName,
  value: TStatementFilter[TName],
) => void;

export type StatementFiltersPanelProps = {
  id?: string;
  filters: TStatementFilter;
  /** Active accounts, from the page's single `useTransactionOptions`. */
  accounts: TransactionSelectOption[];
  /** Active credit cards, from the page's single `useTransactionOptions`. */
  creditCards: TransactionSelectOption[];
  hasActiveFilters: boolean;
  onFilterChange: StatementFilterSetter;
  onClearFilters: () => void;
};

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-[color:var(--app-text-muted,#64748b)] sm:w-20 sm:pt-2">
        {label}
      </span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

/**
 * Single-choice pill groups. Each group starts with a neutral pill, and clicking
 * the active pill clears the group. Groups without options are not rendered.
 */
export default function StatementFiltersPanel({
  id,
  filters,
  accounts,
  creditCards,
  hasActiveFilters,
  onFilterChange,
  onClearFilters,
}: StatementFiltersPanelProps) {
  const hasCardFilter = Boolean(filters.credit_card_id) || filters.only_credit_card === true;

  return (
    <section id={id} aria-label="Filtros do extrato" className="space-y-4 rounded-xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-4">
      <FilterGroup label="Direção">
        <FilterPill active={!filters.direction} onClick={() => onFilterChange('direction', undefined)}>
          Todas
        </FilterPill>
        {DIRECTIONS.map((direction) => {
          const active = filters.direction === direction;
          return (
            <FilterPill
              key={direction}
              active={active}
              onClick={() => onFilterChange('direction', active ? undefined : direction)}
            >
              {DIRECTION_LABELS[direction]}
            </FilterPill>
          );
        })}
      </FilterGroup>

      <FilterGroup label="Situação">
        <FilterPill active={!filters.status} onClick={() => onFilterChange('status', undefined)}>
          Todas
        </FilterPill>
        {STATUSES.map((status) => {
          const active = filters.status === status;
          return (
            <FilterPill
              key={status}
              active={active}
              onClick={() => onFilterChange('status', active ? undefined : status)}
            >
              {TRANSACTION_STATUS_LABELS[status]}
            </FilterPill>
          );
        })}
      </FilterGroup>

      {accounts.length > 0 ? (
        <FilterGroup label="Conta">
          <FilterPill active={!filters.account_id} onClick={() => onFilterChange('account_id', undefined)}>
            Todas as contas
          </FilterPill>
          {accounts.map((account) => {
            const active = filters.account_id === account.value;
            return (
              <FilterPill
                key={account.value}
                active={active}
                onClick={() => onFilterChange('account_id', active ? undefined : account.value)}
              >
                {account.label}
              </FilterPill>
            );
          })}
        </FilterGroup>
      ) : null}

      {creditCards.length > 0 ? (
        <FilterGroup label="Cartão">
          <FilterPill
            active={!hasCardFilter}
            onClick={() => {
              onFilterChange('credit_card_id', undefined);
              onFilterChange('only_credit_card', undefined);
            }}
          >
            Todos os cartões
          </FilterPill>
          <FilterPill
            active={filters.only_credit_card === true}
            onClick={() => onFilterChange('only_credit_card', filters.only_credit_card ? undefined : true)}
          >
            Somente cartão
          </FilterPill>
          {creditCards.map((creditCard) => {
            const active = filters.credit_card_id === creditCard.value;
            return (
              <FilterPill
                key={creditCard.value}
                active={active}
                onClick={() => onFilterChange('credit_card_id', active ? undefined : creditCard.value)}
              >
                {creditCard.label}
              </FilterPill>
            );
          })}
        </FilterGroup>
      ) : null}

      {hasActiveFilters ? (
        <div className="flex justify-end">
          <Button type="button" appearance="outline" size="sm" iconLeft="close" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        </div>
      ) : null}
    </section>
  );
}