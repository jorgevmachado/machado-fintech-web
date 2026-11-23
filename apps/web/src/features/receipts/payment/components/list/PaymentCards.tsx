'use client';
import { useTranslationResolver ,useUI } from '@fintech/ui';

import type { Payment } from '../../domain';
import { formatPaymentAmount ,formatPaymentDate } from './payment-format';

type PaymentCardsProps = {
  items: Array<Payment>;
};

/** Touch-friendly view: one card per payment, one column on mobile and two from `lg`. */
export default function PaymentCards({ items }: PaymentCardsProps) {
  const { locale } = useUI();
  const { resolve } = useTranslationResolver();

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {items.map((payment) => (
        <article
          key={payment.id}
          className="rounded-xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-[color:var(--app-text,#0f172a)]">
                {payment.payer.name}
              </p>
              <p className="truncate text-sm text-[color:var(--app-text-muted,#64748b)]">
                {payment.beneficiary.name}
              </p>
            </div>

            <p className="shrink-0 whitespace-nowrap font-semibold tabular-nums">
              {formatPaymentAmount(payment.amount, locale)}
            </p>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[color:var(--app-text-muted,#64748b)]">
            <div className="flex gap-1">
              <dt>{resolve('receipt.payment.list.headers.date')}:</dt>
              <dd className="tabular-nums">{formatPaymentDate(payment.payment_date, locale)}</dd>
            </div>
            <div className="flex gap-1">
              <dt>{resolve('receipt.payment.list.headers.subcategory')}:</dt>
              <dd className="truncate">{payment.subcategory.name}</dd>
            </div>
            <div className="col-span-2 flex gap-1">
              <dt>{resolve('receipt.payment.list.headers.institution')}:</dt>
              <dd className="truncate">{payment.source_institution.name}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}