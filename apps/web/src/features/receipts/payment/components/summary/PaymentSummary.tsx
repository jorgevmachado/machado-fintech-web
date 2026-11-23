'use client';
import { useCallback } from 'react';

import { Money } from '@fintech/shared';
import { Text ,useUI } from '@fintech/ui';

import type { TPaymentDashboardSummary } from '../../domain';

type PaymentSummaryProps = {
  summary: TPaymentDashboardSummary;
};

/** Four stat tiles: the period total, how many payments, the average and the highest. */
export default function PaymentSummary({ summary }: PaymentSummaryProps) {
  const { locale } = useUI();

  const formatMoney = useCallback((value: number) => {
    const result = Money.tryCreate(value, { locale });

    if (result.isFailure) {
      return Money.tryCreate(0, { locale }).instance.formatted;
    }

    return result.instance.formatted;
  }, [locale]);

  const items = [
    { label: 'receipt.payment.total.title', value: formatMoney(summary.total), highlight: true },
    { label: 'receipt.payment.count.title', value: String(summary.count), highlight: false },
    { label: 'receipt.payment.average.title', value: formatMoney(summary.average), highlight: false },
    { label: 'receipt.payment.max.title', value: formatMoney(summary.highest), highlight: false },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={[
            'rounded-2xl border p-5 transition-shadow hover:shadow-md',
            item.highlight
              ? 'border-[color:var(--app-accent-border,#3b82f6)] bg-[color:var(--app-accent-soft,#eff6ff)]'
              : 'border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)]',
          ].join(' ')}
        >
          <Text
            size="sm"
            color={
              item.highlight
                ? 'text-[color:var(--app-accent,#1d4ed8)]'
                : 'text-[color:var(--app-text-muted,#64748b)]'
            }
          >
            {item.label}
          </Text>

          <Text
            weight="bold"
            size={item.highlight ? '3xl' : '2xl'}
            color="text-[color:var(--app-text-strong,#020617)]"
            className="mt-2 tabular-nums"
          >
            {item.value}
          </Text>
        </div>
      ))}
    </section>
  );
}