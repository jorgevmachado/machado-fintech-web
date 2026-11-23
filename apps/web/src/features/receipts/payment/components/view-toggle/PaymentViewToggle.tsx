'use client';
import { Button ,useTranslationResolver } from '@fintech/ui';

import type { PaymentView } from '../../hooks/use-payment-view';

type PaymentViewToggleProps = {
  view: PaymentView;
  onChange: (view: PaymentView) => void;
};

/**
 * Table or cards. Icon-only, so each button carries its accessible name —
 * `Button` does not translate `aria-label`, so the key is resolved here.
 */
export default function PaymentViewToggle({ view, onChange }: PaymentViewToggleProps) {
  const { resolve } = useTranslationResolver();

  return (
    <div role="group" aria-label={resolve('receipt.payment.view.group')} className="flex items-center gap-1">
      <Button
        type="button"
        appearance="icon"
        size="sm"
        iconLeft="table"
        aria-label={resolve('receipt.payment.view.table')}
        aria-pressed={view === 'table'}
        onClick={() => onChange('table')}
      />
      <Button
        type="button"
        appearance="icon"
        size="sm"
        iconLeft="list"
        aria-label={resolve('receipt.payment.view.cards')}
        aria-pressed={view === 'cards'}
        onClick={() => onChange('cards')}
      />
    </div>
  );
}