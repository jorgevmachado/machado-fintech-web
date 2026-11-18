import { CrudService ,HttpClient ,Result ,type TCrudList  } from '@fintech/shared';

import {
  ScheduledTransaction ,
  TScheduledTransactionApiData ,
  TScheduledTransactionFilter ,
  TScheduledTransactionPersist,
} from '../domain';
import { scheduledTransactionMapper } from '../mappers/scheduled-transaction.mapper';

/**
 * Every occurrence route hangs under its series: `/transactions/scheduled/:seriesId`.
 * A projected occurrence has no identifier yet — it is stored through the `POST`
 * of the series, and only then can it be read, updated or discarded by `id`.
 */
export class ScheduledTransactionService extends CrudService<
  TScheduledTransactionApiData ,
  ScheduledTransaction ,
  TScheduledTransactionFilter ,
  TScheduledTransactionPersist
> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/transactions/scheduled';

  protected toMapperEntity(result: Result<TScheduledTransactionApiData>): Result<ScheduledTransaction> {
    return scheduledTransactionMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TCrudList<TScheduledTransactionApiData>> ,
  ): Result<TCrudList<ScheduledTransaction>> {
    return scheduledTransactionMapper.mapJsonListResult(result);
  }

  /** Occurrences already stored for the series. */
  public async fetchListBySeries(
    seriesId: string,
    filters?: TScheduledTransactionFilter,
  ): Promise<Result<TCrudList<ScheduledTransaction>>> {
    const response = await HttpClient.get<TCrudList<TScheduledTransactionApiData>>({
      path: `${this.pathUrl}/${seriesId}`,
      baseUrl: this.baseUrl,
      config: { params: this.toParams(filters) },
    });

    return Result.try(() => this.toMapperEntityList(response));
  }

  public async fetchOccurrence(
    seriesId: string,
    identifier: string,
  ): Promise<Result<ScheduledTransaction>> {
    const response = await HttpClient.get<TScheduledTransactionApiData>({
      path: `${this.pathUrl}/${seriesId}/${identifier}`,
      baseUrl: this.baseUrl,
    });

    return Result.try(() => this.toMapperEntity(response));
  }

  /** Stores a projected occurrence: the series plus `occurrence_index` tell which one it is. */
  public async createOccurrence(
    seriesId: string,
    data: TScheduledTransactionPersist,
  ): Promise<Result<ScheduledTransaction>> {
    const response = await HttpClient.post<TScheduledTransactionApiData>({
      path: `${this.pathUrl}/${seriesId}`,
      baseUrl: this.baseUrl,
      config: { body: this.toBody(data) },
    });

    return Result.try(() => this.toMapperEntity(response));
  }

  /** `PUT` replaces the whole occurrence and answers only a message. */
  public async updateOccurrence(
    seriesId: string,
    identifier: string,
    data: TScheduledTransactionPersist,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: `${this.pathUrl}/${seriesId}/${identifier}`,
      baseUrl: this.baseUrl,
      config: { body: this.toBody(data) },
    });
  }

  /** Discards the stored occurrence, so it follows the series again. */
  public async deleteOccurrence(
    seriesId: string,
    identifier: string,
  ): Promise<Result<{ message: string }>> {
    return HttpClient.remove<{ message: string }>({
      path: `${this.pathUrl}/${seriesId}/${identifier}`,
      baseUrl: this.baseUrl,
    });
  }
}

export const scheduledTransactionService = new ScheduledTransactionService();