'use client';
import {
  TransactionStatusEnum ,TransactionStatusMap ,
} from '@/src/features/transactions/transaction';
import { cn } from '@/src/shared/temp-class-name';
import { Badge ,BadgeProps } from '@fintech/ui';

const STATUS_BADGE_CLASSES: Record<TransactionStatusEnum, string> = {
  [TransactionStatusMap.PENDING]: 'border-amber-500/40 bg-amber-500/10 text-amber-600',
  [TransactionStatusMap.SETTLED]: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600',
  [TransactionStatusMap.CANCELED]: 'border-slate-200 bg-slate-100 text-slate-500',
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
    <Badge variant="outline" tone={ TRANSACTION_STATUS_TONE[status]} className={cn([STATUS_BADGE_CLASSES[status], className ?? ''])}>
      {TRANSACTION_STATUS_LABELS[status]}
    </Badge>
  );
}