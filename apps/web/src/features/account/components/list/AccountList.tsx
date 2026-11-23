'use client';
import { Icon, Lang, Badge } from '@fintech/ui';

import { pickSmartIconColor } from '@/src/shared/temp-colors';

import { Account } from '@/src/features/account/domain';

type AccountListProps = {
  items: Account[];
  onEdit: (item: Account) => void;
  onDelete: (item: Account) => void;
}

export default function AccountList({ items, onEdit, onDelete }: AccountListProps) {
  if(items.length === 0) {
    return (
      <div>
        <Lang langKey="account.empty" />
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((account) => (
        <li
          key={account.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: account.color ?? '#6366f1' }}
            >
              {account.icon ? (
                <Icon icon={account.icon} className="size-4" style={{ backgroundColor: account.color ?? '#6366f1' }} />
              ) : (
                <span
                  className="text-xs font-bold"
                  style={{ color: pickSmartIconColor(account.color ?? '#6366f1') }}
                >
                  {account.name[0]?.toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-[color:var(--app-text,#0f172a)]">
                {account.name}
                {account.financial_institution ? (
                  <p className="truncate text-sm text-[color:var(--app-text-muted,#64748b)]">{account.financial_institution}</p>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge tone="neutral" variant="solid" size="lg">
              {`account.type.${account.type.toLocaleLowerCase()}`}
            </Badge>
            <Icon icon="edit" onClick={() => onEdit(account)} className="cursor-pointer transition-colors text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))]" />
            <Icon icon="trash" onClick={() => onDelete(account)} className="cursor-pointer transition-colors text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]" />
          </div>
        </li>
      ))}
    </ul>
  );
}