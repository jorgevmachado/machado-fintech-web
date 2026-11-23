import { CrudService ,HttpClient ,Result ,type TCrudList  } from '@fintech/shared';

import {
  Payment ,
  TPaymentApiData ,
  TPaymentDashboard ,
  TPaymentDashboardApiData ,
  TPaymentDashboardParams ,
  TPaymentFilter ,
  TPaymentPersist,
} from '../domain';
import { paymentMapper } from '../mappers/payment.mapper';

export class PaymentService extends CrudService<
  TPaymentApiData ,
  Payment ,
  TPaymentFilter ,
  TPaymentPersist
> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/payments';

  protected toMapperEntity(result: Result<TPaymentApiData>): Result<Payment> {
    return paymentMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TCrudList<TPaymentApiData>> ,
  ): Result<TCrudList<Payment>> {
    return paymentMapper.mapJsonListResult(result);
  }

  /** Dashboard aggregates for a period; the API returns every amount as a decimal string. */
  public async fetchDashboard(
    params: TPaymentDashboardParams,
  ): Promise<Result<TPaymentDashboard>> {
    const response = await HttpClient.get<TPaymentDashboardApiData>({
      path: `${this.pathUrl}/dashboard`,
      baseUrl: this.baseUrl,
      config: { params: { ...params } },
    });

    return paymentMapper.mapDashboardResult(response);
  }
}

export const paymentService = new PaymentService();