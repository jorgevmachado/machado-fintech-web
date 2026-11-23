'use client';

import { Button ,Dropdown ,IconSwitch ,Input ,Text } from '@fintech/ui';

import {
  STATEMENT_GROUPINGS ,
  STATEMENT_GROUPING_LABELS ,
  type StatementGrouping ,
  type StatementView,
} from '@/src/features/transactions/statement/hooks/use-statement-preferences';
import { FilterPill } from '@/src/components';

export type StatementToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filtersOpen: boolean;
  filtersPanelId: string;
  /** Search, direction, situation, account and card — never the month. */
  activeFilterCount: number;
  onToggleFilters: () => void;
  grouping: StatementGrouping;
  onGroupingChange: (grouping: StatementGrouping) => void;
  view: StatementView;
  onViewChange: (view: StatementView) => void;
  /** Month total; `null` hides it while loading. */
  total: number | null;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCreateSingle: () => void;
  onCreateSeries: () => void;
};

function formatTotal(total: number): string {
  return `${total} ${total === 1 ? 'transação' : 'transações'}`;
}

/**
 * Search, filters, grouping, view and the create action. Mobile puts the search
 * and the total on the first line and the controls on the second; desktop keeps
 * everything in one line.
 */
export default function StatementToolbar({
  search,
  onSearchChange,
  filtersOpen,
  filtersPanelId,
  activeFilterCount,
  onToggleFilters,
  grouping,
  onGroupingChange,
  view,
  onViewChange,
  total,
  onPreviousMonth,
  onNextMonth,
  onCreateSingle,
  onCreateSeries,
}: StatementToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          appearance="icon"
          iconLeft="chevron-left"
          aria-label="Mês anterior"
          onClick={onPreviousMonth}
        />
        <Button
          type="button"
          appearance="icon"
          iconLeft="chevron-right"
          aria-label="Próximo mês"
          onClick={onNextMonth}
        />
      </div>

      <div className="order-1 min-w-0 flex-1 lg:max-w-xs">
        <Input
          type="search"
          name="search"
          value={search}
          leadingIcon="search"
          placeholder="Buscar por nome"
          aria-label="Buscar transações por nome"
          onValueChange={onSearchChange}
        />
      </div>

      {total !== null ? (
        <Text
          as="span"
          tone="subtle"
          className="order-2 shrink-0 text-xs tabular-nums lg:order-3 lg:ml-auto"
        >
          {formatTotal(total)}
        </Text>
      ) : null}

      <div className="order-3 flex w-full flex-wrap items-center gap-2 lg:order-4 lg:w-auto lg:justify-end">
        <Button
          type="button"
          appearance="outline"
          size="sm"
          iconLeft="filter"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-controls={filtersOpen ? filtersPanelId : undefined}
        >
          Filtros
          {activeFilterCount > 0 ? (
            <span className="min-w-5 rounded-full bg-[color:var(--app-accent-soft,#eff6ff)] px-1.5 text-center text-xs tabular-nums text-[color:var(--app-accent,#1d4ed8)]">
              {activeFilterCount}
              <span className="sr-only"> {activeFilterCount === 1 ? 'filtro ativo' : 'filtros ativos'}</span>
            </span>
          ) : null}
        </Button>

        <div role="group" aria-label="Agrupar por" className="hidden items-center gap-1 sm:flex">
          <span className="px-1 text-xs text-[color:var(--app-text-muted,#64748b)]">Agrupar</span>
          {STATEMENT_GROUPINGS.map((option) => {
            const active = grouping === option;
            return (
              <FilterPill
                key={option}
                active={active}
                onClick={() => onGroupingChange(option)}
                className="h-7 px-2.5 text-xs cursor-pointer"
              >
                {STATEMENT_GROUPING_LABELS[option]}
              </FilterPill>
            );
          })}
        </div>

        <div role="group" aria-label="Visualização" className="flex items-center">
          <IconSwitch
            offIcon="list"
            onIcon="table"
            offLabel="Visualizar em cards"
            onLabel="Visualizar em tabela"
            checked={view === 'table'}
            onCheckedChange={(checked) => onViewChange(checked ? 'table' : 'cards')}
          />
        </div>

        <Dropdown
          trigger={
            <Button type="button" size="sm" iconLeft="plus" className="ml-auto lg:ml-0">
              <span className="hidden sm:inline">Nova transação</span>
            </Button>
          }
          items={[
            { key: 'single', label: 'Transação avulsa', onClick: onCreateSingle },
            { key: 'series', label: 'Série parcelada ou recorrente', onClick: onCreateSeries },
          ]}
        />
      </div>
    </div>
  );
}