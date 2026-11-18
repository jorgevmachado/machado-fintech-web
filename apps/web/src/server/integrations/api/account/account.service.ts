import 'server-only';

import { CrudService  } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TAccountApiData ,
  TAccountPersist ,
} from '@/src/features/account/domain';

export class AccountApiService extends CrudService<
  TAccountApiData ,
  TAccountApiData ,
  Record<string ,string> ,
  Omit<TAccountPersist ,'id'>
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/accounts';

  protected toBody(data: Omit<TAccountPersist ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const accountApiService = new AccountApiService();
