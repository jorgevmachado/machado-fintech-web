import { HttpClient ,Result ,TPaginatedListResponse } from '@fintech/shared';

import {
  TCreditCardFilter ,
  CreditCard ,
  TCreditCardApiData,
  TCreditCardPersist,
} from '@/src/features/credit-card/domain';

import {
  mapCreditCardJsonListResult,
  mapCreditCardJsonResult,
} from '@/src/features/credit-card/mappers/credit-card.mapper';

export class CreditCardService {
  public async fetchList(filters?: TCreditCardFilter): Promise<Result<TPaginatedListResponse<CreditCard> | Array<CreditCard>>> {
    const result = await HttpClient.get<
      TPaginatedListResponse<TCreditCardApiData> | Array<TCreditCardApiData>
    >({
      path: '/credit-cards',
      baseUrl: '/api',
      config: { params: {...filters } },
    });

    return mapCreditCardJsonListResult(result);
  }

  public async create(data: TCreditCardPersist): Promise<Result<CreditCard>> {
    const result = await HttpClient.post<TCreditCardApiData>({
      path: '/credit-cards',
      baseUrl: '/api',
      config: { body: data },
    });
    return mapCreditCardJsonResult(result);
  }

  public async update(identifier: string, data: TCreditCardPersist): Promise<Result<CreditCard>> {
    const result = await HttpClient.put<TCreditCardApiData>({
      path: `/credit-cards/${identifier}`,
      baseUrl: '/api',
      config: { body: data },
    });
    return mapCreditCardJsonResult(result);
  }

  public async delete(identifier: string): Promise<Result<{ message: string }>> {
    return await HttpClient.remove<{ message: string }>({
      path: `/credit-cards/${identifier}`,
      baseUrl: '/api',
    });
  }
}

export const creditCardService = new CreditCardService();