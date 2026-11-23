import { Icon ,Lang } from '@fintech/ui';

import { Beneficiary } from '@/src/features/beneficiary';

type BeneficiaryListProps = {
  items: Beneficiary[];
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (beneficiary: Beneficiary) => void;
}

export default function BeneficiaryList({ items, onEdit, onDelete }: BeneficiaryListProps) {
  if(items.length === 0) {
    return (
      <div>
        <Lang langKey="beneficiary.empty" />
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] px-4 py-3 shadow-sm"
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
              <p className="truncate font-medium text-[color:var(--app-text,#0f172a)]">
                {item.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Icon icon="edit" onClick={() => onEdit(item)} className="cursor-pointer transition-colors text-[color:var(--app-warning-strong,#92400e)] hover:bg-[color:var(--app-warning-soft,rgba(217,119,6,0.10))]" />
            <Icon icon="trash" onClick={() => onDelete(item)} className="cursor-pointer transition-colors text-[color:var(--app-negative-strong,#991b1b)] hover:bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]" />
          </div>
        </li>
      ))}
    </ul>

  )
}