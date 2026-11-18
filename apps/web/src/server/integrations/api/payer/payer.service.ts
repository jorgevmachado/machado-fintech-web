import 'server-only';

import { CrudService  } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TPayerApiData ,
  TPayerPersist ,
} from '@/src/features/payer/domain';

export class PayerApiService extends CrudService<TPayerApiData ,TPayerApiData ,Record<string ,string> ,Omit<TPayerPersist ,'id'>> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/payers';

  protected toBody(data: Omit<TPayerPersist ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const payerApiService = new PayerApiService();
