import { Icon ,Lang } from '@fintech/ui';

import { Payer } from '@/src/features/payer';

type PayerListProps = {
  items: Payer[];
  onEdit: (payer: Payer) => void;
  onDelete: (payer: Payer) => void;
}

export default function PayerList({ items, onEdit, onDelete }: PayerListProps) {
  if(items.length === 0) {
    return (
      <div>
        <Lang langKey="payer.empty" />
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-account px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: '#6366f1' }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: '#FFF' }}
              >
                  {item.name[0]?.toUpperCase()}
                </span>
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {item.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Icon icon="edit" onClick={() => onEdit(item)} className="cursor-pointer transition-colors text-amber-700 hover:bg-amber-50" />
            <Icon icon="trash" onClick={() => onDelete(item)} className="cursor-pointer transition-colors text-red-700 hover:bg-red-50" />
          </div>
        </li>
      ))}
    </ul>

  )
}