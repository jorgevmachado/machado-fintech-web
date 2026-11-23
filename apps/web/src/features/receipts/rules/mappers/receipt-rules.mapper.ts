import { Mapper, parseDate } from '@fintech/shared';

import {
  ReceiptRules,
  TReceiptFieldRuleSummary,
  TReceiptRulesApiData,
} from '../domain';

const CONTEXT = 'receipt rules';

export class ReceiptRulesMapper extends Mapper<TReceiptRulesApiData, ReceiptRules> {
  public toDomain(data: TReceiptRulesApiData): ReceiptRules {
    return ReceiptRules.create({
      id: data.id,
      name: data.name,
      institution_id: data.institution_id,
      institution_code: data.institution_code,
      scope: data.scope,
      is_active: data.is_active,
      identification_rules: data.identification_rules.map((rule) => ({
        id: rule.id,
        pattern: rule.pattern,
        weight: rule.weight,
        is_active: rule.is_active,
      })),
      field_rules: data.field_rules.map(
        (rule): TReceiptFieldRuleSummary => ({
          id: rule.id,
          field_name: rule.field_name,
          configuration: rule.configuration,
          is_active: rule.is_active,
          created_at: parseDate(rule.created_at, 'field_rules.created_at', CONTEXT),
          updated_at:
            rule.updated_at == null
              ? undefined
              : parseDate(rule.updated_at, 'field_rules.updated_at', CONTEXT),
        }),
      ),
      created_at: parseDate(data.created_at, 'created_at', CONTEXT),
      updated_at:
        data.updated_at == null
          ? undefined
          : parseDate(data.updated_at, 'updated_at', CONTEXT),
    });
  }

  public toJson(data: ReceiptRules): TReceiptRulesApiData {
    return {
      id: data.id,
      name: data.name,
      institution_id: data.institution_id,
      institution_code: data.institution_code,
      scope: data.scope,
      is_active: data.is_active,
      identification_rules: data.identification_rules.map((rule) => ({
        id: rule.id as string,
        pattern: rule.pattern,
        weight: rule.weight,
        is_active: rule.is_active,
      })),
      field_rules: data.field_rules.map((rule) => ({
        id: rule.id,
        field_name: rule.field_name,
        configuration: rule.configuration,
        is_active: rule.is_active,
        created_at: rule.created_at.toISOString(),
        ...(rule.updated_at ? { updated_at: rule.updated_at.toISOString() } : {}),
      })),
      created_at: data.created_at.toISOString(),
      ...(data.updated_at ? { updated_at: data.updated_at.toISOString() } : {}),
    };
  }
}

export const receiptRulesMapper = new ReceiptRulesMapper();