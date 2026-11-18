'use client';
import { useCallback ,useRef ,useState } from 'react';

import { useAlert } from '@fintech/ui';

import {
  TransactionStatusMap ,
  TTransactionPersist ,
  transactionService,
} from '@/src/features/transactions/transaction';
import {
  isSeriesOccurrence ,
  Statement ,
  statementEntryKey,
} from '@/src/features/transactions/statement';
import {
  TScheduledTransactionPersist,
  scheduledTransactionService,
} from '@/src/features/transactions/scheduled-transaction';

/** `PUT` replaces the whole transaction, so empty optionals go as `undefined` and the BFF nulls them. */
export function toTransactionPersist(entry: Statement): TTransactionPersist {
  const shouldBeSettled = entry.status !== TransactionStatusMap.SETTLED;

  return {
    id: entry.id,
    name: entry.name,
    note: entry.note,
    value: entry.value,
    account: entry.account,
    direction: entry.direction,
    credit_card: entry.credit_card,
    subcategory: entry.subcategory,
    expected_on: entry.expected_on,
    status: shouldBeSettled ? TransactionStatusMap.SETTLED : TransactionStatusMap.PENDING,
    settled_on: shouldBeSettled ? entry.expected_on : undefined,
  };
}

export function toScheduledTransactionPersist(entry: Statement): TScheduledTransactionPersist {
  const shouldBeSettled = entry.status !== TransactionStatusMap.SETTLED;

  return {
    name: entry.name,
    note: entry.note,
    value: entry.value,
    account: entry.account,
    direction: entry.direction,
    credit_card: entry.credit_card,
    subcategory: entry.subcategory,
    expected_on: entry.expected_on,
    status: shouldBeSettled ? TransactionStatusMap.SETTLED : TransactionStatusMap.PENDING,
    settled_on: shouldBeSettled ? entry.expected_on : undefined,
    occurrence_on: entry.occurrence_on ?? entry.expected_on,
    occurrence_index: entry.occurrence_index ?? 0,
  };
}

/**
 * The identifier the backend knows for the occurrence, when there is one.
 *
 * A projected occurrence only exists while the series generates it, so the list
 * carries a synthetic key (`seriesId:index`) instead of an `id`; storing it is
 * the job of the series `POST`, not of an update by identifier.
 */
export function resolveScheduledStoredId(entry: Statement): string | undefined {
  const syntheticKey = statementEntryKey({
    seriesId: entry.transaction_serie?.id,
    occurrence_index: entry.occurrence_index,
  });

  return entry.id && entry.id !== syntheticKey ? entry.id : undefined;
}

/**
 * One-click settle/unsettle. A standalone transaction goes through the existing
 * `PUT /transactions/:id`; an occurrence of a series is saved by series, which
 * stores it when it was never stored and updates it afterwards.
 * Resolves with the updated entry on success and with `undefined` on failure
 * (the error alert is shown here, and nothing should change on screen).
 */
export default function useToggleStatementEntrySettled() {
  const { showAlert } = useAlert();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  // Guards against a second request for the same entry while the first is in flight.
  const inFlightIdsRef = useRef(new Set<string>());

  const saveScheduledTransaction = useCallback(async (entry: Statement): Promise<Statement | undefined> => {
    const seriesId = entry.transaction_serie?.id;
    if (!seriesId || entry.occurrence_index === undefined) {
      showAlert({ variant: 'error', message: 'A ocorrência da série não tem série ou índice.' });
      return undefined;
    }

    const payload = toScheduledTransactionPersist(entry);
    const storedId = resolveScheduledStoredId(entry);

    const response = storedId
      ? await scheduledTransactionService.updateOccurrence(seriesId, storedId, payload)
      : await scheduledTransactionService.createOccurrence(seriesId, payload);

    if (response.isFailure) {
      return undefined;
    }

    return {
      ...entry,
      status: payload.status ?? entry.status,
      settled_on: payload.settled_on,
    } as Statement;
  }, [showAlert]);

  const saveTransaction = useCallback(async (entry: Statement): Promise<Statement | undefined> => {
    const payload = toTransactionPersist(entry);
    const response = await transactionService.update(entry.id, payload);

    if (response.isFailure) {
      return undefined;
    }

    return {
      ...entry,
      status: payload.status ?? entry.status,
      settled_on: payload.settled_on,
    } as Statement;
  }, []);

  const toggleSettled = useCallback(async (entry: Statement): Promise<Statement | undefined> => {
    if (entry.status === TransactionStatusMap.CANCELED) {
      return undefined;
    }

    const inFlightIds = inFlightIdsRef.current;
    if (inFlightIds.has(entry.id)) {
      return undefined;
    }

    inFlightIds.add(entry.id);
    setTogglingId(entry.id);

    try {
      const response = isSeriesOccurrence(entry)
        ? await saveScheduledTransaction(entry)
        : await saveTransaction(entry);

      if (!response) {
        showAlert({ variant: 'error', message: 'Erro ao atualizar a situação da transação.' });
      }

      return response;
    } finally {
      inFlightIds.delete(entry.id);
      setTogglingId((current) => (current === entry.id ? null : current));
    }
  }, [saveScheduledTransaction, saveTransaction, showAlert]);

  return { toggleSettled, togglingId };
}