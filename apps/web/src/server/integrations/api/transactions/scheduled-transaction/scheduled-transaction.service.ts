import 'server-only';

import { CrudService ,HttpClient ,Result ,type TCrudList  } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../../config';

import {
  TScheduledTransactionApiData,
} from '@/src/features/transactions/scheduled-transaction';
import { TScheduledTransactionApiPersist } from './types';

/**
 * Every occurrence route hangs under its series: `/transactions/scheduled/:seriesId`.
 * A projected occurrence is stored by `POST` on the series and, from then on, read,
 * updated and discarded by its own identifier.
 */
export class ScheduledTransactionApiService extends CrudService<
  TScheduledTransactionApiData ,
  TScheduledTransactionApiData ,
  Record<string ,string> ,
  Omit<TScheduledTransactionApiPersist ,'id'>
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/transactions/scheduled';

  protected toBody(data: Omit<TScheduledTransactionApiPersist ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }

  public async fetchListBySeries(
    seriesId: string,
    params?: Record<string ,string> ,
    token?: string ,
  ): Promise<Result<TCrudList<TScheduledTransactionApiData>>> {
    return HttpClient.get<TCrudList<TScheduledTransactionApiData>>({
      path: `${this.pathUrl}/${seriesId}`,
      baseUrl: this.baseUrl,
      config: { params, ...(token ? { token } : {}) },
    });
  }

  public async fetchOccurrence(
    seriesId: string,
    identifier: string,
    token?: string ,
  ): Promise<Result<TScheduledTransactionApiData>> {
    return HttpClient.get<TScheduledTransactionApiData>({
      path: `${this.pathUrl}/${seriesId}/${identifier}`,
      baseUrl: this.baseUrl,
      config: { ...(token ? { token } : {}) },
    });
  }

  public async createOccurrence(
    seriesId: string,
    data: Omit<TScheduledTransactionApiPersist ,'id'> ,
    token?: string ,
  ): Promise<Result<TScheduledTransactionApiData>> {
    return HttpClient.post<TScheduledTransactionApiData>({
      path: `${this.pathUrl}/${seriesId}`,
      baseUrl: this.baseUrl,
      config: { body: this.toBody(data), ...(token ? { token } : {}) },
    });
  }

  public async updateOccurrence(
    seriesId: string,
    identifier: string,
    data: Omit<TScheduledTransactionApiPersist ,'id'> ,
    token?: string ,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `${this.pathUrl}/${seriesId}/${identifier}`,
      baseUrl: this.baseUrl,
      config: { body: this.toBody(data), ...(token ? { token } : {}) },
    });
  }

  public async deleteOccurrence(
    seriesId: string,
    identifier: string,
    token?: string ,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `${this.pathUrl}/${seriesId}/${identifier}`,
      baseUrl: this.baseUrl,
      config: { ...(token ? { token } : {}) },
    });
  }
}

export const scheduledTransactionApiService = new ScheduledTransactionApiService();