'use client';
import { useCallback ,useMemo } from 'react';

import { Money } from '@fintech/shared';
import { BarChart ,Text ,useUI } from '@fintech/ui';

import type { TPaymentDashboardInstitution } from '../../domain';

type PaymentInstitutionsChartProps = {
  data: Array<TPaymentDashboardInstitution>;
};

const MAX_INSTITUTIONS = 10;

/** Top institutions by spend, as horizontal bars. */
export default function PaymentInstitutionsChart({ data }: PaymentInstitutionsChartProps) {
  const { locale } = useUI();

  const institutions = useMemo(
    () => [...data].sort((left, right) => right.total - left.total).slice(0, MAX_INSTITUTIONS),
    [data],
  );

  const formatAxisValue = useCallback((value: number) => {
    const result = Money.tryCreate(value, { locale, notation: 'compact' });
    return result.isFailure ? '' : result.instance.formatted;
  }, [locale]);

  const formatValue = useCallback((value: number) => {
    const result = Money.tryCreate(value, { locale });
    return result.isFailure ? '' : result.instance.formatted;
  }, [locale]);

  return (
    <div
      className="rounded-2xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-5 shadow-sm"
      role="group"
      aria-labelledby="PaymentInstitutionsChart-title"
    >
      <Text as="h3" id="PaymentInstitutionsChart-title" weight="semibold" className="mb-2">receipt.payment.expense_by_institution.title</Text>

      {institutions.length === 0 ? (
        <Text size="sm" className="text-[color:var(--app-text-muted,#64748b)]">
          receipt.payment.dashboard.no_data
        </Text>
      ) : (
        <BarChart
          data={institutions}
          xAxisKey="institution"
          series={[{ dataKey: 'total', label: 'Total' }]}
          layout="vertical"
          height={320}
          valueFormatter={formatAxisValue}
          tooltipFormatter={formatValue}
        />
      )}
    </div>
  );
}
