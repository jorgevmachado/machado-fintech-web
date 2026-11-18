'use client';
import { useCallback ,useEffect ,useState } from 'react';

import { useAlert } from '@fintech/ui';

import { Statement ,TStatementFilter } from '../domain';
import { statementService } from '../services';

const messagePrefix = 'statement';

export type StatementGrouping = 'date' | 'account' | 'category' | 'subcategory';

export type StatementEntryGroup = {
  key: string;
  label: string;
  items: Statement[];
};

type KeyedGrouping = Exclude<StatementGrouping, 'date'>;

export const UNCLASSIFIED_GROUP_LABEL = 'Sem classificação';

const UNCLASSIFIED_GROUP_KEY = '__unclassified__';

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDayLabel(value: Date): string {
  return DATE_LABEL_FORMATTER.format(value);
}

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `dd/mm/aaaa` of a date-only value, read in UTC so no time zone moves the day. */
export function formatDateOnly(value: Date): string {
  return SHORT_DATE_FORMATTER.format(value);
}

function sameDay(left?: Date, right?: Date): boolean {
  return (
    left !== undefined &&
    right !== undefined &&
    left.getTime() === right.getTime()
  );
}

function groupByDate(items: Statement[]): StatementEntryGroup[] {
  const groups: StatementEntryGroup[] = [];

  for (const entry of items) {
    const lastGroup = groups.at(-1);
    if (lastGroup && sameDay(lastGroup.items[0]?.expected_on, entry.expected_on)) {
      lastGroup.items.push(entry);
    } else {
      groups.push({
        // The index keeps keys unique even if a day ever shows up twice in the list.
        key: `${entry.expected_on.toISOString()}#${groups.length}`,
        label: formatDayLabel(entry.expected_on),
        items: [entry],
      });
    }
  }

  return groups;
}

/** `Categoria › Subcategoria`, or whichever part exists; `null` when the entry has no classification. */
export function formatClassification(entry: Pick<Statement, 'category_name' | 'subcategory_name'>): string | null {
  const parts = [entry.category_name, entry.subcategory_name].filter(Boolean);
  return parts.length > 0 ? parts.join(' › ') : null;
}

function resolveGroup(entry: Statement, grouping: KeyedGrouping): { key: string; label: string } | null {
  switch (grouping) {
    case 'account':
      return { key: entry.account.id, label: entry.account.name };
    case 'category':
      return entry.category_name ? { key: entry.category_name, label: entry.category_name } : null;
    case 'subcategory':
      return entry.subcategory?.id
        ? { key: entry.subcategory.id, label: formatClassification(entry) ?? UNCLASSIFIED_GROUP_LABEL }
        : null;
  }
}

function groupByKey(items: Statement[], grouping: KeyedGrouping): StatementEntryGroup[] {
  const groups = new Map<string, StatementEntryGroup>();
  const unclassified: StatementEntryGroup = { key: UNCLASSIFIED_GROUP_KEY, label: UNCLASSIFIED_GROUP_LABEL, items: [] };

  for (const entry of items) {
    const resolved = resolveGroup(entry, grouping);
    if (!resolved) {
      unclassified.items.push(entry);
      continue;
    }

    const group = groups.get(resolved.key);
    if (group) {
      group.items.push(entry);
    } else {
      groups.set(resolved.key, { ...resolved, items: [entry] });
    }
  }

  const sorted = [...groups.values()].sort((left, right) => left.label.localeCompare(right.label, 'pt-BR'));
  return unclassified.items.length > 0 ? [...sorted, unclassified] : sorted;
}

/**
 * Presentation-only grouping of the statement being displayed. It never reorders
 * the entries inside a group, which already arrive from the API in its order.
 */
export function groupStatementEntries(items: Statement[], grouping: StatementGrouping): StatementEntryGroup[] {
  return grouping === 'date' ? groupByDate(items) : groupByKey(items, grouping);
}

/** Response of the request identified by `key`; loading derives from the current key, not from an effect. */
type StatementRequestState = {
  key: string;
  items: Statement[] | null;
  total: number;
  error: string | null;
};

const INITIAL_STATE: StatementRequestState = { key: '', items: null, total: 0, error: null };

function toRequestKey(filters: TStatementFilter): string {
  return JSON.stringify([
    filters.start_date,
    filters.end_date,
    filters.search ?? '',
    filters.direction ?? '',
    filters.status ?? '',
    filters.account_id ?? '',
    filters.credit_card_id ?? '',
    filters.only_credit_card === true,
  ]);
}

/**
 * The whole period in one request, with no page: a change of period or filter
 * makes the previous response obsolete, and `refresh` asks the same statement again.
 */
export default function useStatement(filters: TStatementFilter) {
  const { showAlert } = useAlert();
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState<StatementRequestState>(INITIAL_STATE);

  const requestKey = `${toRequestKey(filters)}#${reloadCount}`;

  useEffect(() => {
    let isCurrent = true;

    statementService.fetchList(filters).then(
      (response) => {
        if (!isCurrent) return;

        if (response.isFailure) {
          showAlert({ variant: 'error', message: response.errors.join(' ') });
          setState({ key: requestKey, items: [], total: 0, error: response.errors.join(' ') });
          return;
        }

        const instance = response.instance;
        const items = Array.isArray(instance) ? instance : instance.items;
        const total = Array.isArray(instance) ? instance.length : instance.meta.total;
        setState({ key: requestKey, items, total, error: null });
      },
      () => {
        if (!isCurrent) return;

        const message = 'Erro ao carregar o extrato.';
        showAlert({ variant: 'error', message });
        setState({ key: requestKey, items: [], total: 0, error: message });
      },
    );

    // A newer request (or unmount) makes this response obsolete.
    return () => {
      isCurrent = false;
    };
  }, [filters, requestKey, showAlert]);

  const isCurrentResponse = state.key === requestKey;

  const refresh = useCallback(() => {
    setReloadCount((count) => count + 1);
  }, []);

  return {
    entries: isCurrentResponse ? (state.items ?? []) : [],
    total: isCurrentResponse ? state.total : 0,
    isLoading: !isCurrentResponse,
    error: isCurrentResponse ? state.error : null,
    refresh,
  };
}

export { messagePrefix };