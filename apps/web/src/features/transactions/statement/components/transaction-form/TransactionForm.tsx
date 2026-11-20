'use client';
import { useCallback ,useMemo ,type ReactNode } from 'react';

import { Money } from '@fintech/shared';
import { type FormProps ,type FormValidation ,Form ,useAlert } from '@fintech/ui';

import {
  TransactionDirectionMap ,
  TransactionStatusMap ,
  type TransactionStatusEnum ,
  type TTransactionPersist,
} from '@/src/features/transactions/transaction';
import type { TransactionSelectOption } from '@/src/features/transactions/transaction/hooks/use-transaction-options';
import { TRANSACTION_STATUS_LABELS } from '@/src/features/transactions/statement/components/transaction-status-badge';

const DIRECTION_LABELS: Record<string, string> = {
  [TransactionDirectionMap.IN]: 'Entrada',
  [TransactionDirectionMap.OUT]: 'Saída',
};

const NO_CREDIT_CARD = '';
const NO_SUBCATEGORY = '';

/**
 * The id of the chosen option, or `undefined` when the text typed in the
 * autocomplete does not match any of them — a half-typed name is not an id.
 */
function resolveSelectedId(value: string | undefined, options: TransactionSelectOption[]): string | undefined {
  if (!value) return undefined;

  return options.some((option) => option.value === value) ? value : undefined;
}

/** `Autocomplete` addresses its options by `key`; the domain options only carry `value`/`label`. */
function toAutocompleteOptions(options: TransactionSelectOption[]): Array<{ key: string; value: string; label: string }> {
  return options.map((option) => ({ key: option.value, value: option.value, label: option.label }));
}

/** The editable fields shared by a standalone transaction and an occurrence of a series. */
export type TransactionFormRecord = {
  id?: string;
  name: string;
  note?: string;
  value: number;
  direction: string;
  account: { id: string };
  credit_card?: { id: string };
  subcategory?: { id: string };
  status: string;
  expected_on: Date;
  settled_on?: Date;
};

export type TransactionFormOptions = {
  accounts: TransactionSelectOption[];
  creditCards: TransactionSelectOption[];
  subcategories: TransactionSelectOption[];
};

export type TransactionFormProps = {
  item?: TransactionFormRecord;
  /** Read-only block rendered before the fields (e.g. the series of an occurrence). */
  leadingSection?: ReactNode;
  options: TransactionFormOptions;
  isLoadingOptions?: boolean;
  isSubmitting?: boolean;
  onSubmit: (item: TTransactionPersist) => void;
  onCancel: () => void;
};

/** `YYYY-MM-DD` of a calendar day, built from its parts so no time zone can shift it. */
export function toDateOnlyInput(value?: Date): string {
  if (!value) return '';

  return value.toISOString().slice(0, 10);
}

/**
 * The money input stores digits only and divides them by 100 to format, so the
 * current value goes in as cents (`12.34` → `1234`).
 */
function toMoneyInput(value?: number): string {
  return value === undefined ? '' : String(Math.round(value * 100));
}

function toStatusOptions(): Array<{ value: string; label: string }> {
  return (Object.keys(TRANSACTION_STATUS_LABELS) as TransactionStatusEnum[]).map((status) => ({
    value: status,
    label: TRANSACTION_STATUS_LABELS[status],
  }));
}

/** Every field carries a string; the form controller never sees `undefined`. */
type TransactionFormValues = {
  name: string;
  value: string;
  direction: string;
  expected_on: string;
  status: string;
  settled_on: string;
  account_id: string;
  credit_card_id: string;
  subcategory_id: string;
  note: string;
};

