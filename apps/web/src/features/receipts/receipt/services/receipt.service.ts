import {
  CrudService ,
  DateVO ,
  HttpClient ,
  Result ,
  TPaginatedListResponse,
} from '@fintech/shared';

import {
  Receipt ,
  TReceiptApiData ,TReceiptBatch ,
  TReceiptConfirm ,
  TReceiptConfirmApiData ,
  TReceiptConfirmResultApiData ,
  TReceiptFilter ,TReceiptPersist ,
} from '../domain';
import { receiptMapper } from '../mappers/receipt.mapper';

export class ReceiptService extends CrudService<TReceiptApiData ,Receipt ,TReceiptFilter> {

  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/receipts';

  protected toMapperEntity(result: Result<TReceiptApiData>): Result<Receipt> {
    return receiptMapper.mapJsonResult(result);
  }

  /** `Date` vira `YYYY-MM-DD`; a API não aceita o ISO completo nos campos de data do confirm. */
  protected toConfirmBody(data: TReceiptConfirm): TReceiptConfirmApiData {
    const { due_date, payment_date, expected_on, ...rest } = data;

    return {
      ...rest,
      ...(due_date === undefined ? {} : { due_date: DateVO.format.dateToDateString(due_date) ?? '' }),
      ...(payment_date === undefined ? {} : { payment_date: DateVO.format.dateToDateString(payment_date) ?? '' }),
      ...(expected_on === undefined ? {} : { expected_on: DateVO.format.dateToDateString(expected_on) ?? '' }),
    } as TReceiptConfirmApiData;
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

  /**
   * Envia a confirmação e devolve o envelope criado. O conflito de ocorrência
   * chega como falha com `statusCode: 409` e `details` preenchido — o chamador
   * decide se pede consentimento e reenvia com `overwrite: true`.
   */
  public async confirm(
    data: TReceiptConfirm,
  ): Promise<Result<TReceiptConfirmResultApiData>> {
    return HttpClient.post<TReceiptConfirmResultApiData, TReceiptConfirmApiData>({
      path: this.pathUrl,
      baseUrl: this.baseUrl,
      config: {
        body: this.toConfirmBody(data),
      },
    });
  }
}

export const receiptService = new ReceiptService();