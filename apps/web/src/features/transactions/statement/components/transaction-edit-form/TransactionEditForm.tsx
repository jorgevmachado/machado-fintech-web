'use client';
import { useState } from 'react';

import { useAlert } from '@fintech/ui';

import {
  transactionService ,
  type TTransactionPersist,
} from '@/src/features/transactions/transaction';
import type { TransactionOptionsResult } from '@/src/features/transactions/transaction/hooks/use-transaction-options';
import TransactionForm
  ,{ type TransactionFormRecord } from '@/src/features/transactions/statement/components/transaction-form';

type TransactionEditFormProps = {
  /** The statement entry being edited; without it the form creates a new transaction. */
  transaction?: TransactionFormRecord;
  options: TransactionOptionsResult;
  onCancel: () => void;
  onDone: () => void;
};

/** Standalone transaction form: `POST` to create, `PUT` to replace the whole transaction. */
export default function TransactionEditForm({
  transaction,
  options,
  onCancel,
  onDone,
}: TransactionEditFormProps) {
  const { showAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(input: TTransactionPersist) {
    setIsSubmitting(true);

    try {
      const response = transaction?.id
        ? await transactionService.update(transaction.id, input)
        : await transactionService.create(input);

      if (response.isFailure) {
        showAlert({ variant: 'error', message: response.errors.join(' ') });
        return;
      }

      showAlert({
        variant: 'success',
        message: transaction ? 'Transação atualizada com sucesso.' : 'Transação criada com sucesso.',
      });
      onDone();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TransactionForm
      item={transaction}
      options={options}
      isLoadingOptions={options.isLoading}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}