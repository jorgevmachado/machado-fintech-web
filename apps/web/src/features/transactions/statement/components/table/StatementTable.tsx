'use client';

import { KeyboardEvent, Fragment } from 'react';

import { Statement } from '@/src/features/transactions/statement';
import {
  formatClassification ,
  formatDateOnly ,
  StatementEntryGroup ,StatementGrouping ,
} from '@/src/features/transactions/statement/hooks/use-statement';
import {
   Table ,
   TableBody ,TableCell ,
   TableHead ,
   TableHeader ,
   TableRow ,
 } from '@/src/components';
import GroupCount
  from '@/src/features/transactions/statement/components/group-count';
import SettleToggleButton
  from '@/src/features/transactions/statement/components/settle-toggle-button';
import RecurrenceSign
  from '@/src/features/transactions/statement/components/recurrence-sign';
import TransactionAmount
  from '@/src/features/transactions/statement/components/transaction-amount';
import TransactionStatusBadge
  from '@/src/features/transactions/statement/components/transaction-status-badge';

export type StatementTableProps = {
  groups: StatementEntryGroup[];
  grouping: StatementGrouping;
  togglingId: string | null;
  onToggleSettled: (entry: Statement) => void;
  onOpen: (entry: Statement) => void;
};

export function openOnActivationKey(event: KeyboardEvent<HTMLElement>, open: () => void) {
  if (event.target !== event.currentTarget) return;

  if (event.key === 'Enter') {
    open();
  } else if (event.key === ' ') {
    // Space would scroll the page.
    event.preventDefault();
    open();
  }
}

/** Dense statement view: group headers spanning the row and clickable entry rows (standalone transactions and series occurrences). */
export default function StatementTable({ groups, grouping, togglingId, onToggleSettled, onOpen }: StatementTableProps) {
  // The group header already names the day when grouping by date.
  const showDateColumn = grouping !== 'date';
  const columnCount = showDateColumn ? 7 : 6;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-12 pl-1">
            <span className="sr-only">Efetivar</span>
          </TableHead>
          {showDateColumn ? <TableHead className="w-28">Data</TableHead> : null}
          <TableHead>Nome</TableHead>
          <TableHead className="hidden md:table-cell">Conta</TableHead>
          <TableHead className="hidden lg:table-cell">Classificação</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="pr-1">Situação</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {groups.map((group) => (
          <Fragment key={group.key}>
            <TableRow className="bg-[color:var(--app-surface-muted,#f1f5f9)] hover:bg-[color:var(--app-surface-muted,#f1f5f9)]">
              <TableCell colSpan={columnCount} className="px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-[color:var(--app-text-muted,#64748b)]">
                  <span className="text-[color:var(--app-text-subtle,#475569)]">{group.label}</span>
                  <GroupCount count={group.items.length} />
                </div>
              </TableCell>
            </TableRow>

            {group.items.map((entry) => {
              const classification = formatClassification(entry);

              return (
                <TableRow
                  key={entry.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen(entry)}
                  onKeyDown={(event) => openOnActivationKey(event, () => onOpen(entry))}
                  className="cursor-pointer focus-visible:bg-[color:var(--app-surface-muted,#f1f5f9)] focus-visible:outline-none"
                >
                  <TableCell className="pl-1">
                    <SettleToggleButton
                      entry={entry}
                      isToggling={togglingId === entry.id}
                      onToggle={onToggleSettled}
                    />
                  </TableCell>
                  {showDateColumn ? (
                    <TableCell className="whitespace-nowrap text-[color:var(--app-text-muted,#64748b)] tabular-nums">
                      {formatDateOnly(entry.expected_on)}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <p className="flex items-center gap-1.5 font-medium text-[color:var(--app-text,#0f172a)]">
                      <span>{entry.name}</span>
                      <RecurrenceSign entry={entry} />
                    </p>
                    {entry.credit_card?.name ? (
                      <p className="text-xs text-[color:var(--app-text-muted,#64748b)]">Cartão: {entry.credit_card.name}</p>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{entry.account.name}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {classification ?? <span className="text-[color:var(--app-text-muted,#64748b)]">-</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <TransactionAmount entry={entry} />
                  </TableCell>
                  <TableCell className="pr-1">
                    <TransactionStatusBadge status={entry.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
