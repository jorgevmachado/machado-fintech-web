'use client';
import { useCallback ,useState } from 'react';

import { useAlert } from '@fintech/ui';

import {
  TransactionSeries ,
  TTransactionSeriesPersist,
} from '../domain';
import { transactionSeriesService } from '../services';

/** Response of the request identified by `key`; loading derives from the current key. */
type SeriesRequestState = {
  key: string;
  data: TransactionSeries | null;
  error: string | null;
};

const INITIAL_STATE: SeriesRequestState = { key: '', data: null, error: null };

/**
 * One series at a time, always by its identifier: the only entry point is an
 * occurrence of the statement, which already carries the series it belongs to.
 */
export default function useTransactionSeries(identifier?: string) {
  const { showAlert } = useAlert();
  const [state, setState] = useState<SeriesRequestState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const fetchById = useCallback(async (target: string) => {
    setIsLoading(true);
    try {
      const response = await transactionSeriesService.fetchById(target);

      if (response.isFailure) {
        const message = response.errors.join(' ');
        setState({ key: target, data: null, error: message });
        showAlert({ variant: 'error', message });
        return undefined;
      }

      setState({ key: target, data: response.instance, error: null });
      return response.instance;
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  const persist = useCallback(async (item: TTransactionSeriesPersist) => {
    const response = item.id
      ? await transactionSeriesService.update(item.id, item)
      : await transactionSeriesService.create(item);

    if (response.isFailure) {
      showAlert({ variant: 'error', message: response.errors.join(' ') });
      return undefined;
    }

    showAlert({
      variant: 'success',
      message: item.id ? 'Série atualizada com sucesso.' : 'Série criada com sucesso.',
    });

    return response.instance;
  }, [showAlert]);

  const remove = useCallback(async (target: string) => {
    const response = await transactionSeriesService.delete(target);

    if (response.isFailure) {
      showAlert({ variant: 'error', message: response.errors.join(' ') });
      return false;
    }

    showAlert({ variant: 'success', message: 'Série excluída com sucesso.' });
    return true;
  }, [showAlert]);

  const isCurrent = state.key === identifier;

  return {
    series: isCurrent ? state.data : null,
    error: isCurrent ? state.error : null,
    isLoading,
    fetchById,
    persist,
    remove,
  };
}