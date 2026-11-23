'use client';
import { useCallback ,useMemo } from 'react';

import { Money } from '@fintech/shared';
import { RankingList ,Text ,useUI } from '@fintech/ui';

import type { TPaymentDashboardPayer } from '../../domain';

type PaymentPayersRankingProps = {
  data: Array<TPaymentDashboardPayer>;
};

/** Who paid the most in the period, with share of the total. */
export default function PaymentPayersRanking({ data }: PaymentPayersRankingProps) {
  const { locale } = useUI();

  const items = useMemo(
    () => data.map((payer) => ({
      id: payer.payer_id,
      label: payer.name,
      value: payer.total,
      count: payer.count,
    })),
    [data],
  );

  const formatValue = useCallback((value: number) => {
    const result = Money.tryCreate(value, { locale });
    return result.isFailure ? '' : result.instance.formatted;
  }, [locale]);

  return (
    <div
      className="rounded-2xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-5 shadow-sm"
      role="group"
      aria-labelledby="PaymentPayersRanking-title"
    >
      <Text as="h3" id="PaymentPayersRanking-title" weight="semibold">receipt.payment.distribution_of_payments_by_payer.title</Text>

      <div className="mt-4">
        <RankingList
          data={items}
          valueFormatter={formatValue}
          countFormatter={(count) => `${count}`}
        />
      </div>
    </div>
  );
}
