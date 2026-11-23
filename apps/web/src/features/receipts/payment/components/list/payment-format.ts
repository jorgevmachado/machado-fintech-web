import { DateVO ,Money } from '@fintech/shared';

/** The locales `DateVO` and `Money` accept, matching what `useUI` hands out. */
export type PaymentLocale = 'en-US' | 'pt-BR' | 'es-UE';

/** Shared formatters for the table and the cards view. */
export function formatPaymentDate(date: Date, locale: PaymentLocale): string {
  return DateVO.format.date(date, locale) || '—';
}

export function formatPaymentAmount(amount: number, locale: PaymentLocale): string {
  const result = Money.tryCreate(amount, { locale });
  return result.isFailure ? '' : result.instance.formatted;
}