import { isSeriesOccurrence ,Statement } from '@/src/features/transactions/statement';
import { TransactionKindMap } from '@/src/features/transactions/transaction-series';

/**
 * Which installment of the plan the entry is. `occurrence_index` is 1-based in the
 * API, so it is shown as it arrives.
 */
export default function RecurrenceSign({ entry }: { entry: Statement }) {
  if (!isSeriesOccurrence(entry)) return null;

  const isInstallmentPlan =
    entry.transaction_serie?.kind === TransactionKindMap.CLOSED &&
    entry.installments !== undefined &&
    entry.occurrence_index !== undefined;

  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[color:var(--app-text-muted,#64748b)]">
      <span className="sr-only">Série {entry.transaction_serie?.name}</span>
      {isInstallmentPlan ? (
        <span className="tabular-nums">{`${entry.occurrence_index}/${entry.installments}`}</span>
      ) : null}
    </span>
  );
}
