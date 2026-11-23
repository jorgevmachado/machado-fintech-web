'use client';

import { useCallback ,useEffect ,useMemo ,useState } from 'react';

import { DateVO } from '@fintech/shared';
import { Button ,Pagination ,Text ,useTranslationResolver ,useUI } from '@fintech/ui';

import { EmptyList ,PageSectionHeader } from '@/src/components';

import {
  PaymentBeneficiariesRanking ,
  PaymentCards ,
  PaymentFilters ,
  PaymentInstitutionsChart ,
  PaymentMonthlyChart ,
  PaymentPayersRanking ,
  PaymentSubcategoriesChart ,
  PaymentSummary ,
  PaymentTable ,
  PaymentViewToggle ,
  type PaymentFilterValues,
} from '../components';
import {
  usePaymentDashboard ,
  usePaymentOptions ,
  usePayments ,
  usePaymentView,
} from '../hooks';
import type { TPaymentDashboardParams ,TPaymentFilter } from '../domain';

/** The locales `DateVO` accepts, matching what `useUI` hands out. */
type PaymentLocale = 'en-US' | 'pt-BR' | 'es-UE';

/**
 * The last six months, `YYYY-MM-DD`. A single month gives the monthly
 * progression a lone point, which draws no line — the panel opens on a window
 * wide enough for the charts to show a trend.
 */
const DEFAULT_RANGE_MONTHS = 6;

function defaultRange(): { start_date: string; end_date: string } {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  // Read the date in UTC too: mixing local getters with `Date.UTC` can land a
  // month off near the turn of the month in negative offsets.
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const start = new Date(Date.UTC(year, month - (DEFAULT_RANGE_MONTHS - 1), 1));
  const end = new Date(Date.UTC(year, month + 1, 0));

  return {
    start_date: `${start.getUTCFullYear()}-${pad(start.getUTCMonth() + 1)}-${pad(start.getUTCDate())}`,
    end_date: `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(end.getUTCDate())}`,
  };
}

const INITIAL_FILTERS: PaymentFilterValues = defaultRange();

const LIST_PAGE_SIZE = '12';

/**
 * Turns the panel values into each endpoint's key space: the list filters by
 * **name** (`payer`/`subcategory`/`source_institution`), the dashboard by
 * **UUID** (`payer_id`/`subcategory_id`/`institution` name).
 */
function toListFilters(
  values: PaymentFilterValues,
  options: ReturnType<typeof usePaymentOptions>,
): TPaymentFilter {
  const payerName = options.payers.find((option) => option.value === values.payer)?.name;
  const subcategoryName = options.subcategories.find((option) => option.value === values.subcategory)?.name;
  const institutionName = options.institutions.find((option) => option.value === values.institution)?.name;

  return {
    start_date: values.start_date,
    end_date: values.end_date,
    order_by: 'payment_date',
    order: 'desc',
    limit: LIST_PAGE_SIZE,
    ...(payerName === undefined ? {} : { payer: payerName }),
    ...(subcategoryName === undefined ? {} : { subcategory: subcategoryName }),
    ...(institutionName === undefined ? {} : { source_institution: institutionName }),
  };
}

/**
 * The dashboard takes UUIDs for payer and subcategory, but a **name** for the
 * institution — the backend matches it against `Institution.name_code`.
 */
function toDashboardParams(
  values: PaymentFilterValues,
  options: ReturnType<typeof usePaymentOptions>,
): TPaymentDashboardParams {
  const institutionName = options.institutions.find((option) => option.value === values.institution)?.name;

  return {
    start_date: values.start_date,
    end_date: values.end_date,
    ...(values.payer ? { payer_id: values.payer } : {}),
    ...(values.subcategory ? { subcategory_id: values.subcategory } : {}),
    ...(institutionName === undefined ? {} : { institution: institutionName }),
  };
}

function formatPeriodLabel(values: PaymentFilterValues, locale: PaymentLocale): string {
  const start = DateVO.format.dateStringToDate(values.start_date);
  const end = DateVO.format.dateStringToDate(values.end_date);

  if (!start || !end) {
    return '';
  }

  return `${DateVO.format.date(start, locale)} — ${DateVO.format.date(end, locale)}`;
}

