import { CrudService ,Result ,type TCrudList  } from '@fintech/shared';

import {
  Account ,
  TAccountApiData ,
  TAccountFilter ,
  TAccountPersist,
} from '../domain';
import { accountMapper  } from '@/src/features/account/mappers/account.mapper';

export class AccountService extends CrudService<TAccountApiData ,Account ,TAccountFilter ,TAccountPersist> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/accounts';

  protected toMapperEntity(result: Result<TAccountApiData>): Result<Account> {
    return accountMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TCrudList<TAccountApiData>> ,
  ): Result<TCrudList<Account>> {
    return accountMapper.mapJsonListResult(result);
  }
}

export const accountService = new AccountService();