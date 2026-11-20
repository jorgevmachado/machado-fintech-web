'use client';
import { useCallback ,useMemo ,useState } from 'react';

import { Money } from '@fintech/shared';
import { type FormProps ,type FormValidation ,Form ,useAlert } from '@fintech/ui';

import {
  TransactionDirectionMap ,
  type TransactionDirectionEnum,
} from '@/src/features/transactions/transaction';
import {
  TransactionFrequencyUnitMap ,
  TransactionKindMap ,
  type TTransactionSeriesPersist,
} from '@/src/features/transactions/transaction-series';
import type { TransactionSelectOption } from '@/src/features/transactions/transaction/hooks/use-transaction-options';
import { FormSection } from '@/src/components';

import {
  buildSchedulePreview ,
  EMPTY_SCHEDULE_PREVIEW ,
  firstOccurrence,
  type TScheduleRule,
} from './schedule-preview';

const DIRECTION_LABELS: Record<TransactionDirectionEnum, string> = {
  [TransactionDirectionMap.IN]: 'Entrada',
  [TransactionDirectionMap.OUT]: 'Saída',
};

export const SERIES_KIND_LABELS: Record<string, string> = {
  [TransactionKindMap.CLOSED]: 'Parcelamento',
  [TransactionKindMap.OPEN]: 'Recorrência',
};

export const FREQUENCY_UNIT_LABELS: Record<string, string> = {
  [TransactionFrequencyUnitMap.WEEK]: 'Semanal',
  [TransactionFrequencyUnitMap.MONTH]: 'Mensal',
  [TransactionFrequencyUnitMap.YEAR]: 'Anual',
};

const WEEK_DAY_LABELS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MAX_INSTALLMENTS = 360;
const MAX_FREQUENCY_INTERVAL = 24;

const NO_CREDIT_CARD = '';
const NO_SUBCATEGORY = '';

export type TransactionSeriesFormRecord = {
  id?: string;
  name: string;
  note?: string;
  value: number;
  direction: string;
  kind: string;
  account: { id: string };
  credit_card?: { id: string };
  subcategory?: { id: string };
  start_date: Date;
  end_date?: Date;
  frequency_unit: string;
  frequency_interval: number;
  week_day?: number;
  day_of_month?: number;
  month?: number;
  installments?: number;
};

export type TransactionSeriesFormOptions = {
  accounts: TransactionSelectOption[];
  creditCards: TransactionSelectOption[];
  subcategories: TransactionSelectOption[];
};

export type TransactionSeriesFormProps = {
  item?: TransactionSeriesFormRecord;
  options: TransactionSeriesFormOptions;
  isLoadingOptions?: boolean;
  isSubmitting?: boolean;
  onSubmit: (item: TTransactionSeriesPersist) => void;
  onCancel: () => void;
};

type TransactionSeriesFormValues = Record<string, string>;

function toDateOnlyInput(value?: Date): string {
  return value ? value.toISOString().slice(0, 10) : '';
}

function toMoneyInput(value?: number): string {
  return value === undefined ? '' : String(Math.round(value * 100));
}

