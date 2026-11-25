'use client';
import { useCallback ,useState } from 'react';

import { type TPaginatedMeta ,Result } from '@fintech/shared';
import { useLoading ,useAlert ,TAlertActionOptions } from '@fintech/ui';

import {
  Receipt ,
  TReceiptBatch ,
  TReceiptConfirm ,
  TReceiptConfirmConflictApiData ,
  TReceiptConfirmResultApiData ,
  TReceiptFilter ,
  TReceiptPersist,
} from '../domain';
import { receiptService } from '../services';

const messagePrefix = 'receipt';

const GENERIC_HTTP_MESSAGES = new Set([
  'An unexpected error occurred.',
  'Internal Server Error',
]);

/**
 * O service devolve o erro da API como objeto `{ error, message, statusCode }` dentro de
 * `Result.errors`. Sem extrair a mensagem, o alerta cairia sempre na chave i18n genérica
 * e o motivo real da recusa (ex.: campo inválido no confirm) ficaria invisível.
 *
 * Mensagens genéricas do cliente HTTP não servem: elas têm precedência sobre o
 * `messagePrefix` no `executeServiceAlert` e trocariam a chave traduzida por um texto
 * em inglês sem informação. Nesses casos devolve `undefined` para o i18n assumir.
 */
function backendErrorMessage(response: Result<unknown>): string | undefined {
  const [first] = response.errors as Array<unknown>;
  const message = typeof first === 'string'
    ? first
    : first && typeof first === 'object' && 'message' in first
      ? (first as { message: unknown }).message
      : undefined;

  if (typeof message !== 'string' || !message.trim()) {
    return undefined;
  }

  return GENERIC_HTTP_MESSAGES.has(message) ? undefined : message;
}

/** `details` do erro HTTP: o corpo estruturado que o 409 do confirm carrega. */
function conflictOf(response: Result<unknown>): TReceiptConfirmConflictApiData | undefined {
  const [first] = response.errors as Array<unknown>;
  if (!first || typeof first !== 'object' || !('details' in first)) {
    return undefined;
  }

  const details = (first as { details: unknown }).details;
  if (!details || typeof details !== 'object' || !('type' in details)) {
    return undefined;
  }

  return details as TReceiptConfirmConflictApiData;
}

/** Resultado do confirm: conflito não é erro genérico, é um caminho de decisão. */
export type TReceiptConfirmOutcome =
  | { status: 'confirmed'; result: TReceiptConfirmResultApiData }
  | { status: 'conflict'; conflict: TReceiptConfirmConflictApiData }
  | { status: 'failed' };

export default function useReceipts() {
  const { execute, isLoading } = useLoading();
  const { executeServiceAlert } = useAlert();

  const [meta, setMeta] = useState<TPaginatedMeta | undefined>(undefined);
  const [items, setItems] = useState<Array<Receipt>>([]);
  const [receiptBatch, setReceiptBatch] = useState<TReceiptBatch | undefined>(undefined);
  
  const fetchList = useCallback(async (params?: TReceiptFilter, options?: TAlertActionOptions) => {
    await execute(async () => {
      const response = await receiptService.fetchList({
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
    params?: TReceiptFilter,
    options?: TAlertActionOptions,
  ) => {
    const targetPage = clampPage(page, meta?.total_pages ?? 1);

    if (targetPage === meta?.current_page || isLoading) {
      return;
    }

    await fetchList({ ...params, page: targetPage.toString() }, options);
  }, [clampPage, fetchList, isLoading, meta?.current_page, meta?.total_pages]);

  const refresh = useCallback(async () => {
    if (isLoading) {
      return;
    }

    await fetchList();
  }, [fetchList, isLoading]);

  const persist = useCallback(async (item: TReceiptPersist, options?: TAlertActionOptions) => {
    return execute(async () => {
      const response = await receiptService.persist(item);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'update',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        message: response.isOk ? undefined : backendErrorMessage(response),
        messagePrefix,
        successMessage: options?.successMessage,
      });
      if (response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  const confirm = useCallback(async (
    item: TReceiptConfirm,
    options?: TAlertActionOptions,
  ): Promise<TReceiptConfirmOutcome> => {
    return execute(async () => {
      const response = await receiptService.confirm(item);

      if (response.isOk) {
        executeServiceAlert({
          isOk: true,
          type: 'confirm',
          alert: options?.alert,
          defaultAlert: 'both',
          messagePrefix,
          successMessage: options?.successMessage,
        });
        await refresh();
        return { status: 'confirmed', result: response.instance };
      }

      // O 409 de ocorrência existente tem tratamento próprio: pedir consentimento
      // e reenviar. Alertar aqui trataria o conflito como falha e esconderia o
      // caminho de sobrescrita do usuário.
      const conflict = conflictOf(response);
      if (conflict !== undefined) {
        return { status: 'conflict', conflict };
      }

      executeServiceAlert({
        isOk: false,
        type: 'confirm',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        message: backendErrorMessage(response),
        messagePrefix,
      });
      return { status: 'failed' };
    });
  }, [execute, executeServiceAlert, refresh]);

  const batchUpload = useCallback(async (files: Array<File>, options?: TAlertActionOptions) => {

    return await execute(async () => {
      const response = await receiptService.batchUpload(files);
      executeServiceAlert({
        isOk: response.isOk,
        type: 'batch',
        alert: options?.alert,
        defaultAlert: 'both',
        errorMessage: options?.errorMessage,
        messagePrefix: messagePrefix,
        successMessage: options?.successMessage,
      })
      setReceiptBatch(response.instance);
      if (response.isOk) {
        await refresh();
      }
      return response.instance;
    });
  }, [execute, executeServiceAlert, refresh]);

  return { meta, persist, refresh, goToPage, isLoading, items, fetchList, confirm, receiptBatch, batchUpload };
}