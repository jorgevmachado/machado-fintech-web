'use client';
import { useTranslationResolver ,useUI } from '@fintech/ui';

import {
  Table ,
  TableBody ,
  TableCell ,
  TableHead ,
  TableHeader ,
  TableRow,
} from '@/src/components';

import type { Payment } from '../../domain';
import { formatPaymentAmount ,formatPaymentDate } from './payment-format';

type PaymentTableProps = {
  items: Array<Payment>;
};

/** Dense view: one row per payment, the amount right-aligned for comparison. */
export default function PaymentTable({ items }: PaymentTableProps) {
  const { locale } = useUI();
  const { resolve } = useTranslationResolver();

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-28">{resolve('receipt.payment.list.headers.date')}</TableHead>
          <TableHead>{resolve('receipt.payment.list.headers.payer')}</TableHead>
          <TableHead className="hidden md:table-cell">{resolve('receipt.payment.list.headers.beneficiary')}</TableHead>
          <TableHead className="hidden lg:table-cell">{resolve('receipt.payment.list.headers.subcategory')}</TableHead>
          <TableHead className="hidden lg:table-cell">{resolve('receipt.payment.list.headers.institution')}</TableHead>
          <TableHead className="text-right">{resolve('receipt.payment.list.headers.amount')}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="whitespace-nowrap tabular-nums">
              {formatPaymentDate(payment.payment_date, locale)}
            </TableCell>
            <TableCell className="font-medium">{payment.payer.name}</TableCell>
            <TableCell className="hidden md:table-cell">{payment.beneficiary.name}</TableCell>
            <TableCell className="hidden lg:table-cell">{payment.subcategory.name}</TableCell>
            <TableCell className="hidden lg:table-cell">{payment.source_institution.name}</TableCell>
            <TableCell className="whitespace-nowrap text-right font-medium tabular-nums">
              {formatPaymentAmount(payment.amount, locale)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}