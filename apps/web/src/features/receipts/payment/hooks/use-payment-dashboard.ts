'use client';
import { useCallback ,useState } from 'react';

import { useLoading } from '@fintech/ui';

import {
  TPaymentDashboard ,
  TPaymentDashboardParams,
} from '../domain';
import { paymentService } from '../services';

export type PaymentDashboardStatus = 'loading' | 'error' | 'empty' | 'success';

/**
 * The dashboard renders its own error/empty states inline, so this hook keeps
 * the failure on the returned status instead of raising an alert toast.
 */
export default function usePaymentDashboard() {
  const { execute, isLoading } = useLoading();
  const [dashboard, setDashboard] = useState<TPaymentDashboard | undefined>(undefined);
  const [status, setStatus] = useState<PaymentDashboardStatus>('loading');
  const [lastParams, setLastParams] = useState<TPaymentDashboardParams | undefined>(undefined);

  const fetchDashboard = useCallback(async (params: TPaymentDashboardParams) => {
    setLastParams(params);
    setStatus('loading');

    await execute(async () => {
      const response = await paymentService.fetchDashboard(params);

      if (response.isFailure) {
        setDashboard(undefined);
        setStatus('error');
        return;
      }

      setDashboard(response.instance);
      setStatus(response.instance.summary.count === 0 ? 'empty' : 'success');
    });
  }, [execute]);

  /** Repeats the last request — the retry action of the error state. */
  const retry = useCallback(async () => {
    if (lastParams) {
      await fetchDashboard(lastParams);
    }
  }, [fetchDashboard, lastParams]);

  return { dashboard, status, isLoading, fetchDashboard, retry, lastParams };
}