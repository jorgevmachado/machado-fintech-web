import 'server-only';

import { HttpClient, type Result } from '@fintech/shared';

import type {
  ReceiptApiData,
  ReceiptApiList,
  ReceiptBatchApiData,
  ReceiptConfirmApiRequest,
} from './contracts/receipt.contracts';
import { FINANCE_API_BASE_URL } from './config';

export class ReceiptApiService {
  public async fetchList(
    token: string,
    params?: Record<string, string>,
  ): Promise<Result<ReceiptApiList>> {
    return HttpClient.get<ReceiptApiList>({
      path: '/finance/receipt',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, params },
    });
  }

  public async update(
    token: string,
    request: ReceiptConfirmApiRequest,
  ): Promise<Result<ReceiptApiData>> {
    const { id: identifier, ...body } = request;
    return HttpClient.put<ReceiptApiData>({
      path: `/finance/receipt/${identifier}`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body },
    });
  }

  public async batch(
    token: string,
    body: FormData,
  ): Promise<Result<ReceiptBatchApiData>> {
    return HttpClient.post<ReceiptBatchApiData>({
      path: '/finance/receipt/batch',
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body },
    });
  }

  public async confirm(
    token: string,
    request: ReceiptConfirmApiRequest,
  ): Promise<Result<unknown>> {
    const { id: identifier, ...body } = request;
    return HttpClient.post<unknown>({
      path: `/finance/receipt/${identifier}/confirm`,
      baseUrl: FINANCE_API_BASE_URL,
      config: { token, body },
    });
  }
}

export const receiptApiService = new ReceiptApiService();
