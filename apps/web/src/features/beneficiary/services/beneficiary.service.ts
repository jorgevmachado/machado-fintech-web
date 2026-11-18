import { CrudService, type Result as TResult, type TCrudList } from '@fintech/shared';

import {
  Beneficiary,
  TBeneficiaryApiData,
  TBeneficiaryFilter,
  TBeneficiaryPersist,
} from '../domain';
import { beneficiaryMapper } from '../mappers/beneficiary.mapper';

export class BeneficiaryService extends CrudService<
  TBeneficiaryApiData,
  Beneficiary,
  TBeneficiaryFilter,
  TBeneficiaryPersist
> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/beneficiaries';

  protected toMapperEntity(result: TResult<TBeneficiaryApiData>): TResult<Beneficiary> {
    return beneficiaryMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: TResult<TCrudList<TBeneficiaryApiData>>,
  ): TResult<TCrudList<Beneficiary>> {
    return beneficiaryMapper.mapJsonListResult(result);
  }
}

export const beneficiaryService = new BeneficiaryService();