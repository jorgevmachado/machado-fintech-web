import 'server-only';

import { CrudService } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../../config';
import type {
  TStatementApiData ,
} from '@/src/features/transactions/statement/domain';

export class StatementApiService extends CrudService<
  TStatementApiData ,
  TStatementApiData ,
  Record<string ,string> ,
  Omit<TStatementApiData ,'id'>
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/transactions/statement';

  protected toBody(data: Omit<TStatementApiData ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const statementApiService = new StatementApiService();
