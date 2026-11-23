'use client';

import { useId ,useMemo ,useState } from 'react';

import { Button ,useAlert ,useModal } from '@fintech/ui';

import { EmptyList ,PageSectionHeader } from '@/src/components';
import {
  isSeriesOccurrence ,
  Statement ,
  useStatementPreferences ,
  useToggleStatementEntrySettled,
} from '@/src/features/transactions/statement';
import useStatement ,{ groupStatementEntries } from '@/src/features/transactions/statement/hooks/use-statement';
import StatementToolbar
  from '@/src/features/transactions/statement/components/toolbar';
import StatementTable
  from '@/src/features/transactions/statement/components/table';
import StatementCards
  from '@/src/features/transactions/statement/components/card';
import StatementFiltersPanel
  from '@/src/features/transactions/statement/components/filters-panel';
import ScheduledOccurrenceView
  from '@/src/features/transactions/statement/components/scheduled-occurrence-view';
import SeriesCreateForm
  from '@/src/features/transactions/statement/components/series-create-form';
import SeriesEditView
  from '@/src/features/transactions/statement/components/series-edit-view';
import TransactionEditForm
  from '@/src/features/transactions/statement/components/transaction-edit-form';
import { Delete } from '@/src/components';
import { transactionService ,useTransactionOptions } from '@/src/features/transactions/transaction';

type ViewMode =
  | { kind: 'list' }
  | { kind: 'form'; transaction?: Statement }
  | { kind: 'scheduled-form'; entry: Statement }
  | { kind: 'series-form'; seriesId?: string; returnTo?: Statement };

type SettledOverlay = { source: Array<Statement> | null; items: Record<string, Statement> };

const EMPTY_OVERLAY: SettledOverlay = { source: null, items: {} };

const LIST_MODE: ViewMode = { kind: 'list' };

