import {
  CrudService ,
  HttpClient ,
  Result ,
  TPaginatedListResponse,
} from '@fintech/shared';

import {
  Receipt ,
  TReceiptApiData ,TReceiptBatch ,
  TReceiptFilter ,TReceiptPersist ,
} from '../domain';
import { receiptMapper } from '../mappers/receipt.mapper';

export class ReceiptService extends CrudService<TReceiptApiData ,Receipt ,TReceiptFilter> {

  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/receipts';

  protected toMapperEntity(result: Result<TReceiptApiData>): Result<Receipt> {
    return receiptMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TPaginatedListResponse<TReceiptApiData> | Array<TReceiptApiData>> ,
  ): Result<TPaginatedListResponse<Receipt> | Array<Receipt>> {
    return receiptMapper.mapJsonListResult(result);
  }

  public async persist(data: Partial<TReceiptPersist>): Promise<Result<{ message: string }>> {
    return HttpClient.put<{ message: string }>({
      path: this.pathUrl,
      baseUrl: this.baseUrl,
      config: {
        body: this.toBody(data),
      },
    });
  }

  public async batchUpload(files: Array<File>): Promise<Result<TReceiptBatch>> {
    if (!files.length) {
      return Result.fail('receipt.batch.no_files');
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return HttpClient.post<TReceiptBatch>({
      path: `${this.pathUrl}/batch`,
      baseUrl: this.baseUrl,
      config: {
        body: formData,
      },
    });
  }

  public async confirm(data: Partial<TReceiptPersist>): Promise<Result<{ message: string }>> {
    return HttpClient.post<{ message: string }>({
      path: this.pathUrl,
      baseUrl: this.baseUrl,
      config: {
        body: this.toBody(data),
      },
    });
  }
}

export const receiptService = new ReceiptService();