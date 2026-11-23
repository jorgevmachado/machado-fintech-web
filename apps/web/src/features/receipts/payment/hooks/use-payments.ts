'use client';
import { useCallback ,useState } from 'react';

import { type TPaginatedMeta } from '@fintech/shared';
import { useLoading ,useAlert ,TAlertActionOptions } from '@fintech/ui';

import { Payment ,TPaymentFilter } from '../domain';
import { paymentService } from '../services';

const messagePrefix = 'receipt.payment';

/** Read-only list: the payments endpoint exposes no create, update or delete. */
export default function usePayments() {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<Payment>>([]);

  const fetchList = useCallback(async (params?: TPaymentFilter, options?: TAlertActionOptions) => {
    await execute(async () => {
      const response = await paymentService.fetchList({
        ...params,
        ...(params?.page && !params?.limit ? { limit: '10' } : {}),
      });
      executeServiceAlert({
        isOk: response.isOk,
        type: 'list',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });

      const instance = response.instance;
      if (!instance) {
        return;
      }

      if (Array.isArray(instance)) {
        setItems(instance);
        return;
      }
      setMeta(instance.meta);
      setItems(instance.items);
    });
  }, [execute, executeServiceAlert]);

  const clampPage = useCallback((page: number, totalPages: number) => {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }, []);

  const goToPage = useCallback(async (
    page: number,
    params?: TPaymentFilter,
    options?: TAlertActionOptions,
  ) => {
    const targetPage = clampPage(page, meta?.total_pages ?? 1);

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await fetchList({ ...params, page: targetPage.toString() }, options);
  }, [clampPage, fetchList, isLoading, meta?.current_page, meta?.total_pages]);

  const refresh = useCallback(async (params?: TPaymentFilter) => {
    if (isLoading) {
      return;
    }

    await fetchList(params);
  }, [fetchList, isLoading]);

  return { meta, refresh, goToPage, isLoading, items, fetchList };
}