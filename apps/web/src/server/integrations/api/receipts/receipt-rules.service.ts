import 'server-only';

import { CrudService, HttpClient, Result } from '@fintech/shared';

import { FINANCE_API_BASE_URL } from '../config';
import type {
  TReceiptRulesApiData,
  TReceiptRulesPersist,
  TReceiptRulesSeedResult,
} from '@/src/features/receipts/rules/domain';

/**
 * Cliente server-side do agregado de regras de interpretação de recibos.
 *
 * Não usa `mapEmptyStringsToNull`: `pattern: ''` viraria `null` e o backend responderia
 * 422 em vez de erro de validação claro. A normalização acontece no `toBody` do cliente.
 */
export class ReceiptRulesApiService extends CrudService<
  TReceiptRulesApiData,
  TReceiptRulesApiData,
  Record<string, string>,
  TReceiptRulesPersist
> {
  protected readonly baseUrl = FINANCE_API_BASE_URL;
  protected readonly pathUrl = '/receipts/rules';

  protected toBody(data: TReceiptRulesPersist): unknown {
    return data;
  }

  public async seed(token: string): Promise<Result<TReceiptRulesSeedResult>> {
    return HttpClient.post<TReceiptRulesSeedResult>({
      path: `${this.pathUrl}/seed`,
      baseUrl: this.baseUrl,
      config: { body: {}, token },
    });
  }
}

export const receiptRulesApiService = new ReceiptRulesApiService();