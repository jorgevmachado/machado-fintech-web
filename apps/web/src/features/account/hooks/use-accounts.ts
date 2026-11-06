'use client';
import { useCallback ,useState } from 'react';

import { type TPaginatedMeta } from '@fintech/shared';
import { useLoading ,useAlert ,TAlertActionOptions } from '@fintech/ui';

import { Account ,TAccountFilter ,TAccountPersist } from '../domain';
import { accountService } from '../services';

const messagePrefix = 'account';

export default function useAccounts() {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<Account>>([]);
  
  const fetchList = useCallback(async (params?: TAccountFilter, options?: TAlertActionOptions) => {
    await execute(async () => {
      const response = await accountService.fetchList({
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
    params?: TAccountFilter,
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


  const create = useCallback(async (item: TAccountPersist, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await accountService.create(item);
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

  const update = useCallback(async (item: TAccountPersist, options?: TAlertActionOptions) => {
    const identifier = item.id;
    if (!identifier) {
      executeServiceAlert({
        isOk: false,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'error',
        errorMessage: options?.errorMessage ?? 'finance.payer.update.error.no_id',
        messagePrefix,
        successMessage: options?.successMessage,
      });
      return;
    }

    return execute(async () => {
      const response = await accountService.update(identifier, item);
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

  const persist = useCallback(async (item: TAccountPersist, options?: TAlertActionOptions) => {
    return item.id ? update(item, options) : create(item, options);
  }, [create, update]);

  const remove = useCallback(async (identifier: string, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await accountService.delete(identifier);
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