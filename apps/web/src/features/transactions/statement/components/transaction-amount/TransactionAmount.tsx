'use client';
import { Statement } from '@/src/features/transactions/statement';
import {
  TransactionDirectionMap
} from '@/src/features/transactions/transaction';
import { cn } from '@/src/shared/temp-class-name';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export default function TransactionAmount({ entry, className }: { entry: Statement; className?: string }) {
  const isInflow = entry.direction === TransactionDirectionMap.IN;

  return (
    <span
      className={cn([
        'whitespace-nowrap font-medium tabular-nums',
        isInflow ? 'text-[color:var(--app-positive,#059669)]' : 'text-[color:var(--app-negative,#dc2626)]',
        className ?? '',
      ])}
    >
      {isInflow ? '+' : '-'} {formatCurrency(entry.value)}
    </span>
  );
}