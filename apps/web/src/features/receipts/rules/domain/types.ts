import { TBaseFilter } from '@fintech/ui';
import { TTimestampedApiResource } from '@/src/contracts/finance-api/resources.contracts';

import type {
  TReceiptFieldName,
  TReceiptNormalization,
  TReceiptParser,
} from './enum';

export type TReceiptRuleScope = 'system' | 'private';

/** Regra de identificação: casa um regex no texto do recibo e soma `weight`. */
export type TReceiptIdentificationRule = {
  /** Ausente = cria uma nova regra; presente = atualiza a existente. */
  id?: string;
  pattern: string;
  weight: number;
  is_active: boolean;
};

export type TReceiptTextMapping = {
  contains: string;
  value: string;
};

/** Configuração de regex: a única que aceita `patterns`, `parser` e `normalization`. */
export type TReceiptRegexConfiguration = {
  strategy: 'regex';
  patterns: string[];
  parser: TReceiptParser;
  normalization: TReceiptNormalization;
  /** Só para `effective_payer` (payer) e `document_amount` (paid_amount). */
  fallback_field: 'payer' | 'paid_amount' | null;
};

export type TReceiptConstantConfiguration = {
  strategy: 'constant';
  value: string;
};

export type TReceiptNotFoundConfiguration = {
  strategy: 'not_found';
};

/** `source`: valor fixo quando identificado, com extração opcional e mapeamentos. */
export type TReceiptSourceConfiguration = {
  strategy: 'source';
  identified_value: string;
  matches: TReceiptTextMapping[];
  /** Só texto puro (`parser: 'text'`, `strip`, sem fallback). */
  extraction: TReceiptRegexConfiguration | null;
  mappings: TReceiptTextMapping[];
};

export type TReceiptFieldRuleConfiguration =
  | TReceiptRegexConfiguration
  | TReceiptConstantConfiguration
  | TReceiptNotFoundConfiguration
  | TReceiptSourceConfiguration;

/** `field_rules` são editáveis: cada item é reconciliado por `id` no PUT. */
export type TReceiptFieldRule = {
  /** Ausente = cria uma nova regra; presente = atualiza a existente. */
  id?: string;
  field_name: TReceiptFieldName;
  configuration: TReceiptFieldRuleConfiguration;
  is_active: boolean;
};

/** Item como o backend devolve: sempre tem `id` e datas. */
export type TReceiptFieldRuleApiData = Omit<TReceiptFieldRule, 'id'> & {
  id: string;
  created_at: string;
  updated_at?: string | null;
};

export type TReceiptFieldRuleSummary = TReceiptFieldRule & {
  id: string;
  created_at: Date;
  updated_at?: Date;
};

export type TReceiptRules = {
  id: string;
  name: string;
  institution_id: string | null;
  institution_code: string | null;
  scope: TReceiptRuleScope;
  is_active: boolean;
  identification_rules: TReceiptIdentificationRule[];
  field_rules: TReceiptFieldRuleSummary[];
  created_at: Date;
  updated_at?: Date;
};

export type TReceiptRulesFilter = TBaseFilter & {
  name?: string;
  institution_id?: string;
  is_active?: string;
  scope?: TReceiptRuleScope;
};

export type TReceiptRulesApiData = Omit<
  TReceiptRules,
  'created_at' | 'updated_at' | 'identification_rules' | 'field_rules'
> &
  TTimestampedApiResource & {
    identification_rules: Array<
      Omit<TReceiptIdentificationRule, 'id'> & { id: string }
    >;
    field_rules: TReceiptFieldRuleApiData[];
  };

/**
 * O formulário do perfil não mexe em `field_rules`: elas têm formulário próprio e
 * são persistidas por `ReceiptRulesService.persistFieldRules`. Manter a chave fora
 * do body do perfil é o que preserva as regras de campo numa edição de perfil.
 */
export type TReceiptRulesCreate = {
  name: string;
  institution_id: string;
  is_active: boolean;
  identification_rules: TReceiptIdentificationRule[];
};

export type TReceiptRulesUpdate = {
  name?: string;
  is_active?: boolean;
  identification_rules?: TReceiptIdentificationRule[];
  field_rules?: TReceiptFieldRule[];
  // `institution_id` ausente: não é editável (o backend rejeita com 422).
};

/**
 * Payload de criação/edição do perfil.
 *
 * `field_rules` é opcional e só existe para o fluxo de `persistFieldRules`: o formulário do
 * perfil nunca preenche a chave, e no PUT a chave ausente preserva as regras existentes
 * (`exclude_unset`). Enviar `field_rules: []` apagaria todas.
 */
export type TReceiptRulesPersist = TReceiptRulesCreate & {
  id?: string;
  field_rules?: TReceiptFieldRule[];
};

export type TReceiptRulesSeedResult = {
  created: number;
  skipped: number;
};