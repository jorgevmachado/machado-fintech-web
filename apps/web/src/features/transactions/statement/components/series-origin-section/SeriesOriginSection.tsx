import { Badge ,Text } from '@fintech/ui';

import { FormSection } from '@/src/components';
import type { Statement } from '@/src/features/transactions/statement';
import { formatDateOnly } from '@/src/features/transactions/statement/hooks/use-statement';
import { SERIES_KIND_LABELS } from '@/src/features/transactions/statement/components/transaction-series-form';
import { TransactionKindMap } from '@/src/features/transactions/transaction-series';

type SeriesOriginSectionProps = {
  entry: Statement;
};

/**
 * Read-only block with the series an occurrence comes from. The occurrence index
 * is 1-based in the API, so it is shown as it arrives — the label says which
 * installment of the plan this is.
 */
export default function SeriesOriginSection({ entry }: SeriesOriginSectionProps) {
  const series = entry.transaction_serie;
  if (!series) return null;

  const isInstallmentPlan =
    series.kind === TransactionKindMap.CLOSED && series.installments !== undefined;
  const occurrenceOn = entry.occurrence_on ?? entry.expected_on;
  const wasMoved = entry.expected_on.getTime() !== occurrenceOn.getTime();

  return (
    <FormSection title="Série" description="Série de origem desta transação.">
      <div className="space-y-1">
        <Text as="span" size="xs" tone="subtle" className="uppercase tracking-wide">
          Nome da série
        </Text>
        <p className="text-sm font-medium text-[color:var(--app-text,#0f172a)]">{series.name}</p>
      </div>

      <div className="space-y-1">
        <Text as="span" size="xs" tone="subtle" className="uppercase tracking-wide">
          Tipo
        </Text>
        <div>
          <Badge variant="outline">{SERIES_KIND_LABELS[series.kind]}</Badge>
        </div>
      </div>

      {isInstallmentPlan ? (
        <div className="space-y-1">
          <Text as="span" size="xs" tone="subtle" className="uppercase tracking-wide">
            Ocorrência
          </Text>
          <p className="text-sm text-[color:var(--app-text,#0f172a)] tabular-nums">
            {`Parcela ${entry.occurrence_index} de ${series.installments}`}
          </p>
        </div>
      ) : null}

      {wasMoved ? (
        <div className="space-y-1">
          <Text as="span" size="xs" tone="subtle" className="uppercase tracking-wide">
            Data original
          </Text>
          <p className="text-sm text-[color:var(--app-text,#0f172a)] tabular-nums">{formatDateOnly(occurrenceOn)}</p>
        </div>
      ) : null}
    </FormSection>
  );
}
