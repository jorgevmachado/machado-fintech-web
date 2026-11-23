import { DateVO } from '@fintech/shared';

import {
  TReceiptFieldRuleSummary,
  TReceiptIdentificationRule,
  TReceiptRuleScope,
  TReceiptRules,
} from './types';

export class ReceiptRules {
  public readonly id: string;
  public readonly name: string;
  public readonly institution_id: string | null;
  public readonly institution_code: string | null;
  public readonly scope: TReceiptRuleScope;
  public readonly is_active: boolean;
  public readonly identification_rules: TReceiptIdentificationRule[];
  public readonly field_rules: TReceiptFieldRuleSummary[];
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  constructor(data: TReceiptRules) {
    this.id = data.id;
    this.name = data.name;
    this.institution_id = data.institution_id;
    this.institution_code = data.institution_code;
    this.scope = data.scope;
    this.is_active = data.is_active;
    this.identification_rules = data.identification_rules;
    this.field_rules = data.field_rules;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /** Perfis de sistema (`Default`) não aceitam edição nem exclusão: a API responde 403. */
  public get isReadOnly(): boolean {
    return this.scope === 'system';
  }

  public static create(props: TReceiptRules): ReceiptRules {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid receipt rules created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(
          `Invalid receipt rules updated_at: ${updatedAtResult.error}`,
        );
      }
    }

    return new ReceiptRules(props);
  }
}