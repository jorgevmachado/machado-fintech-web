'use client';
import { useCallback ,useMemo ,useState } from 'react';

import { type TPaginatedMeta } from '@fintech/shared';
import { useLoading ,useAlert ,TAlertActionOptions } from '@fintech/ui';

import { Category ,TCategoryFilter ,TCategoryPersist } from '../domain';
import { categoryService } from '../services';

const messagePrefix = 'category';

export default function useCategories() {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<Category>>([]);
  
  const fetchList = useCallback(async (params?: TCategoryFilter, options?: TAlertActionOptions) => {
    return await execute(async () => {
      const response = await categoryService.fetchList({
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
        return {
          items: [],
          meta: undefined,
        };
      }
      
      if (Array.isArray(instance)) {
        setItems(instance);
        return {
          items: instance,
          meta: undefined,
        };
      }
      setMeta(instance.meta);
      setItems(instance.items);
      return {
        items: instance.items,
        meta: instance.meta,
      };
    })
  }, [execute, executeServiceAlert]);

  const clampPage = useCallback((page: number, totalPages: number) => {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }, []);

  const goToPage = useCallback(async (
    page: number,
    params?: TCategoryFilter,
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


  const create = useCallback(async (item: TCategoryPersist, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await categoryService.create(item);
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

  const update = useCallback(async (item: TCategoryPersist, options?: TAlertActionOptions) => {
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
      const response = await categoryService.update(identifier, item);
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

  const persist = useCallback(async (item: TCategoryPersist, options?: TAlertActionOptions) => {
    return item.id ? update(item, options) : create(item, options);
  }, [create, update]);

  const remove = useCallback(async (identifier: string, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await categoryService.delete(identifier);
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

  const activeCategories = useMemo(() => {
    return items.filter((category) => category.is_active);
  }, [items]);

  const activeSubcategories = useMemo(() => {
    if(!activeCategories || activeCategories.length === 0) {
      return [];
    }
    return activeCategories.flatMap((category) =>
      [...category.subcategories]
      .filter((subcategory) => subcategory.is_active)
      .sort((left, right) => left.order - right.order)
    );
  }, [activeCategories]);

  const subcategoryOptions = useMemo(() => {
    return activeCategories
    .filter((category) => category.is_active)
    .flatMap((category) =>
      [...category.subcategories]
      .filter((subcategory) => subcategory.is_active)
      .sort((left, right) => left.order - right.order)
      .map((subcategory) => ({ label: `${category.name} › ${subcategory.name}`, value: subcategory.id })),
    )
  }, [activeCategories]);

  return { meta, persist, refresh, goToPage, isLoading, items, fetchList, remove, activeCategories, activeSubcategories, subcategoryOptions };
}