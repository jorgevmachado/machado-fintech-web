'use client';
import { useCallback ,useMemo } from 'react';

import { Money } from '@fintech/shared';
import { BarChart ,Text ,useUI } from '@fintech/ui';

import type { TPaymentDashboardSubcategory } from '../../domain';

type PaymentSubcategoriesChartProps = {
  data: Array<TPaymentDashboardSubcategory>;
};

const MAX_SUBCATEGORIES = 10;

/** Top subcategories by spend — where the money goes. */
export default function PaymentSubcategoriesChart({ data }: PaymentSubcategoriesChartProps) {
  const { locale } = useUI();

  const subcategories = useMemo(
    () => [...data].sort((left, right) => right.total - left.total).slice(0, MAX_SUBCATEGORIES),
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
      aria-labelledby="PaymentSubcategoriesChart-title"
    >
      <Text as="h3" id="PaymentSubcategoriesChart-title" weight="semibold" className="mb-2">receipt.payment.expense_by_category.title</Text>

      {subcategories.length === 0 ? (
        <Text size="sm" className="text-[color:var(--app-text-muted,#64748b)]">
          receipt.payment.dashboard.no_data
        </Text>
      ) : (
        <BarChart
          data={subcategories}
          xAxisKey="name"
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
