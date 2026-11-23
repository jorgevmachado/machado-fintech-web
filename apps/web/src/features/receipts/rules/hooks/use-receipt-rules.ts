'use client';
import { useCallback, useState } from 'react';

import { type TPaginatedMeta } from '@fintech/shared';
import { TAlertActionOptions, useAlert, useLoading } from '@fintech/ui';

import {
  ReceiptRules,
  TReceiptFieldRule,
  TReceiptRulesFilter,
  TReceiptRulesPersist,
} from '../domain';
import { receiptRulesService } from '../services';

const messagePrefix = 'receipt.rules';

export default function useReceiptRules() {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<ReceiptRules>>([]);

  const fetchList = useCallback(
    async (params?: TReceiptRulesFilter, options?: TAlertActionOptions) => {
      await execute(async () => {
        const response = await receiptRulesService.fetchList({
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
    },
    [execute, executeServiceAlert],
  );

  const clampPage = useCallback((page: number, totalPages: number) => {
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }, []);

  const goToPage = useCallback(
    async (
      page: number,
      params?: TReceiptRulesFilter,
      options?: TAlertActionOptions,
    ) => {
      const targetPage = clampPage(page, meta?.total_pages ?? 1);

      if (targetPage === meta?.current_page || isLoading) {
        return;
      }

      await fetchList({ ...params, page: page.toString() }, options);
    },
    [clampPage, fetchList, isLoading, meta?.current_page, meta?.total_pages],
  );

  const refresh = useCallback(async () => {
    if (isLoading) {
      return;
    }

    await fetchList();
  }, [fetchList, isLoading]);

  const create = useCallback(
    async (item: TReceiptRulesPersist, options?: TAlertActionOptions) => {
      return execute(async () => {
        const response = await receiptRulesService.create(item);
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
    },
    [execute, executeServiceAlert, refresh],
  );

  const update = useCallback(
    async (item: TReceiptRulesPersist, options?: TAlertActionOptions) => {
      const identifier = item.id;
      if (!identifier) {
        executeServiceAlert({
          isOk: false,
          type: 'update',
          alert: options?.alert,
          defaultAlert: 'error',
          errorMessage: options?.errorMessage,
          messagePrefix,
          successMessage: options?.successMessage,
        });
        return;
      }

      return execute(async () => {
        const response = await receiptRulesService.update(identifier, item);
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
    },
    [execute, executeServiceAlert, refresh],
  );

  const persist = useCallback(
    async (item: TReceiptRulesPersist, options?: TAlertActionOptions) => {
      return item.id ? update(item, options) : create(item, options);
    },
    [create, update],
  );

  const remove = useCallback(
    async (identifier: string, options?: TAlertActionOptions) => {
      return execute(async () => {
        const response = await receiptRulesService.delete(identifier);
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
    },
    [execute, executeServiceAlert, refresh],
  );

  /**
   * Persiste a coleção inteira de `field_rules` do perfil. É reconciliação: o array enviado
   * vira o conjunto vivo, então quem chama manda todas as regras que devem sobreviver.
   */
  const persistFieldRules = useCallback(
    async (
      profile: ReceiptRules,
      fieldRules: TReceiptFieldRule[],
      options?: TAlertActionOptions,
    ) => {
      return execute(async () => {
        const response = await receiptRulesService.persistFieldRules(
          profile,
          fieldRules,
        );
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
    },
    [execute, executeServiceAlert, refresh],
  );

  const seed = useCallback(
    async (options?: TAlertActionOptions) => {
      return execute(async () => {
        const response = await receiptRulesService.seed();
        // `seed` não é create/update/delete: usa mensagens próprias em vez do prefixo.
        executeServiceAlert({
          isOk: response.isOk,
          type: 'seed',
          alert: options?.alert,
          defaultAlert: 'both',
          errorMessage: options?.errorMessage ?? 'receipt.rules.seed.error',
          successMessage: options?.successMessage ?? 'receipt.rules.seed.success',
        });
        if (response.isOk) {
          await refresh();
        }
        return response.instance;
      });
    },
    [execute, executeServiceAlert, refresh],
  );

  return {
    meta,
    persist,
    persistFieldRules,
    seed,
    refresh,
    goToPage,
    isLoading,
    items,
    fetchList,
    remove,
  };
}