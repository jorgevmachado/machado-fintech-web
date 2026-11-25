import { DateVO } from '@fintech/shared';

import {
  ReceiptTransactionKindMap ,
  type TReceiptConfirm ,
  type TReceiptPersist,
} from '../../domain';

/** Valores do formulário de confirmação: o controller do `Form` só trabalha com strings. */
export type TReceiptConfirmFormValues = Record<string, string>;

/**
 * O confirm carrega os campos do recibo além do lançamento a criar: o BFF exige
 * `payer`, `beneficiary`, `paid_amount`, `payment_date` e `source_institution`
 * como obrigatórios, e nenhum deles é editável no formulário de confirmação.
 * Por isso o payload parte do item da lista e sobrescreve só o que o usuário
 * escolheu ali — montar o objeto apenas com os campos do formulário faria o BFF
 * recusar com 400 antes de chegar à API.
 *
 * `payer` costuma vir vazio do recibo e é obrigatório na API; `payerFallback`
 * recebe o nome do usuário logado, mesma regra usada no formulário de edição.
 */
export function toReceiptConfirmPayload(
  item: TReceiptPersist,
  values: TReceiptConfirmFormValues,
  payerFallback?: string,
): TReceiptConfirm {
  const note = (values.note ?? '').trim();

  return {
    ...item,
    payer: item.payer || payerFallback || '',
    name: (values.name ?? '').trim(),
    account_id: values.account_id ?? '',
    direction: (values.direction || undefined) as TReceiptConfirm['direction'],
    // O formulário manda `YYYY-MM-DD`; o service converte de volta para a API.
    expected_on: DateVO.format.dateStringToDate(values.expected_on) ?? item.payment_date ?? new Date(),
    credit_card_id: values.credit_card_id || undefined,
    subcategory_id: values.subcategory_id || item.subcategory_id,
    note: note || undefined,
    transaction_kind: ReceiptTransactionKindMap.SIMPLE,
  };
}