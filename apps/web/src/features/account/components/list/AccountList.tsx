'use client';
import { Icon, Lang } from '@fintech/ui';

import { Badge } from '@/src/components';
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
          className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-account px-4 py-3 shadow-sm"
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
              <p className="truncate font-medium text-foreground">
                {account.name}
                {account.financial_institution ? (
                  <p className="truncate text-sm text-muted-foreground">{account.financial_institution}</p>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary">
              <Lang langKey={`account.type.${account.type.toLocaleLowerCase()}`} />
            </Badge>
            <Icon icon="edit" onClick={() => onEdit(account)} className="cursor-pointer transition-colors text-amber-700 hover:bg-amber-50" />
            <Icon icon="trash" onClick={() => onDelete(account)} className="cursor-pointer transition-colors text-red-700 hover:bg-red-50" />
          </div>
        </li>
      ))}
    </ul>
  );
}