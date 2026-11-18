import { CrudService ,Result ,TPaginatedListResponse  } from '@fintech/shared';

import {
  CreditCard ,
  TCreditCardApiData ,
  TCreditCardFilter ,
  TCreditCardPersist ,
} from '@/src/features/credit-card/domain';

import {
  creditCardMapper ,
} from '@/src/features/credit-card/mappers/credit-card.mapper';

export class CreditCardService extends CrudService<TCreditCardApiData ,CreditCard ,TCreditCardFilter ,TCreditCardPersist> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/credit-cards';

  protected toMapperEntity(result: Result<TCreditCardApiData>): Result<CreditCard> {
    return creditCardMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TPaginatedListResponse<TCreditCardApiData> | Array<TCreditCardApiData>> ,
  ): Result<TPaginatedListResponse<CreditCard> | Array<CreditCard>> {
    return creditCardMapper.mapJsonListResult(result);
  }
}

export const creditCardService = new CreditCardService();