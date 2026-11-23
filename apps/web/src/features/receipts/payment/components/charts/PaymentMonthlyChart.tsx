'use client';
import { useCallback } from 'react';

import { Money } from '@fintech/shared';
import { LineChart ,Text ,useUI } from '@fintech/ui';

import type { TPaymentDashboardMonthly } from '../../domain';

type PaymentMonthlyChartProps = {
  data: Array<TPaymentDashboardMonthly>;
};

/** Month-over-month spend. `period` stays a `YYYY-MM` label — never parsed as a date. */
export default function PaymentMonthlyChart({ data }: PaymentMonthlyChartProps) {
  const { locale } = useUI();

  const formatMoney = useCallback((value: number) => {
    const result = Money.tryCreate(value, { locale });
    return result.isFailure ? '' : result.instance.formatted;
  }, [locale]);

  return (
    <div
      className="rounded-2xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-5 shadow-sm"
      role="group"
      aria-labelledby="PaymentMonthlyChart-title"
    >
      <Text as="h3" id="PaymentMonthlyChart-title" weight="semibold" className="mb-2">receipt.payment.monthly_progression.title</Text>

      {data.length === 0 ? (
        <Text size="sm" className="text-[color:var(--app-text-muted,#64748b)]">
          receipt.payment.dashboard.no_data
        </Text>
      ) : (
        <LineChart
          data={data.map((item) => ({ period: item.period, total: item.total }))}
          series={[{ dataKey: 'total', label: 'Total' }]}
          height={300}
          xAxisKey="period"
          valueFormatter={formatMoney}
          tooltipFormatter={formatMoney}
        />
      )}
    </div>
  );
}
