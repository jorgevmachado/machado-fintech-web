import { Icon, Lang } from '@fintech/ui';

import { Badge } from '../../../../components';
import { pickSmartIconColor } from '../../../../shared/temp-colors';

import { CreditCard ,type CreditCardBrandsEnum } from '../../domain';

type CreditCardListProps = {
  items: CreditCard[];
  onEdit: (item: CreditCard) => void;
  onDelete: (item: CreditCard) => void;
}

const BRAND_LABELS: Record<CreditCardBrandsEnum, string> = {
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
  ELO: 'Elo',
  AMEX: 'American Express',
  HIPERCARD: 'Hipercard',
  DINERS: 'Diners Club',
  OTHER: '',
};


function formatLimit(limitInCents?: number): string {
  if (!limitInCents) return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(limitInCents / 100);
}

export default function CreditCardList({ items, onEdit, onDelete }: CreditCardListProps) {
  if(items.length === 0) {
    return (
      <div>
        <Lang langKey="credit-card.empty" />
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((card) => (
        <li
          key={card.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: card.color ?? '#6366f1' }}
            >
              {card.icon ? (
                <Icon icon={card.icon} className="size-4" style={{ backgroundColor: card.color ?? '#6366f1' }} />
              ) : (
                <span
                  className="text-xs font-bold"
                  style={{ color: pickSmartIconColor(card.color ?? '#6366f1') }}
                >
                  {card.name[0]?.toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {card.name}
                {card.last_four_digits ? (
                  <span className="ml-2 text-sm text-muted-foreground">•••• {card.last_four_digits}</span>
                ) : null}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                <Lang
                  langKey="credit-card.summary"
                  values={{
                    limit: formatLimit(card.limit),
                    closing_day: card.closing_day,
                    due_day: card.due_day,
                  }}
                />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary">
              {card.brand === 'OTHER'
                ? <Lang langKey="credit-card.brand.other" />
                : BRAND_LABELS[card.brand] || card.brand}
            </Badge>
            <Icon icon="edit" onClick={() => onEdit(card)} className="cursor-pointer transition-colors text-amber-700 hover:bg-amber-50" />
            <Icon icon="trash" onClick={() => onDelete(card)} className="cursor-pointer transition-colors text-red-700 hover:bg-red-50" />
          </div>
        </li>
      ))}
    </ul>
  );
}