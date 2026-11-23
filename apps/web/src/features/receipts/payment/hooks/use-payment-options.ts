'use client';

import { useEffect ,useState } from 'react';

import { payerService } from '@/src/features/payer';
import { institutionService } from '@/src/features/institution';
import { categoryService ,type Category } from '@/src/features/category';

/**
 * One option in a filter. The payments endpoints are asymmetric: the list
 * filters by **name** (`payer`, `subcategory`, `source_institution`) while the
 * dashboard filters by **UUID** (`payer_id`, `subcategory_id`, `institution`
 * takes a name). Carrying both keeps a single choice usable by both requests.
 */
export type PaymentFilterOption = {
  /** The UUID — the value sent to the dashboard. */
  value: string;
  /** The name — the value sent to the list. */
  name: string;
  /** What the user reads. */
  label: string;
};

export type PaymentOptions = {
  payers: Array<PaymentFilterOption>;
  subcategories: Array<PaymentFilterOption>;
  institutions: Array<PaymentFilterOption>;
};

export type PaymentOptionsResult = PaymentOptions & {
  isLoading: boolean;
  error: string | null;
};

const OPTIONS_PAGE_SIZE = 100;

const EMPTY_OPTIONS: PaymentOptions = { payers: [], subcategories: [], institutions: [] };

function toSubcategoryOptions(categories: Array<Category>): Array<PaymentFilterOption> {
  return categories
    .filter((category) => category.is_active)
    .flatMap((category) =>
      [...category.subcategories]
        .filter((subcategory) => subcategory.is_active)
        .sort((left, right) => left.order - right.order)
        .map((subcategory) => ({
          value: subcategory.id,
          name: subcategory.name,
          label: `${category.name} › ${subcategory.name}`,
        })),
    );
}

export default function usePaymentOptions(): PaymentOptionsResult {
  const [options, setOptions] = useState<PaymentOptions>(EMPTY_OPTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const params = { page: '1', limit: OPTIONS_PAGE_SIZE.toString() };

    Promise.all([
      payerService.fetchList(params),
      institutionService.fetchList(params),
      categoryService.fetchList(params),
    ])
      .then(([payersResponse, institutionsResponse, categoriesResponse]) => {
        if (!isCurrent) return;

        // A failed fetch is a `Result` failure, not a rejection — surface it,
        // otherwise the selectors render empty with no explanation.
        if (payersResponse.isFailure || institutionsResponse.isFailure || categoriesResponse.isFailure) {
          setError('receipt.payment.filters.error');
          return;
        }

        const payers = payersResponse.instance;
        const institutions = institutionsResponse.instance;
        const categories = categoriesResponse.instance;

        setOptions({
          payers: (Array.isArray(payers) ? payers : payers?.items ?? [])
            .map((payer) => ({ value: payer.id, name: payer.name, label: payer.name })),
          institutions: (Array.isArray(institutions) ? institutions : institutions?.items ?? [])
            .map((institution) => ({
              value: institution.id,
              name: institution.name,
              label: institution.name,
            })),
          subcategories: toSubcategoryOptions(
            Array.isArray(categories) ? categories : categories?.items ?? [],
          ),
        });
        setError(null);
      })
      .catch(() => {
        if (isCurrent) setError('receipt.payment.filters.error');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return { ...options, isLoading, error };
}