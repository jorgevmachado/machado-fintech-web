'use client';
import { useState } from 'react';

import { Button ,useAlert ,useModal } from '@fintech/ui';

import { Delete ,PageSectionHeader } from '@/src/components';
import type { TransactionOptionsResult } from '@/src/features/transactions/transaction/hooks/use-transaction-options';
import type { TTransactionPersist } from '@/src/features/transactions/transaction';
import { Statement } from '@/src/features/transactions/statement';
import { resolveScheduledStoredId } from '@/src/features/transactions/statement/hooks/use-toggle-statement-entry-settled';
import { scheduledTransactionService } from '@/src/features/transactions/scheduled-transaction';
import TransactionForm
  from '@/src/features/transactions/statement/components/transaction-form';
import SeriesOriginSection
  from '@/src/features/transactions/statement/components/series-origin-section';

type ScheduledOccurrenceViewProps = {
  /** The statement entry of the occurrence: it already carries the series and the index. */
  entry: Statement;
  options: TransactionOptionsResult;
  onCancel: () => void;
  onDone: () => void;
  onEditSeries: () => void;
};

/**
 * One occurrence of a series, always as an edit form.
 *
 * The statement already answers both the stored occurrence and the one the
 * series generates, so the form is filled from the entry itself: no second
 * request, and a projected occurrence can be edited before it is ever stored.
 */
export default function ScheduledOccurrenceView({
  entry,
  options,
  onCancel,
  onDone,
  onEditSeries,
}: ScheduledOccurrenceViewProps) {
  const { showAlert } = useAlert();
  const { modal, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const seriesId = entry.transaction_serie?.id;
  const storedId = resolveScheduledStoredId(entry);

  async function handleSubmit(input: TTransactionPersist) {
    if (!seriesId || entry.occurrence_index === undefined) {
      showAlert({ variant: 'error', message: 'A ocorrência da série não tem série ou índice.' });
      return;
    }

    // The payload is built field by field: `input.id` is the list key, which for a
    // projected occurrence is synthetic and means nothing to the backend.
    const payload = {
      name: input.name,
      note: input.note,
      value: input.value,
      direction: input.direction,
      account: input.account,
      credit_card: input.credit_card,
      subcategory: input.subcategory,
      status: input.status,
      expected_on: input.expected_on,
      settled_on: input.settled_on,
      occurrence_on: entry.occurrence_on ?? entry.expected_on,
      occurrence_index: entry.occurrence_index,
    };

    setIsSubmitting(true);
    try {
      const response = storedId
        ? await scheduledTransactionService.updateOccurrence(seriesId, storedId, payload)
        : await scheduledTransactionService.createOccurrence(seriesId, payload);

      if (response.isFailure) {
        showAlert({ variant: 'error', message: response.errors.join(' ') });
        return;
      }

      showAlert({ variant: 'success', message: 'Transação da série salva com sucesso.' });
      onDone();
    } finally {
      setIsSubmitting(false);
    }
  }

  function openResetDialog(identifier: string) {
    openModal({
      title: 'Reverter para a série',
      children: (
        <Delete
          identifier={identifier}
          confirmLabel="Reverter"
          title="Reverter para a série"
          description="As alterações desta ocorrência serão descartadas e ela voltará a seguir a série."
          itemLabel="Transação"
          itemValue={entry.name}
          onClose={closeModal}
          onSubmit={async (target) => {
            const response = await scheduledTransactionService.deleteOccurrence(seriesId ?? '', target);
            closeModal();

            if (response.isFailure) {
              showAlert({ variant: 'error', message: response.errors.join(' ') });
              return;
            }

            showAlert({ variant: 'success', message: 'Ocorrência revertida para a série.' });
            onDone();
          }}
        />
      ),
    });
  }

  return (
    <div className="w-full space-y-6">
      <PageSectionHeader
        badge="Extrato Mensal"
        title="Transação da série"
        aside={
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" appearance="outline" size="sm" iconLeft="reply-all" onClick={onEditSeries}>
              Editar série
            </Button>
            {storedId ? (
              <Button
                type="button"
                appearance="outline"
                size="sm"
                iconLeft="reply"
                tone="danger"
                onClick={() => openResetDialog(storedId)}
              >
                Reverter para a série
              </Button>
            ) : null}
          </div>
        }
      />

      {options.error ? <p className="text-sm text-[color:var(--app-negative-strong,#991b1b)]">{options.error}</p> : null}

      <TransactionForm
        item={entry}
        options={options}
        isLoadingOptions={options.isLoading}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        leadingSection={<SeriesOriginSection entry={entry} />}
      />
      {modal}
    </div>
  );
}