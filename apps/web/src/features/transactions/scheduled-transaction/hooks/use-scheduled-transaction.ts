'use client';
import { useCallback ,useState } from 'react';

import { type TPaginatedMeta } from '@fintech/shared';
import { useLoading ,useAlert ,TAlertActionOptions } from '@fintech/ui';

import { ScheduledTransaction ,TScheduledTransactionFilter ,TScheduledTransactionPersist } from '../domain';
import { scheduledTransactionService } from '../services';

const messagePrefix = 'transaction';

export default function useScheduledTransaction() {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<ScheduledTransaction>>([]);

  const fetchList = useCallback(async (seriesId: string, params?: TScheduledTransactionFilter, options?: TAlertActionOptions) => {
    return await execute(async () => {
      const response = await scheduledTransactionService.fetchListBySeries(seriesId, {
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
    })
  }, [execute, executeServiceAlert]);

  const clampPage = useCallback((page: number, totalPages: number) => {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }, []);

  const goToPage = useCallback(async (
    seriesId: string,
    page: number,
    params?: TScheduledTransactionFilter,
    options?: TAlertActionOptions,
  ) => {
    const targetPage = clampPage(page, meta?.total_pages ?? 1);

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await fetchList(seriesId, { ...params, page: page.toString() }, options);
  }, [clampPage, fetchList, isLoading, meta?.current_page, meta?.total_pages]);

  const refresh = useCallback(async (seriesId: string) => {
    if (isLoading) {
      return;
    }

    await fetchList(seriesId);
  }, [fetchList, isLoading]);

  const create = useCallback(async (seriesId: string, item: TScheduledTransactionPersist, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await scheduledTransactionService.createOccurrence(seriesId, item);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'create',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh(seriesId);
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const update = useCallback(async (seriesId: string, item: TScheduledTransactionPersist, options?: TAlertActionOptions) => {
    const identifier = item.id;
    if (!identifier) {
      executeServiceAlert({
        isOk: false,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage ?? 'finance.transaction.update.error.no_id',
        messagePrefix,
        successMessage: options?.successMessage,
      });
      return;
    }

    return execute(async () => {
      const response = await scheduledTransactionService.updateOccurrence(seriesId, identifier, item);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh(seriesId);
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const persist = useCallback(async (seriesId: string, item: TScheduledTransactionPersist, options?: TAlertActionOptions) => {
    return item.id ? update(seriesId, item, options) : create(seriesId, item, options);
  }, [create, update]);

  const remove = useCallback(async (seriesId: string, identifier: string, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await scheduledTransactionService.deleteOccurrence(seriesId, identifier);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'delete',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh(seriesId);
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  return { meta, persist, refresh, goToPage, isLoading, items, fetchList, remove };
}