export default function TransactionForm({
  item,
  leadingSection,
  options,
  isLoadingOptions = false,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const { showAlert } = useAlert();

  const initialValues: TransactionFormValues = useMemo(() => ({
    name: item?.name ?? '',
    value: toMoneyInput(item?.value),
    direction: item?.direction ?? TransactionDirectionMap.OUT,
    expected_on: toDateOnlyInput(item?.expected_on) || toDateOnlyInput(new Date()),
    status: item?.status ?? TransactionStatusMap.PENDING,
    settled_on: toDateOnlyInput(item?.settled_on),
    account_id: item?.account.id ?? '',
    credit_card_id: item?.credit_card?.id ?? NO_CREDIT_CARD,
    subcategory_id: item?.subcategory?.id ?? NO_SUBCATEGORY,
    note: item?.note ?? '',
  }), [item]);

  const fields: FormProps['fields'] = useMemo(() => [
    {
      type: 'text',
      name: 'name',
      label: 'Nome',
      placeholder: 'Ex: Supermercado',
      required: true,
      value: initialValues.name,
    },
    {
      type: 'money',
      name: 'value',
      label: 'Valor',
      required: true,
      value: initialValues.value,
    },
    {
      type: 'select',
      name: 'direction',
      label: 'Direção',
      required: true,
      value: initialValues.direction,
      options: Object.values(TransactionDirectionMap).map((direction) => ({
        value: direction,
        label: DIRECTION_LABELS[direction] ?? direction,
      })),
    },
    {
      type: 'date',
      name: 'expected_on',
      label: 'Data prevista',
      required: true,
      value: initialValues.expected_on,
    },
    {
      type: 'autocomplete',
      name: 'account_id',
      label: 'Conta',
      required: true,
      placeholder: isLoadingOptions ? 'Carregando...' : 'Buscar conta...',
      value: initialValues.account_id,
      options: toAutocompleteOptions(options.accounts),
      presentation: { noResultsText: 'Nenhuma conta encontrada' },
    },
    {
      type: 'select',
      name: 'credit_card_id',
      label: 'Cartão',
      placeholder: isLoadingOptions ? 'Carregando...' : 'Sem cartão',
      value: initialValues.credit_card_id,
      options: [{ value: NO_CREDIT_CARD, label: 'Sem cartão' }, ...options.creditCards],
    },
    {
      type: 'autocomplete',
      name: 'subcategory_id',
      label: 'Subcategoria',
      placeholder: isLoadingOptions ? 'Carregando...' : 'Buscar subcategoria...',
      value: initialValues.subcategory_id,
      options: toAutocompleteOptions(options.subcategories),
      presentation: { noResultsText: 'Nenhuma subcategoria encontrada' },
    },
    {
      type: 'select',
      name: 'status',
      label: 'Situação',
      required: true,
      value: initialValues.status,
      options: toStatusOptions(),
    },
    {
      type: 'date',
      name: 'settled_on',
      label: 'Data de efetivação',
      value: initialValues.settled_on,
    },
    {
      type: 'description',
      name: 'note',
      label: 'Observação',
      placeholder: 'Detalhes adicionais sobre a transação',
      required: false,
      // The `description` type validates a minimum length; the note is optional, so empty is valid.
      validatorConfig: { minLength: 0 },
      value: initialValues.note,
    },
  ], [initialValues, isLoadingOptions, options]);

  const handleOnSuccess = useCallback((data: Record<string, string>) => {
    const value = Money.tryCreate(data.value ?? '', { locale: 'pt-BR' });
    if (value.isFailure) {
      showAlert({ variant: 'error', message: 'Valor inválido.', position: 'top-right' });
      return;
    }

    const accountId = resolveSelectedId(data.account_id, options.accounts);
    if (!accountId) {
      showAlert({ variant: 'error', message: 'Selecione uma conta da lista.', position: 'top-right' });
      return;
    }

    const isSettled = data.status === TransactionStatusMap.SETTLED;

    onSubmit({
      id: item?.id,
      name: data.name ?? '',
      note: data.note || undefined,
      value: value.instance.valueNumber,
      direction: (data.direction ?? TransactionDirectionMap.OUT) as TTransactionPersist['direction'],
      account: { id: accountId } as TTransactionPersist['account'],
      credit_card: data.credit_card_id ? ({ id: data.credit_card_id } as TTransactionPersist['credit_card']) : undefined,
      subcategory: resolveSelectedId(data.subcategory_id, options.subcategories)
        ? ({ id: data.subcategory_id } as TTransactionPersist['subcategory'])
        : undefined,
      status: (data.status ?? TransactionStatusMap.PENDING) as TransactionStatusEnum,
      expected_on: data.expected_on ? new Date(`${data.expected_on}T00:00:00.000Z`) : new Date(),
      settled_on: isSettled && data.settled_on ? new Date(`${data.settled_on}T00:00:00.000Z`) : undefined,
    });
  }, [item, onSubmit, options.accounts, options.subcategories, showAlert]);

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
          { name: 'status', span: 1 },
          { name: 'settled_on', span: 1 },
          { name: 'note', span: 2 },
        ],
      }}
      actions={{
        justify: 'end',
        submit: {
          children: item ? 'Salvar alterações' : 'Criar transação',
          isLoading: isSubmitting,
          disabled: isSubmitting,
        },
        cancel: {
          children: 'Cancelar',
          onClick: onCancel,
          disabled: isSubmitting,
        },
      }}
      onSuccess={handleOnSuccess}
      onError={handleOnError}
      className="space-y-4"
      initialValues={initialValues}
    >
      {leadingSection}
    </Form>
  );
}