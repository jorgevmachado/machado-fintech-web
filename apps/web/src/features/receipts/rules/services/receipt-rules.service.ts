import {
  CrudService,
  HttpClient,
  Result,
  TPaginatedListResponse,
} from '@fintech/shared';

import {
  ReceiptRules,
  TReceiptFieldRule,
  TReceiptRulesApiData,
  TReceiptRulesFilter,
  TReceiptRulesPersist,
  TReceiptRulesSeedResult,
} from '../domain';
import { receiptRulesMapper } from '../mappers/receipt-rules.mapper';

/**
 * Reconcile de `field_rules`: item com `id` atualiza, sem `id` cria, e o que existe no banco
 * mas não vier no array é apagado. O `id` só vai quando existe — o backend rejeita `id: null`.
 */
function toFieldRulesBody(rules: TReceiptFieldRule[]): unknown[] {
  return rules.map((rule) => ({
    ...(rule.id ? { id: rule.id } : {}),
    field_name: rule.field_name,
    configuration: rule.configuration,
    is_active: rule.is_active,
  }));
}

export class ReceiptRulesService extends CrudService<
  TReceiptRulesApiData,
  ReceiptRules,
  TReceiptRulesFilter,
  TReceiptRulesPersist
> {
  protected readonly baseUrl = '/api';
  protected readonly pathUrl = '/receipts/rules';

  protected toMapperEntity(
    result: Result<TReceiptRulesApiData>,
  ): Result<ReceiptRules> {
    return receiptRulesMapper.mapJsonResult(result);
  }

  protected toMapperEntityList(
    result: Result<
      TPaginatedListResponse<TReceiptRulesApiData> | Array<TReceiptRulesApiData>
    >,
  ): Result<TPaginatedListResponse<ReceiptRules> | Array<ReceiptRules>> {
    return receiptRulesMapper.mapJsonListResult(result);
  }

  /**
   * Monta o body do POST/PUT do perfil.
   *
   * `identification_rules` é reconciliada: item com `id` atualiza, sem `id` cria, e o que
   * existe no banco mas não vier no array é apagado. O `id` só vai quando existe — o
   * backend rejeita `id: null`.
   *
   * `field_rules` só vai quando o chamador a define (`persistFieldRules`). O formulário do
   * perfil não a define, e no PUT a chave ausente preserva as regras existentes
   * (`exclude_unset`) — enviá-la vazia apagaria o que outro formulário acabou de gravar.
   *
   * `institution_id` só vai no POST: o PUT usa `extra="forbid"` e responderia 422.
   */
  protected toBody(data: TReceiptRulesPersist): unknown {
    const identification_rules = data.identification_rules.map((rule) => ({
      ...(rule.id ? { id: rule.id } : {}),
      pattern: rule.pattern.trim(),
      weight: rule.weight,
      is_active: rule.is_active,
    }));

    if (data.id) {
      return {
        name: data.name,
        is_active: data.is_active,
        identification_rules,
        ...(data.field_rules ? { field_rules: toFieldRulesBody(data.field_rules) } : {}),
      };
    }

    return {
      name: data.name,
      institution_id: data.institution_id,
      is_active: data.is_active,
      identification_rules,
    };
  }

  /**
   * Persiste a coleção completa de `field_rules` de um perfil.
   *
   * É reconciliação, então o array enviado vira o conjunto vivo: quem chama precisa mandar
   * todas as regras que devem sobreviver. Por isso recebe o perfil inteiro e substitui só
   * `field_rules` no body, mantendo nome/`is_active`/`identification_rules` como estão.
   */
  public async persistFieldRules(
    profile: ReceiptRules,
    fieldRules: TReceiptFieldRule[],
  ): Promise<Result<{ message: string }>> {
    // `id` precisa ir no payload: é o que faz `toBody` escolher o branch de atualização —
    // sem ele o body sai como criação e `field_rules` é descartado.
    return this.update(profile.id, {
      id: profile.id,
      name: profile.name,
      is_active: profile.is_active,
      identification_rules: profile.identification_rules,
      field_rules: fieldRules,
    });
  }

  /** Carrega os perfis padrão (`Default`, Nubank, Itaú, Caixa) para o usuário logado. */
  public async seed(): Promise<Result<TReceiptRulesSeedResult>> {
    return HttpClient.post<TReceiptRulesSeedResult>({
      path: `${this.pathUrl}/seed`,
      baseUrl: this.baseUrl,
      config: { body: {} },
    });
  }
}

export const receiptRulesService = new ReceiptRulesService();