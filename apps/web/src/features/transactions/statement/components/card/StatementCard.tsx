'use client';

import { Fragment } from 'react';
import {
  formatClassification ,
  formatDateOnly ,
  StatementEntryGroup,
} from '@/src/features/transactions/statement/hooks/use-statement';
import { Statement } from '@/src/features/transactions/statement';
import GroupCount
  from '@/src/features/transactions/statement/components/group-count';
import { Card } from '@/src/components';
import {
  openOnActivationKey
} from '@/src/features/transactions/statement/components/table/StatementTable';
import SettleToggleButton
  from '@/src/features/transactions/statement/components/settle-toggle-button';
import RecurrenceSign
  from '@/src/features/transactions/statement/components/recurrence-sign';
import TransactionAmount
  from '@/src/features/transactions/statement/components/transaction-amount';
import TransactionStatusBadge
  from '@/src/features/transactions/statement/components/transaction-status-badge';

export type StatementCardsProps = {
  groups: StatementEntryGroup[];
  togglingId: string | null;
  onToggleSettled: (entry: Statement) => void;
  onOpen: (entry: Statement) => void;
};

/** Touch-friendly statement view: one card per entry, one column on mobile and two from `lg`. */
export default function StatementCards({ groups, togglingId, onToggleSettled, onOpen }: StatementCardsProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.key} aria-label={group.label} className="space-y-2">
          <h3 className="flex items-center gap-2 px-1 text-xs font-medium text-[color:var(--app-text-muted,#64748b)]">
            <span className="text-[color:var(--app-text-subtle,#475569)]">{group.label}</span>
            <GroupCount count={group.items.length} />
          </h3>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {group.items.map((entry) => {
              const details = [
                formatDateOnly(entry.expected_on),
                entry.account.name,
                entry.credit_card?.name ? `Cartão: ${entry.credit_card.name}` : null,
                formatClassification(entry),
              ].filter((detail): detail is string => Boolean(detail));

              return (
                <Card
                  key={entry.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen(entry)}
                  onKeyDown={(event) => openOnActivationKey(event, () => onOpen(entry))}
                  className="cursor-pointer px-3 py-2.5 transition-colors hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <div className="flex items-center gap-2">
                    <SettleToggleButton
                      entry={entry}
                      isToggling={togglingId === entry.id}
                      onToggle={onToggleSettled}
                    />
                    <p className="flex min-w-0 flex-1 items-center gap-1.5 font-medium text-[color:var(--app-text,#0f172a)]">
                      <span className="truncate">{entry.name}</span>
                      <RecurrenceSign entry={entry} />
                    </p>
                    <TransactionAmount entry={entry} className="shrink-0" />
                  </div>

                  <div className="mt-1 flex items-center gap-3 pl-11">
                    <p className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[color:var(--app-text-muted,#64748b)]">
                      {details.map((detail, index) => (
                        <Fragment key={`${index}-${detail}`}>
                          {index > 0 ? <span aria-hidden="true">·</span> : null}
                          <span className={index === 0 ? 'tabular-nums' : undefined}>{detail}</span>
                        </Fragment>
                      ))}
                    </p>
                    <TransactionStatusBadge status={entry.status} className="shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
