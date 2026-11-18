import {
  CrudService ,
  type Result as TResult ,
  type TCrudList ,
} from '@fintech/shared';

import {
  Institution ,
  TInstitutionApiData ,
  TInstitutionFilter ,
  TInstitutionPersist,
} from '../domain';
import {
  institutionMapper,
} from '@/src/features/institution/mappers/institution.mapper';

export class InstitutionService extends CrudService<TInstitutionApiData, Institution ,TInstitutionFilter ,TInstitutionPersist> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/institutions';

  protected toMapperEntity(result: TResult<TInstitutionApiData>): TResult<Institution> {
    return institutionMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: TResult<TCrudList<TInstitutionApiData>> ,
  ): TResult<TCrudList<Institution>> {
    return institutionMapper.mapJsonListResult(result);
  }
}

export const institutionService = new InstitutionService();