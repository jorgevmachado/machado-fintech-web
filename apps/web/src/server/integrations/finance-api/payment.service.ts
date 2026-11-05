import 'server-only';

import { HttpClient, type Result as TResult } from '@fintech/shared';

import type {
  PaymentApiData,
  PaymentApiList,
  PaymentDashboardApiResponse,
  PaymentSummaryCountApiData,
  PaymentSummaryMaxApiData,
  PaymentSummaryTotalApiData,
  PaymentUpdateApiBody,
} from './contracts/payment.contracts';
import { FINANCE_API_BASE_URL } from './config';

export class PaymentApiService {
  public async fetchList(
    token: string,
    params: Record<string, string>,
  ): Promise<TResult<PaymentApiList>> {
    return HttpClient.get<PaymentApiList>({
      path: '/finance/payment',
      baseUrl: FINANCE_API_BASE_URL,
      config: {
        token,
        params,
      },
    });
  }

  public async update(
    token: string,
    identifier: string,
    body: PaymentUpdateApiBody,
  ): Promise<TResult<PaymentApiData>> {
    return HttpClient.put<PaymentApiData>({
      path: `/finance/payment/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body },
    });
  }

  public async fetchCount(
    token: string,
    params?: Record<string, string>,
  ): Promise<TResult<PaymentSummaryCountApiData>> {
    return HttpClient.get<PaymentSummaryCountApiData>({
      path: '/finance/payment/summary/count',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchTotal(
    token: string,
    params?: Record<string, string>,
  ): Promise<TResult<PaymentSummaryTotalApiData>> {
    return HttpClient.get<PaymentSummaryTotalApiData>({
      path: '/finance/payment/summary/total',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchMax(
    token: string,
    params?: Record<string, string>,
  ): Promise<TResult<PaymentSummaryMaxApiData>> {
    return HttpClient.get<PaymentSummaryMaxApiData>({
      path: '/finance/payment/summary/max',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async fetchDashboard(
    token: string,
    params: Record<string, string>,
  ): Promise<TResult<PaymentDashboardApiResponse>> {
    return HttpClient.get<PaymentDashboardApiResponse>({
      path: '/finance/payment/dashboard',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }
}

export const paymentApiService = new PaymentApiService();