export default function MonthlyStatementPage() {
  const { showAlert } = useAlert();
  const { modal, openModal, closeModal } = useModal();
  const { preferences, monthLabel, setView, setGrouping, toggleFilters, setFilter, shiftPeriod, clearFilters } =
    useStatementPreferences();
  const statementFilters = preferences.filters;
  const [search, setSearch] = useState('');
  const filtersPanelId = useId();

  const trimmedSearch = search.trim();
  const hasCardFilter = Boolean(statementFilters.credit_card_id) || statementFilters.only_credit_card === true;
  const hasStatusFilter = Boolean(statementFilters.status);
  const activeFilterCount = [
    trimmedSearch,
    statementFilters.direction,
    statementFilters.status,
    statementFilters.account_id,
    hasCardFilter,
  ].filter(Boolean).length;
  const hasFilters = activeFilterCount > 0;

  const requestFilters = useMemo(
    () => ({ ...statementFilters, search: trimmedSearch || undefined }),
    [statementFilters, trimmedSearch],
  );

  const { entries, total, isLoading, error, refresh } = useStatement(requestFilters);
  const options = useTransactionOptions();
  const { toggleSettled, togglingId } = useToggleStatementEntrySettled();
  const [mode, setMode] = useState<ViewMode>(LIST_MODE);
  const [settledOverlay, setSettledOverlay] = useState<SettledOverlay>(EMPTY_OVERLAY);

  const visibleEntries = useMemo(
    () =>
      settledOverlay.source === entries
        ? entries.map((entry) => settledOverlay.items[entry.id] ?? entry)
        : entries,
    [settledOverlay, entries],
  );

  const groups = useMemo(
    () => groupStatementEntries(visibleEntries, preferences.grouping),
    [visibleEntries, preferences.grouping],
  );

  function handleClearFilters() {
    clearFilters();
    setSearch('');
  }

  function handleNewTransaction() {
    setMode({ kind: 'form' });
  }

  function handleNewSeries() {
    setMode({ kind: 'series-form' });
  }

  function handleOpen(entry: Statement) {
    if (
      isSeriesOccurrence(entry) &&
      entry.transaction_serie?.id !== undefined &&
      entry.occurrence_index !== undefined
    ) {
      setMode({ kind: 'scheduled-form', entry });
      return;
    }

    setMode({ kind: 'form', transaction: entry });
  }

  function backToList() {
    setMode(LIST_MODE);
  }

  /** Something on the month may have changed: back to the list and ask the statement again. */
  function backToReloadedList() {
    refresh();
    backToList();
  }

  function showNotFound(message: string) {
    showAlert({ variant: 'error', message });
    backToList();
  }

  async function handleToggleSettled(entry: Statement) {
    // Tie the result to the response on screen when the click happened.
    const source = entries;
    const shouldReload = hasStatusFilter;

    const updated = await toggleSettled(entry);
    if (!updated) return;

    if (shouldReload) {
      // The entry may no longer match the situation filter and has to leave the list.
      refresh();
      return;
    }

    setSettledOverlay((current) => ({
      source,
      items: { ...(current.source === source ? current.items : {}), [updated.id]: updated },
    }));
  }

  function openDeleteDialog(identifier: string, onConfirm: (identifier: string) => Promise<void>) {
    openModal({
      title: 'Excluir transação',
      children: (
        <Delete
          identifier={identifier}
          onClose={closeModal}
          onSubmit={async (target) => {
            await onConfirm(target);
            closeModal();
          }}
        />
      ),
    });
  }

  if (mode.kind === 'scheduled-form') {
    return (
      <ScheduledOccurrenceView
        key={mode.entry.id}
        entry={mode.entry}
        options={options}
        onCancel={backToList}
        onDone={backToReloadedList}
        onEditSeries={() =>
          setMode({ kind: 'series-form', seriesId: mode.entry.transaction_serie?.id, returnTo: mode.entry })
        }
      />
    );
  }

  if (mode.kind === 'series-form' && mode.seriesId) {
    const { returnTo } = mode;

    return (
      <SeriesEditView
        seriesId={mode.seriesId}
        options={options}
        onNotFound={showNotFound}
        onCancel={() => (returnTo ? setMode({ kind: 'scheduled-form', entry: returnTo }) : backToList())}
        onDone={backToReloadedList}
      />
    );
  }

  if (mode.kind === 'series-form') {
    return (
      <div className="w-full space-y-6">
        <PageSectionHeader badge="Extrato Mensal" title="Nova série de transações" />
        <SeriesCreateForm
          options={options}
          onCancel={backToList}
          onDone={backToReloadedList}
        />
      </div>
    );
  }

  if (mode.kind === 'form') {
    const editingTransaction = mode.transaction;

    return (
      <div className="w-full space-y-6">
        <PageSectionHeader
          badge="Extrato Mensal"
          title={editingTransaction ? 'Editar transação' : 'Nova transação'}
          aside={
            editingTransaction ? (
              <Button
                type="button"
                appearance="outline"
                size="sm"
                iconLeft="trash"
                tone="danger"
                onClick={() =>
                  openDeleteDialog(editingTransaction.id, async (identifier) => {
                    const response = await transactionService.delete(identifier);
                    if (response.isFailure) {
                      showAlert({ variant: 'error', message: response.errors.join(' ') });
                      return;
                    }
                    showAlert({ variant: 'success', message: 'Transação excluída com sucesso.' });
                    backToReloadedList();
                  })
                }
              >
                Excluir
              </Button>
            ) : undefined
          }
        />

        <TransactionEditForm
          transaction={editingTransaction}
          options={options}
          onCancel={backToList}
          onDone={backToReloadedList}
        />
        {modal}
      </div>
    );
  }

  const monthInSentence = monthLabel;

  function renderContent() {
    if (isLoading) {
      return <p className="text-sm text-[color:var(--app-text-muted,#64748b)]">Carregando transações...</p>;
    }
    if (error) {
      return <p className="text-sm text-[color:var(--app-negative-strong,#991b1b)]">{error}</p>;
    }
    if (groups.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4">
          <EmptyList
            title={`Nenhuma transação em ${monthInSentence}`}
            subtitle={
              hasFilters
                ? 'Nenhuma transação do mês atende aos filtros aplicados. Ajuste ou limpe os filtros para ver mais lançamentos.'
                : `Registre a primeira transação de ${monthInSentence} para começar a acompanhar o mês.`
            }
          />
          {hasFilters ? (
            <Button type="button" appearance="outline" onClick={handleClearFilters}>
              Limpar filtros
            </Button>
          ) : (
            <Button type="button" iconLeft="plus" onClick={handleNewTransaction}>
              Nova transação
            </Button>
          )}
        </div>
      );
    }
    if (preferences.view === 'table') {
      return (
        <StatementTable
          groups={groups}
          grouping={preferences.grouping}
          togglingId={togglingId}
          onToggleSettled={handleToggleSettled}
          onOpen={handleOpen}
        />
      );
    }
    return (
      <StatementCards
        groups={groups}
        togglingId={togglingId}
        onToggleSettled={handleToggleSettled}
        onOpen={handleOpen}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageSectionHeader badge="Extrato Mensal" title={monthLabel} />

      <StatementToolbar
        search={search}
        onSearchChange={setSearch}
        filtersOpen={preferences.filtersOpen}
        filtersPanelId={filtersPanelId}
        activeFilterCount={activeFilterCount}
        onToggleFilters={toggleFilters}
        grouping={preferences.grouping}
        onGroupingChange={setGrouping}
        view={preferences.view}
        onViewChange={setView}
        total={isLoading || error ? null : total}
        onPreviousMonth={() => shiftPeriod(-1)}
        onNextMonth={() => shiftPeriod(1)}
        onCreateSingle={handleNewTransaction}
        onCreateSeries={handleNewSeries}
      />

      {preferences.filtersOpen ? (
        <StatementFiltersPanel
          id={filtersPanelId}
          filters={statementFilters}
          accounts={options.accounts}
          creditCards={options.creditCards}
          hasActiveFilters={hasFilters}
          onFilterChange={setFilter}
          onClearFilters={handleClearFilters}
        />
      ) : null}

      {renderContent()}
      {modal}
    </div>
  );
}