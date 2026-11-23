import 'server-only';

import {
  CrudService ,
  HttpClient ,
  Result ,
} from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import { TReceiptApiData ,TReceiptBatch } from '@/src/features/receipts/receipt';

export class ReceiptService extends CrudService<TReceiptApiData ,TReceiptApiData ,Record<string ,string>, TReceiptApiData > {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/receipts';

  protected toBody(data: TReceiptApiData): unknown {
    return Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'id'));
  }

  public async persist(
    data: Partial<TReceiptApiData>,
    token?: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `${this.pathUrl}/${data.id}`,
      baseUrl: this.baseUrl,
      config: {
        body: this.toBody(data as TReceiptApiData),
        ...(token ? { token } : {}),
      },
    });
  }

  public async confirm(
    data: Partial<TReceiptApiData>,
    token?: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.post<{ message: string }>({
      path: `${this.pathUrl}/${data.id}/confirm`,
      baseUrl: this.baseUrl,
      config: {
        body: this.toBody(data as TReceiptApiData),
        ...(token ? { token } : {}),
      },
    });
  }

  public async batchUpload(
    data: FormData,
    token?: string,
  ): Promise<Result<TReceiptBatch>> {
    return HttpClient.post<TReceiptBatch>({
      path: `${this.pathUrl}/batch`,
      baseUrl: this.baseUrl,
      config: {
        body: data,
        ...(token ? { token } : {}),
      },
    });
  }
}

export const receiptApiService = new ReceiptService();
