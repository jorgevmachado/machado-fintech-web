'use client';
import { useCallback ,useState } from 'react';
import { TStatementFilter } from '@/src/features/transactions/statement';
import useLocalStorage from '../../../../hooks/storage';
import {
  isDirection ,
  isTransactionStatus,
} from '@/src/features/transactions/transaction';

export type StatementView = 'table' | 'cards';

export type StatementGrouping = 'date' | 'account' | 'category' | 'subcategory';

export type StatementPreferences = {
  version: 1;
  view: StatementView;
  grouping: StatementGrouping;
  filtersOpen: boolean;
  filters: TStatementFilter;
};

const CARDS_VIEW_MAX_WIDTH = 1024;

export type StatementFilterName = keyof TStatementFilter;

export const STATEMENT_PREFERENCES_STORAGE_KEY = 'fintech:statement-preferences';

export const STATEMENT_VIEW_LABELS: Record<StatementView, string> = {
  table: 'Tabela',
  cards: 'Cards',
};

export const STATEMENT_GROUPING_LABELS: Record<StatementGrouping, string> = {
  date: 'Data',
  account: 'Conta',
  category: 'Categoria',
  subcategory: 'Subcategoria',
};

export const STATEMENT_VIEWS = Object.keys(STATEMENT_VIEW_LABELS) as StatementView[];

export const STATEMENT_GROUPINGS = Object.keys(STATEMENT_GROUPING_LABELS) as StatementGrouping[];

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** `YYYY-MM-DD` of a calendar day, built from its parts so no time zone can shift it. */
function toDateOnly(year: number, month: number, day: number): string {
  return `${pad(year)}-${pad(month)}-${pad(day)}`;
}

/** Reads the year and the human month (1–12) out of a `YYYY-MM-DD` string, without a `Date`. */
function parseDateOnly(value?: string): { year: number; month: number } | null {
  const [year = '', month = ''] = (value ?? '').split('-');
  const parsedYear = Number.parseInt(year, 10);
  const parsedMonth = Number.parseInt(month, 10);

  if (!Number.isInteger(parsedYear) || !Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    return null;
  }

  return { year: parsedYear, month: parsedMonth };
}

/** First and last day of a month, `YYYY-MM-DD`, without going through `Date#toISOString`. */
export function monthRange(year: number, month: number): { start_date: string; end_date: string } {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return { start_date: toDateOnly(year, month, 1), end_date: toDateOnly(year, month, lastDay) };
}

/** Moves the month by `delta` months, rolling the year over. */
export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const absoluteIndex = year * 12 + (month - 1) + delta;

  return { year: Math.floor(absoluteIndex / 12), month: (((absoluteIndex % 12) + 12) % 12) + 1 };
}

/** Long label of the month the period starts on, e.g. `setembro de 2026`. */
export function formatMonthLabel(startDate?: string): string {
  const parsed = parseDateOnly(startDate);
  if (!parsed) return '';

  return MONTH_LABEL_FORMATTER.format(new Date(Date.UTC(parsed.year, parsed.month - 1, 1)));
}

/** Default period of the statement: the current month. */
export function createDefaultPeriod(): { start_date: string; end_date: string } {
  const now = new Date();

  return monthRange(now.getFullYear(), now.getMonth() + 1);
}

function createDefaultFilters(): TStatementFilter {
  return createDefaultPeriod();
}

