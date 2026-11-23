'use client';
import { useCallback ,useMemo } from 'react';

import { Money } from '@fintech/shared';
import { RankingList ,Text ,useUI } from '@fintech/ui';

import type { TPaymentDashboardBeneficiary } from '../../domain';

type PaymentBeneficiariesRankingProps = {
  data: Array<TPaymentDashboardBeneficiary>;
};

/** Who received the most in the period, with share of the total. */
export default function PaymentBeneficiariesRanking({ data }: PaymentBeneficiariesRankingProps) {
  const { locale } = useUI();

  const items = useMemo(
    () => data.map((beneficiary) => ({
      id: beneficiary.beneficiary_id,
      label: beneficiary.name,
      value: beneficiary.total,
      count: beneficiary.count,
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
      aria-labelledby="PaymentBeneficiariesRanking-title"
    >
      <Text as="h3" id="PaymentBeneficiariesRanking-title" weight="semibold">receipt.payment.distribution_of_payments_by_beneficiary.title</Text>

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
