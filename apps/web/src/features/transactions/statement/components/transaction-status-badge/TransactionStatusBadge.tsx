'use client';
import {
  TransactionStatusEnum ,TransactionStatusMap ,
} from '@/src/features/transactions/transaction';
import { cn } from '@/src/shared/temp-class-name';
import { Badge ,BadgeProps } from '@fintech/ui';

/**
 * Só a borda: o `soft` do `Badge` já traz fundo e texto em token para o tom.
 * Repetir `text-*` aqui deixaria duas cores concorrentes no mesmo elemento e,
 * sem `tailwind-merge`, quem vence é a ordem do CSS — não a do `className`.
 */
const STATUS_BADGE_BORDER_CLASSES: Record<TransactionStatusEnum, string> = {
  [TransactionStatusMap.PENDING]: 'border border-[color:var(--app-warning,#b45309)]',
  [TransactionStatusMap.SETTLED]: 'border border-[color:var(--app-positive,#059669)]',
  [TransactionStatusMap.CANCELED]: 'border border-[color:var(--app-border,#e2e8f0)]',
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatusEnum, string> = {
  [TransactionStatusMap.PENDING]: 'Pendente',
  [TransactionStatusMap.SETTLED]: 'Efetivada',
  [TransactionStatusMap.CANCELED]: 'Cancelada',
};

export const TRANSACTION_STATUS_TONE: Record<TransactionStatusEnum, BadgeProps['tone']> = {
  [TransactionStatusMap.PENDING]: 'warning',
  [TransactionStatusMap.SETTLED]: 'success',
  [TransactionStatusMap.CANCELED]: 'danger',
};

export default function TransactionStatusBadge({ status, className }: { status: TransactionStatusEnum; className?: string }) {
  return (
    <Badge variant="soft" tone={ TRANSACTION_STATUS_TONE[status]} className={cn([STATUS_BADGE_BORDER_CLASSES[status], className ?? ''])}>
      {TRANSACTION_STATUS_LABELS[status]}
    </Badge>
  );
}