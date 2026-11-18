import 'server-only';

import { CrudService } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TBeneficiaryApiData,
  TBeneficiaryPersist,
} from '@/src/features/beneficiary/domain';

export class BeneficiaryApiService extends CrudService<
  TBeneficiaryApiData,
  TBeneficiaryApiData,
  Record<string, string>,
  Omit<TBeneficiaryPersist, 'id'>
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/beneficiaries';

  protected toBody(data: Omit<TBeneficiaryPersist, 'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const beneficiaryApiService = new BeneficiaryApiService();