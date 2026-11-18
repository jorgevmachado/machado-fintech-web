import 'server-only';

import { CrudService  } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import {
  TCreditCardApiData ,
  TCreditCardPersistApiData,
} from '@/src/features/credit-card/domain';

export class CreditCardApiService extends CrudService<TCreditCardApiData ,TCreditCardApiData ,Record<string ,string> ,Omit<TCreditCardPersistApiData ,'id'>> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/credit-cards';

  protected toBody(data: Omit<TCreditCardPersistApiData ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const creditCardApiService = new CreditCardApiService();
