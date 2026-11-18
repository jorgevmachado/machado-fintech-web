import 'server-only';

import { CrudService } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TCategoryApiData ,
  TCategoryPersist,
} from '@/src/features/category/domain';


export class CategoryApiService extends CrudService<
  TCategoryApiData,
  TCategoryApiData,
  Record<string, string>,
  Omit<TCategoryPersist, 'id'>
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/categories';

  protected toBody(data: Omit<TCategoryPersist ,'id'>): unknown {
    return this.mapEmptyStringsToNull(data);
  }
}

export const categoryApiService = new CategoryApiService();
