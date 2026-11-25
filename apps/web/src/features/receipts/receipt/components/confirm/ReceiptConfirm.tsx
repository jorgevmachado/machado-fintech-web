'use client';
import {
  BaseInputOptions ,
  Form ,
  type FormProps ,
  type FormValidation,
  useAlert,
  useUser,
} from '@fintech/ui';

import { DateVO } from '@fintech/shared';
import { useCallback ,useMemo ,useState } from 'react';
import {
  type TReceiptConfirm ,
  type TReceiptPersist,
} from '@/src/features/receipts/receipt';
import { TransactionDirectionMap } from '@/src/features/transactions/transaction';
import type { TUser } from '@/src/features/auth';

import { toReceiptConfirmPayload } from './receipt-confirm-payload';

const DIRECTION_LABELS: Record<string, string> = {
  [TransactionDirectionMap.IN]: 'Entrada',
  [TransactionDirectionMap.OUT]: 'Saída',
};

/** O id da opção escolhida, ou vazio quando o texto digitado não corresponde a nenhuma. */
function resolveSelectedId(value: string | undefined, options: Array<BaseInputOptions>): string {
  if (!value) {
    return '';
  }

  return options.some((option) => option.value === value) ? value : '';
}

type ReceiptConfirmProps = {
  item: TReceiptPersist;
  onSubmit: (payload: TReceiptConfirm) => Promise<void>;
  onCancel: () => void;
  accountsOptions: Array<BaseInputOptions>;
  isLoadingOptions?: boolean;
  creditCardsOptions: Array<BaseInputOptions>;
  subcategoryOptions: Array<BaseInputOptions>;
}

export default function ReceiptConfirm({
  item,
  onSubmit,
  accountsOptions,
  isLoadingOptions,
  creditCardsOptions,
  onCancel,
  subcategoryOptions,
}: ReceiptConfirmProps) {
  const { showAlert } = useAlert();
  const { user } = useUser<TUser>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: Record<string, string> = useMemo(() => {
    const expected_on = item.due_date ?? item.payment_date ?? new Date();

    return {
      name: item.beneficiary,
      value: item.paid_amount?.toFixed(2) ?? '',
      direction: TransactionDirectionMap.OUT,
      expected_on: DateVO.format.dateToDateString(expected_on) ?? '',
      account_id: '',
      credit_card_id: '',
      subcategory_id: item.subcategory_id ?? '',
      note: item.description ?? '',
    };
  }, [item]);

  const fields: FormProps['fields'] = useMemo(() => [
    {
      type: 'text',
      name: 'name',
      label: 'Nome',
      placeholder: 'Ex: Supermercado',
      required: true,
      value: initialValues.name ?? '',
    },
    {
      // Informativo: o valor confirmado é o `paid_amount` do recibo, não este campo.
      // `required` aqui criaria um erro que o usuário não consegue corrigir.
      type: 'money',
      name: 'value',
      label: 'Valor',
      disabled: true,
      value: initialValues.value ?? '',
    },
    {
      type: 'select',
      name: 'direction',
      label: 'Direção',
      required: true,
      value: initialValues.direction ?? TransactionDirectionMap.OUT,
      options: Object.values(TransactionDirectionMap).map((direction) => ({
        key: direction,
        value: direction,
        label: DIRECTION_LABELS[direction] ?? direction,
      })),
    },
    {
      type: 'date',
      name: 'expected_on',
      label: 'Data prevista',
      required: true,
      value: initialValues.expected_on ?? '',
    },
    {
      type: 'autocomplete',
      name: 'account_id',
      label: 'Conta',
      required: true,
      placeholder: isLoadingOptions ? 'Carregando...' : 'Buscar conta...',
      value: initialValues.account_id ?? '',
      options: accountsOptions.map((option) => ({ key: option.value, label: option.label, value: option.value })),
      presentation: { noResultsText: 'Nenhuma conta encontrada' },
    },
    {
      type: 'select',
      name: 'credit_card_id',
      label: 'Cartão',
      placeholder: 'Sem cartão',
      value: initialValues.credit_card_id ?? '',
      options: [{ key: '', value: '', label: 'Sem cartão' }, ...creditCardsOptions.map((option) => ({ key: option.value, label: option.label, value: option.value }))],
    },
    {
      type: 'autocomplete',
      name: 'subcategory_id',
      label: 'Subcategoria',
      required: true,
      placeholder: isLoadingOptions ? 'Carregando...' : 'Buscar subcategoria...',
      value: initialValues.subcategory_id ?? '',
      options: subcategoryOptions.map((option) => ({ key: option.value, label: option.label, value: option.value })),
      presentation: { noResultsText: 'Nenhuma subcategoria encontrada' },
    },
    {
      type: 'description',
      name: 'note',
      label: 'Observação',
      placeholder: 'Detalhes adicionais sobre a transação',
      required: false,
      validatorConfig: { minLength: 0 },
      value: initialValues.note ?? '',
    },
  ], [accountsOptions, creditCardsOptions, initialValues, isLoadingOptions, subcategoryOptions]);

  const handleOnSuccess = useCallback(async (data: Record<string, string>) => {
    // O autocomplete aceita texto livre; só um id da lista serve como conta.
    const accountId = resolveSelectedId(data.account_id, accountsOptions);
    if (!accountId) {
      showAlert({ variant: 'error', message: 'Selecione uma conta da lista.', position: 'top-right' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(toReceiptConfirmPayload(item, {
        ...data,
        account_id: accountId,
        // Subcategoria inválida volta para a do recibo em vez de derrubar o confirm na API.
        subcategory_id: resolveSelectedId(data.subcategory_id, subcategoryOptions) || item.subcategory_id,
      }, user?.name));
    } finally {
      setIsSubmitting(false);
    }
  }, [accountsOptions, item, onSubmit, showAlert, subcategoryOptions, user?.name]);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error',
      message: validation.errorMessage ?? 'Verifique os campos do formulário.',
      position: 'top-right',
    });
  }, [showAlert]);

  return (
    <Form
      fields={fields}
      layout={{
        cols: 2,
        fields: [
          { name: 'name', span: 2 },
          { name: 'value', span: 1 },
          { name: 'direction', span: 1 },
          { name: 'expected_on', span: 1 },
          { name: 'account_id', span: 1 },
          { name: 'credit_card_id', span: 1 },
          { name: 'subcategory_id', span: 1 },
          { name: 'note', span: 2 },
        ],
      }}
      actions={{
        justify: 'end',
        submit: {
          children: 'receipt.confirm.action',
          isLoading: isSubmitting,
          disabled: isSubmitting,
        },
        cancel: {
          children: 'form.action.cancel',
          onClick: onCancel,
          disabled: isSubmitting,
        },
      }}
      onSuccess={handleOnSuccess}
      onError={handleOnError}
      className="space-y-4"
      initialValues={initialValues}
    />
  )
}