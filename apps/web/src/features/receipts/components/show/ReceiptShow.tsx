import { TReceiptPersist } from '@/src/features/receipts';

import { BaseInputOptions ,useUI, Text } from '@fintech/ui';
import { useCallback ,useMemo } from 'react';
import { DateVO ,Money } from '@fintech/shared';


type ReceiptShowProps = {
  item: TReceiptPersist;
  subcategoryOptionName: string
}

export default function ReceiptShow({ item, subcategoryOptionName }: ReceiptShowProps) {
  const { locale } = useUI()
  const formatValue = useCallback((key: string, value: string | number | Date | null | undefined): string => {
    if(key === 'fine' || key === 'discount' || key === 'interest' || key === 'paid_amount' || key === 'document_amount' || key === 'total_charge') {
      return Money.tryCreate(Number(value ?? 0), { locale }).instance.formatted;
    }

    if((key === 'due_date' || key === 'payment_date') && value) {
      return DateVO.format.date(String(value), locale);
    }

    if(key === 'subcategory_id') {
      return subcategoryOptionName;
    }

    if(!value) {
      return '--';
    }

    return value.toString();
  }, [locale, subcategoryOptionName]);

  const formatLabel = useCallback((key: string): string => {
    if(key === 'beneficiary') {
      return 'finance.beneficiary.name.label';
    }
    if(key === 'payment_date') {
      return 'finance.payment.date.label';
    }

    if(key === 'source_institution') {
      return 'finance.payment.source_institution.label';
    }

    if(key === 'destination_institution') {
      return 'finance.payment.destination_institution.label';
    }

    if(key === 'subcategory_id') {
      return 'finance.category.name.label';
    }

    if(key === 'description') {
      return 'form.label.description';
    }

    return `finance.receipt.${key}.label`
  }, []);

  const list = useMemo(() => {
    const data: Array<BaseInputOptions> = [];
    Object.entries(item).forEach(([key, value]) => {
      if(key === 'id') {
        return;
      }
      data.push({
        label: formatLabel(key),
        value: formatValue(key, value)
      })
    });
    return data.sort((a, b) => {
      if (a.label === 'form.label.description') return 1;
      if (b.label === 'form.label.description') return -1;
      return 0;
    });
  }, [formatValue, formatLabel, item]);
  return (
    <div>
      {list.map((item) => (
        <div key={item.label} className="flex flex-row">
          <Text weight="bold">{item.label}</Text>
          <Text weight="bold">:&nbsp;</Text>
          <Text>{item.value}</Text>
        </div>
      ))}
    </div>
  )
}