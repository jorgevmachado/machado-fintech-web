'use client';
import { useCallback ,useState } from 'react';

import { type TPaginatedMeta } from '@fintech/shared';
import { useLoading ,useAlert ,TAlertActionOptions } from '@fintech/ui';

import { Payer ,TPayerFilter ,TPayerPersist } from '../domain';
import { payerService } from '../services';

const messagePrefix = 'payer';

export default function usePayers() {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<Payer>>([]);
  
  const fetchList = useCallback(async (params?: TPayerFilter, options?: TAlertActionOptions) => {
    await execute(async () => {
      const response = await payerService.fetchList({
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
    page: number,
    params?: TPayerFilter,
    options?: TAlertActionOptions,
  ) => {
    const targetPage = clampPage(page, meta?.total_pages ?? 1);

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await fetchList({ ...params, page: page.toString() }, options);
  }, [clampPage, fetchList, isLoading, meta?.current_page, meta?.total_pages]);

  const refresh = useCallback(async () => {
    if (isLoading) {
      return;
    }

    await fetchList();
  }, [fetchList, isLoading]);


  const create = useCallback(async (item: TPayerPersist, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await payerService.create(item);
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
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const update = useCallback(async (item: TPayerPersist, options?: TAlertActionOptions) => {
    const identifier = item.id;
    if (!identifier) {
      executeServiceAlert({
        isOk: false,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage ?? 'payer.update.error',
        messagePrefix,
        successMessage: options?.successMessage,
      });
      return;
    }

    return execute(async () => {
      const response = await payerService.update(identifier, item);
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
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const persist = useCallback(async (item: TPayerPersist, options?: TAlertActionOptions) => {
    return item.id ? update(item, options) : create(item, options);
  }, [create, update]);

  const remove = useCallback(async (identifier: string, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await payerService.delete(identifier);
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
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  return { meta, persist, refresh, goToPage, isLoading, items, fetchList, remove };
}