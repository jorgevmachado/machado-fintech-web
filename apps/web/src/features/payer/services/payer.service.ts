import { CrudService ,Result ,type TCrudList  } from '@fintech/shared';

import { Payer ,TPayerApiData ,TPayerFilter ,TPayerPersist } from '../domain';
import { payerMapper } from '@/src/features/payer/mappers/payer.mapper';

export class PayerService extends CrudService<TPayerApiData ,Payer ,TPayerFilter ,TPayerPersist> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/payers';

  protected toMapperEntity(result: Result<TPayerApiData>): Result<Payer> {
    return payerMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<TCrudList<TPayerApiData>> ,
  ): Result<TCrudList<Payer>> {
    return payerMapper.mapJsonListResult(result);
  }

}

export const payerService = new PayerService();