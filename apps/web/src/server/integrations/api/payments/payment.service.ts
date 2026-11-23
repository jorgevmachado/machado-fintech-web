import 'server-only';

import { CrudService ,HttpClient ,Result } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';

import type {
  TPaymentApiData ,
  TPaymentDashboardApiData,
} from '@/src/features/receipts/payment/domain';

/**
 * Payments are read-only in the Finance API: the BFF only forwards `GET`.
 * The backend mounts them under the receipts router (`/receipts/payments`),
 * while the BFF exposes them to the browser at `/api/payments`.
 */
export class PaymentApiService extends CrudService<
  TPaymentApiData ,
  TPaymentApiData ,
  Record<string ,string> ,
  never
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/receipts/payments';

  public async fetchDashboard(
    params: Record<string ,string> ,
    token: string,
  ): Promise<Result<TPaymentDashboardApiData>> {
    return HttpClient.get<TPaymentDashboardApiData>({
      path: `${this.pathUrl}/dashboard`,
      baseUrl: this.baseUrl,
      config: { params, token },
    });
  }
}

export const paymentApiService = new PaymentApiService();