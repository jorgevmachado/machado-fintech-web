import 'server-only';

import { CrudService } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TInstitutionApiData ,
  TInstitutionPersist ,
} from '@/src/features/institution/domain';

export class InstitutionApiService extends CrudService<TInstitutionApiData ,TInstitutionApiData ,Record<string ,string> ,Omit<TInstitutionPersist ,'id'>> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/institutions';

  protected toBody(data: Omit<TInstitutionPersist ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const institutionApiService = new InstitutionApiService();