export default function PaymentPage() {
  const { locale } = useUI();
  const { resolve } = useTranslationResolver();
  const options = usePaymentOptions();
  const { view, setView } = usePaymentView();
  const [filters, setFilters] = useState<PaymentFilterValues>(INITIAL_FILTERS);
  const [listFilters, setListFilters] = useState<TPaymentFilter>(() =>
    toListFilters(INITIAL_FILTERS, { payers: [], subcategories: [], institutions: [], isLoading: false, error: null }));

  const { items, meta, isLoading: isListLoading, fetchList, goToPage } = usePayments();
  const { dashboard, status, fetchDashboard, retry } = usePaymentDashboard();

  const periodLabel = useMemo(() => formatPeriodLabel(filters, locale), [filters, locale]);

  const applyFilters = useCallback((next: PaymentFilterValues) => {
    setFilters(next);
    const nextListFilters = toListFilters(next, options);
    setListFilters(nextListFilters);
    void fetchList(nextListFilters);

    // The dashboard endpoint requires a full period. Clearing a date field would
    // otherwise turn into a 400 and replace the panel with its error state, while
    // the list happily returns everything — keep the last period instead.
    if (next.start_date && next.end_date) {
      void fetchDashboard(toDashboardParams(next, options));
    }
  }, [fetchDashboard, fetchList, options]);

  const clearFilters = useCallback(() => {
    applyFilters(INITIAL_FILTERS);
  }, [applyFilters]);

  useEffect(() => {
    void fetchDashboard(toDashboardParams(INITIAL_FILTERS, {
      payers: [], subcategories: [], institutions: [], isLoading: false, error: null,
    }));
    void fetchList(toListFilters(INITIAL_FILTERS, {
      payers: [], subcategories: [], institutions: [], isLoading: false, error: null,
    }));
  }, [fetchDashboard, fetchList]);

  const handlePageChange = useCallback((page: number) => {
    // `goToPage` clamps the page and skips a redundant fetch while loading.
    void goToPage(page, listFilters);
  }, [goToPage, listFilters]);

  return (
    <div className="w-full space-y-6">
      <PageSectionHeader
        badge="receipt.payment.title"
        title={resolve('receipt.payment.title')}
        subtitle={periodLabel}
      />

      {options.error ? (
        <Text size="sm" color="text-[color:var(--app-negative,#dc2626)]" role="alert">
          {options.error}
        </Text>
      ) : null}

      <PaymentFilters
        options={options}
        values={filters}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      {status === 'loading' ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-8" role="status">
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">receipt.payment.loading</Text>
        </div>
      ) : status === 'error' ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-2xl border border-[color:var(--app-negative,#dc2626)] bg-[color:var(--app-surface,#ffffff)] p-8 text-center" role="alert">
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
            receipt.payment.dashboard.error
          </Text>
          <Button type="button" tone="primary" onClick={() => void retry()}>
            receipt.payment.dashboard.retry
          </Button>
        </div>
      ) : status === 'empty' ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-8 text-center">
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">
            receipt.payment.dashboard.no_data
          </Text>
        </div>
      ) : dashboard ? (
        <div className="space-y-6">
          <PaymentSummary summary={dashboard.summary} />

          <PaymentMonthlyChart data={dashboard.monthly} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <PaymentSubcategoriesChart data={dashboard.subcategories} />
            <PaymentInstitutionsChart data={dashboard.institutions} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <PaymentPayersRanking data={dashboard.payers} />
            <PaymentBeneficiariesRanking data={dashboard.beneficiaries} />
          </div>
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Text
            as="h3"
            size="lg"
            weight="semibold"
            color="text-[color:var(--app-text,#0f172a)]"
          >
            receipt.payment.list.title
          </Text>
          <PaymentViewToggle view={view} onChange={setView} />
        </div>

        {isListLoading ? (
          <Text size="sm" color="text-[color:var(--app-text-muted,#64748b)]">receipt.payment.loading</Text>
        ) : items.length === 0 ? (
          <EmptyList
            title={resolve('receipt.payment.empty')}
            subtitle={resolve('receipt.payment.dashboard.no_data')}
          />
        ) : view === 'table' ? (
          <PaymentTable items={items} />
        ) : (
          <PaymentCards items={items} />
        )}

        {meta && items.length > 0 && meta.total_pages > 1 ? (
          <Pagination
            isLoading={isListLoading}
            totalPages={meta.total_pages}
            currentPage={meta.current_page}
            onPageChange={handlePageChange}
          />
        ) : null}
      </section>
    </div>
  );
}