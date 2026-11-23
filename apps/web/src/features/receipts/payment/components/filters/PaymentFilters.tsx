'use client';
import { useMemo } from 'react';

import { Filters ,type TFilter } from '@fintech/ui';

import type { PaymentOptionsResult } from '../../hooks/use-payment-options';

/** What the page keeps from the filter panel. */
export type PaymentFilterValues = {
  start_date: string;
  end_date: string;
  payer?: string;
  subcategory?: string;
  institution?: string;
};

type PaymentFiltersProps = {
  options: PaymentOptionsResult;
  values: PaymentFilterValues;
  onApply: (values: PaymentFilterValues) => void;
  onClear: () => void;
};

/** The three option filters need `key`; `Filters` hands `options` straight to `Autocomplete`. */
function toAutocompleteOptions(options: PaymentOptionsResult['payers']) {
  return options.map((option) => ({ key: option.value, value: option.value, label: option.label }));
}

/**
 * True only when the value is one of the loaded options. The dashboard expects
 * UUIDs, so free text typed into an autocomplete must not reach it.
 */
function isKnownOption(value: string | undefined, options: PaymentOptionsResult['payers']): boolean {
  return value !== undefined && options.some((option) => option.value === value);
}

/**
 * Period plus three selectors. The list and the dashboard consume the same
 * values, but each request maps them differently (names vs. UUIDs).
 */
export default function PaymentFilters({ options, values, onApply, onClear }: PaymentFiltersProps) {
  const filters = useMemo<Array<TFilter>>(() => [
    {
      type: 'date',
      name: 'start_date',
      value: values.start_date,
      label: 'receipt.payment.start_date.label',
      placeholder: 'receipt.payment.start_date.placeholder',
    },
    {
      type: 'date',
      name: 'end_date',
      value: values.end_date,
      label: 'receipt.payment.end_date.label',
      placeholder: 'receipt.payment.end_date.placeholder',
    },
    {
      type: 'autocomplete',
      name: 'payer',
      value: values.payer ?? '',
      label: 'receipt.payment.filters.payer.label',
      placeholder: 'receipt.payment.filters.payer.placeholder',
      options: toAutocompleteOptions(options.payers),
      isLoading: options.isLoading,
    },
    {
      type: 'autocomplete',
      name: 'subcategory',
      value: values.subcategory ?? '',
      label: 'receipt.payment.filters.subcategory.label',
      placeholder: 'receipt.payment.filters.subcategory.placeholder',
      options: toAutocompleteOptions(options.subcategories),
      isLoading: options.isLoading,
    },
    {
      type: 'autocomplete',
      name: 'institution',
      value: values.institution ?? '',
      label: 'receipt.payment.filters.institution.label',
      placeholder: 'receipt.payment.filters.institution.placeholder',
      options: toAutocompleteOptions(options.institutions),
      isLoading: options.isLoading,
    },
  ], [options, values]);

  return (
    <Filters
      // `Filters` seeds its draft once, on mount, and never re-reads `value`. Keying it
      // by the applied values remounts the panel after "Limpar" or an applied change, so
      // the inputs show what is actually being queried.
      key={JSON.stringify(values)}
      filters={filters}
      onApply={(next) => {
        // `Filters` returns every key, including empty ones; the route rejects `''` dates.
        // An autocomplete also hands back free text when nothing was selected, and the
        // dashboard takes a UUID there — so only values that match an option are kept.
        onApply({
          start_date: next.start_date ?? '',
          end_date: next.end_date ?? '',
          ...(isKnownOption(next.payer, options.payers) ? { payer: next.payer } : {}),
          ...(isKnownOption(next.subcategory, options.subcategories)
            ? { subcategory: next.subcategory }
            : {}),
          ...(isKnownOption(next.institution, options.institutions)
            ? { institution: next.institution }
            : {}),
        });
      }}
      onClear={onClear}
    />
  );
}