function createDefaultPreferences(): StatementPreferences {
  const isNarrowScreen = typeof window !== 'undefined' && window.innerWidth < CARDS_VIEW_MAX_WIDTH;

  return {
    version: 1,
    view: isNarrowScreen ? 'cards' : 'table',
    grouping: 'account',
    filtersOpen: false,
    filters: createDefaultFilters(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isStatementView(value: unknown): value is StatementView {
  return typeof value === 'string' && (STATEMENT_VIEWS as readonly string[]).includes(value);
}

export function isStatementGrouping(value: unknown): value is StatementGrouping {
  return typeof value === 'string' && (STATEMENT_GROUPINGS as readonly string[]).includes(value);
}

function invalidPreferences(reason: string): never {
  throw new Error(`Invalid statement preferences: ${reason}`);
}

/**
 * Reads only the known filters. An invalid filter discards the whole object, so
 * a half-restored choice never reaches the first request. The period always
 * comes from the selected month, never from the storage.
 */
function parseFilters(value: unknown): TStatementFilter {
  if (!isRecord(value)) return invalidPreferences('filters');

  const { direction, status, account_id, credit_card_id, only_credit_card } = value;
  const period = createDefaultPeriod();

  const filters: TStatementFilter = { ...period };

  if (direction !== undefined) {
    if (!isDirection(direction)) return invalidPreferences('direction');
    filters.direction = direction;
  }
  if (status !== undefined) {
    if (!isTransactionStatus(status)) return invalidPreferences('status');
    filters.status = status;
  }
  if (account_id !== undefined) {
    if (!isNonEmptyString(account_id)) return invalidPreferences('account_id');
    filters.account_id = account_id;
  }
  if (credit_card_id !== undefined) {
    if (!isNonEmptyString(credit_card_id)) return invalidPreferences('credit_card_id');
    filters.credit_card_id = credit_card_id;
  }
  if (only_credit_card !== undefined) {
    if (only_credit_card !== true) return invalidPreferences('only_credit_card');
    filters.only_credit_card = true;
  }
  if (filters.credit_card_id && filters.only_credit_card) return invalidPreferences('credit card filters together');

  return filters;
}

function withFilter<TName extends StatementFilterName>(
  filters: TStatementFilter,
  name: TName,
  value: TStatementFilter[TName],
): TStatementFilter {
  const next: TStatementFilter = { ...filters };
  delete next[name];

  if (value !== undefined && value !== false && value !== '') {
    next[name] = value;
  }
  if (name === 'credit_card_id' && next.credit_card_id) delete next.only_credit_card;
  if (name === 'only_credit_card' && next.only_credit_card) delete next.credit_card_id;

  return next;
}

export function deserializeStatementPreferences(rawValue: string): StatementPreferences {
  const parsed: unknown = JSON.parse(rawValue);

  if (!isRecord(parsed) || parsed.version !== 1) return invalidPreferences('version');
  if (!isStatementView(parsed.view)) return invalidPreferences('view');
  if (!isStatementGrouping(parsed.grouping)) return invalidPreferences('grouping');
  if (typeof parsed.filtersOpen !== 'boolean') return invalidPreferences('filtersOpen');

  return {
    version: 1,
    view: parsed.view,
    grouping: parsed.grouping,
    filtersOpen: parsed.filtersOpen,
    filters: parseFilters(parsed.filters),
  };
}

export default function useStatementPreferences() {
  const [defaultPreferences] = useState(createDefaultPreferences);
  const [preferences, setPreferences] = useLocalStorage<StatementPreferences>(
    STATEMENT_PREFERENCES_STORAGE_KEY,
    defaultPreferences,
    { deserialize: deserializeStatementPreferences },
  );

  const setView = useCallback(
    (view: StatementView) => setPreferences((current) => ({ ...current, view })),
    [setPreferences],
  );

  const setGrouping = useCallback(
    (grouping: StatementGrouping) => setPreferences((current) => ({ ...current, grouping })),
    [setPreferences],
  );

  const toggleFilters = useCallback(
    () => setPreferences((current) => ({ ...current, filtersOpen: !current.filtersOpen })),
    [setPreferences],
  );

  const setFilter = useCallback(
    <TName extends StatementFilterName>(name: TName, value: TStatementFilter[TName]) =>
      setPreferences((current) => ({ ...current, filters: withFilter(current.filters, name, value) })),
    [setPreferences],
  );

  /** Moves the period by `delta` months, keeping the filters of the screen. */
  const shiftPeriod = useCallback(
    (delta: number) =>
      setPreferences((current) => {
        const parsed = parseDateOnly(current.filters.start_date) ?? parseDateOnly(createDefaultPeriod().start_date);
        if (!parsed) return current;

        const next = shiftMonth(parsed.year, parsed.month, delta);
        return { ...current, filters: { ...current.filters, ...monthRange(next.year, next.month) } };
      }),
    [setPreferences],
  );

  const clearFilters = useCallback(
    () =>
      setPreferences((current) => {
        const period = { start_date: current.filters.start_date, end_date: current.filters.end_date };
        return { ...current, filters: period };
      }),
    [setPreferences],
  );

  const monthLabel = formatMonthLabel(preferences.filters.start_date);

  return {
    preferences,
    monthLabel,
    setView,
    setGrouping,
    toggleFilters,
    setFilter,
    shiftPeriod,
    clearFilters,
  };
}