function todayDateOnly(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function toNumber(value: string | undefined): number | undefined {
  const parsed = Number.parseInt(value ?? '', 10);

  return Number.isInteger(parsed) ? parsed : undefined;
}

function toOptions(labels: string[], first = 1): Array<{ value: string; label: string }> {
  return labels.map((label, index) => ({ value: String(index + first), label }));
}

/**
 * The id of the chosen option, or `undefined` when the text typed in the
 * autocomplete does not match any of them — a half-typed name is not an id.
 */
function resolveSelectedId(value: string | undefined, options: TransactionSelectOption[]): string | undefined {
  if (!value) return undefined;

  return options.some((option) => option.value === value) ? value : undefined;
}

/** `Autocomplete` addresses its options by `key`; the domain options only carry `value`/`label`. */
function toAutocompleteOptions(
  options: TransactionSelectOption[],
): Array<{ key: string; value: string; label: string }> {
  return options.map((option) => ({ key: option.value, value: option.value, label: option.label }));
}

/** The rule the preview reads; `undefined` while the frequency is still incomplete. */
function toScheduleRule(values: TransactionSeriesFormValues): TScheduleRule | null {
  const frequencyUnit = values.frequency_unit as TransactionFrequencyUnitValue | undefined;
  const interval = toNumber(values.frequency_interval);
  const startDate = values.start_date;

  if (!frequencyUnit || !startDate || interval === undefined || interval < 1) {
    return null;
  }

  return {
    start_date: startDate,
    frequency_unit: frequencyUnit,
    frequency_interval: interval,
    week_day: toNumber(values.week_day),
    day_of_month: toNumber(values.day_of_month),
    month: toNumber(values.month),
    installments: toNumber(values.installments),
    end_date: values.end_date || undefined,
  };
}

type TransactionFrequencyUnitValue =
  typeof TransactionFrequencyUnitMap[keyof typeof TransactionFrequencyUnitMap];

export default function TransactionSeriesForm({
  item,
  options,
  isLoadingOptions = false,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: TransactionSeriesFormProps) {
  const { showAlert } = useAlert();
  // Kept on mount on purpose: `Form` resets whenever `initialValues` changes.
  const [initialValues] = useState<TransactionSeriesFormValues>(() => ({
    name: item?.name ?? '',
    value: toMoneyInput(item?.value),
    direction: item?.direction ?? TransactionDirectionMap.OUT,
    account_id: item?.account.id ?? '',
    credit_card_id: item?.credit_card?.id ?? NO_CREDIT_CARD,
    subcategory_id: item?.subcategory?.id ?? NO_SUBCATEGORY,
    kind: item?.kind ?? TransactionKindMap.CLOSED,
    start_date: toDateOnlyInput(item?.start_date) || todayDateOnly(),
    end_date: toDateOnlyInput(item?.end_date),
    frequency_unit: item?.frequency_unit ?? TransactionFrequencyUnitMap.MONTH,
    frequency_interval: String(item?.frequency_interval ?? 1),
    week_day: item?.week_day === undefined ? '' : String(item.week_day),
    day_of_month: item?.day_of_month === undefined ? '' : String(item.day_of_month),
    month: item?.month === undefined ? '' : String(item.month),
    installments: item?.installments === undefined ? '' : String(item.installments),
    note: item?.note ?? '',
  }));
  // Mirrors what is typed only to drive the preview and the conditional fields.
  const [values, setValues] = useState<TransactionSeriesFormValues>(initialValues);

  const isClosed = values.kind === TransactionKindMap.CLOSED;
  const frequencyUnit = values.frequency_unit;
  const showWeekDay = frequencyUnit === TransactionFrequencyUnitMap.WEEK;
  const showMonth = frequencyUnit === TransactionFrequencyUnitMap.YEAR;
  const showDayOfMonth =
    frequencyUnit === TransactionFrequencyUnitMap.MONTH || frequencyUnit === TransactionFrequencyUnitMap.YEAR;

  const schedule = useMemo(() => {
    const rule = toScheduleRule(values);
    if (!rule) return EMPTY_SCHEDULE_PREVIEW;

    try {
      return buildSchedulePreview(rule);
    } catch {
      return EMPTY_SCHEDULE_PREVIEW;
    }
  }, [values]);

  const fields: FormProps['fields'] = useMemo(() => {
    const list: FormProps['fields'] = [
      {
        type: 'text',
        name: 'name',
        label: 'Nome',
        placeholder: 'Ex: Aluguel',
        required: true,
        value: values.name ?? '',
      },
      {
        type: 'money',
        name: 'value',
        label: 'Valor',
        required: true,
        value: values.value ?? '',
      },
      {
        type: 'select',
        name: 'direction',
        label: 'Direção',
        required: true,
        value: values.direction ?? TransactionDirectionMap.OUT,
        options: Object.values(TransactionDirectionMap).map((direction) => ({
          value: direction,
          label: DIRECTION_LABELS[direction] ?? direction,
        })),
      },
      {
        type: 'autocomplete',
        name: 'account_id',
        label: 'Conta',
        required: true,
        placeholder: isLoadingOptions ? 'Carregando...' : 'Buscar conta...',
        value: values.account_id ?? '',
        options: toAutocompleteOptions(options.accounts),
        presentation: { noResultsText: 'Nenhuma conta encontrada' },
      },
      {
        type: 'select',
        name: 'credit_card_id',
        label: 'Cartão',
        value: values.credit_card_id ?? NO_CREDIT_CARD,
        options: [{ value: NO_CREDIT_CARD, label: 'Sem cartão' }, ...options.creditCards],
      },
      {
        type: 'autocomplete',
        name: 'subcategory_id',
        label: 'Subcategoria',
        placeholder: 'Buscar subcategoria...',
        value: values.subcategory_id ?? NO_SUBCATEGORY,
        options: toAutocompleteOptions(options.subcategories),
        presentation: { noResultsText: 'Nenhuma subcategoria encontrada' },
      },
      {
        type: 'select',
        name: 'kind',
        label: 'Tipo',
        required: true,
        value: values.kind ?? TransactionKindMap.CLOSED,
        options: Object.entries(SERIES_KIND_LABELS).map(([value, label]) => ({ value, label })),
      },
      {
        type: 'date',
        name: 'start_date',
        label: 'Data de início',
        required: true,
        value: values.start_date ?? '',
      },
      {
        type: 'select',
        name: 'frequency_unit',
        label: 'Frequência',
        required: true,
        value: frequencyUnit ?? TransactionFrequencyUnitMap.MONTH,
        options: Object.entries(FREQUENCY_UNIT_LABELS).map(([value, label]) => ({ value, label })),
      },
      {
        type: 'text',
        name: 'frequency_interval',
        label: 'Intervalo',
        required: true,
        value: values.frequency_interval ?? '1',
      },
    ];

    if (showWeekDay) {
      list.push({
        type: 'select',
        name: 'week_day',
        label: 'Dia da semana',
        required: true,
        value: values.week_day ?? '',
        options: toOptions(WEEK_DAY_LABELS),
      });
    }

    if (showMonth) {
      list.push({
        type: 'select',
        name: 'month',
        label: 'Mês',
        required: true,
        value: values.month ?? '',
        options: toOptions(MONTH_LABELS),
      });
    }

    if (showDayOfMonth) {
      list.push({
        type: 'text',
        name: 'day_of_month',
        label: 'Dia do mês',
        required: true,
        value: values.day_of_month ?? '',
      });
    }

    if (isClosed) {
      list.push({
        type: 'text',
        name: 'installments',
        label: 'Parcelas',
        required: true,
        value: values.installments ?? '',
      });
    } else {
      list.push({
        type: 'date',
        name: 'end_date',
        label: 'Data fim',
        value: values.end_date ?? '',
      });
    }

    list.push({
      type: 'description',
      name: 'note',
      label: 'Observação',
      placeholder: 'Detalhes adicionais sobre a série',
      required: false,
      // The `description` type validates a minimum length; the note is optional, so empty is valid.
      validatorConfig: { minLength: 0 },
      value: values.note ?? '',
    });

    return list;
  }, [frequencyUnit, isClosed, isLoadingOptions, options, showDayOfMonth, showMonth, showWeekDay, values]);

  const layoutFields = useMemo(() => fields.map((field) => ({
    name: field.name ?? field.type,
    span: field.type === 'description' ? 2 : 1,
  })), [fields]);

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

    const interval = toNumber(data.frequency_interval);
    if (interval === undefined || interval < 1 || interval > MAX_FREQUENCY_INTERVAL) {
      showAlert({ variant: 'error', message: 'O intervalo deve ficar entre 1 e 24.', position: 'top-right' });
      return;
    }

    const installments = isClosed ? toNumber(data.installments) : undefined;
    if (isClosed && (installments === undefined || installments < 1 || installments > MAX_INSTALLMENTS)) {
      showAlert({ variant: 'error', message: 'Informe as parcelas da série.', position: 'top-right' });
      return;
    }

    const rule = toScheduleRule(data);
    const startDate = rule ? firstOccurrence(rule) : (data.start_date ?? '');

    onSubmit({
      id: item?.id,
      kind: (data.kind ?? TransactionKindMap.CLOSED) as TTransactionSeriesPersist['kind'],
      name: data.name ?? '',
      note: data.note || undefined,
      value: value.instance.valueNumber,
      direction: (data.direction ?? TransactionDirectionMap.OUT) as TTransactionSeriesPersist['direction'],
      account: { id: accountId } as TTransactionSeriesPersist['account'],
      credit_card: data.credit_card_id ? ({ id: data.credit_card_id } as TTransactionSeriesPersist['credit_card']) : undefined,
      subcategory: resolveSelectedId(data.subcategory_id, options.subcategories)
        ? ({ id: data.subcategory_id } as TTransactionSeriesPersist['subcategory'])
        : undefined,
      start_date: new Date(`${startDate}T00:00:00.000Z`),
      end_date: data.end_date ? new Date(`${data.end_date}T00:00:00.000Z`) : undefined,
      frequency_unit: (data.frequency_unit ?? TransactionFrequencyUnitMap.MONTH) as TTransactionSeriesPersist['frequency_unit'],
      frequency_interval: interval,
      week_day: showWeekDay ? toNumber(data.week_day) : undefined,
      day_of_month: showDayOfMonth ? toNumber(data.day_of_month) : undefined,
      month: showMonth ? toNumber(data.month) : undefined,
      installments,
    });
  }, [isClosed, item, onSubmit, options.accounts, options.subcategories, showDayOfMonth, showMonth, showWeekDay, showAlert]);

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
      layout={{ cols: 2, fields: layoutFields }}
      actions={{
        justify: 'end',
        submit: {
          children: item ? 'Salvar alterações' : 'Criar série',
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
      className="space-y-6"
      initialValues={initialValues}
      onChange={(event) => {
        const target = event.target as unknown as { name?: string; value?: string };
        if (!target.name) return;

        const name = target.name;
        const value = target.value ?? '';
        setValues((current) => ({ ...current, [name]: value }));
      }}
    >
      <FormSection title="Próximas ocorrências" description="Datas que a série vai gerar." showDivider={false}>
        <div className="col-span-full space-y-1">
          {schedule.occurrences.length > 0 ? (
            <p className="text-sm text-slate-500 tabular-nums">{schedule.occurrences.join(' • ')}</p>
          ) : (
            <p className="text-sm text-slate-500">
              Preencha a data de início e a frequência para ver as datas da série.
            </p>
          )}
          {schedule.last_occurrence ? (
            <p className="text-sm text-slate-500 tabular-nums">Última ocorrência em {schedule.last_occurrence}.</p>
          ) : null}
        </div>
      </FormSection>
    </Form>
  );
}