'use client';
import { useMemo } from 'react';

import {
  Receipt ,
  ReceiptProcessingStatusMap ,
  TReceiptPersist ,
} from '@/src/features/receipts';
import { Tabs } from '@fintech/ui';
import ReceiptList from '@/src/features/receipts/components/list/ReceiptList';
import { Subcategory } from '@/src/features/category';

type ReceiptGroupsProps = {
  items: Array<Receipt>;
  onEdit?: (item: TReceiptPersist) => void;
  onShow?: (item: TReceiptPersist) => void;
  onConfirm?: (item: TReceiptPersist) => void;
  subcategories: Array<Subcategory>;
  defaultActiveTab?: string;
}
export default function ReceiptGroups({
  items,
  onEdit,
  onShow,
  onConfirm,
  subcategories,
  defaultActiveTab,
}: ReceiptGroupsProps) {
  const receiptsList = useMemo(() => {
    const received = items.filter((receipt) => receipt.status === ReceiptProcessingStatusMap.RECEIVED);
    const processed = items.filter((receipt) => receipt.status === ReceiptProcessingStatusMap.PROCESSED);
    const processing = items.filter((receipt) => receipt.status === ReceiptProcessingStatusMap.PROCESSING);
    const failed = items.filter((receipt) => receipt.status === ReceiptProcessingStatusMap.FAILED);

    return [
      {
        type: ReceiptProcessingStatusMap.RECEIVED,
        items: received,
        onEdit,
        onShow,
        onConfirm,
      },
      {
        type: ReceiptProcessingStatusMap.PROCESSED,
        items: processed,
        onShow,
      },
      {
        type: ReceiptProcessingStatusMap.PROCESSING,
        items: processing,
        onShow,
      },
      {
        type: ReceiptProcessingStatusMap.FAILED,
        items: failed,
        onEdit,
        onShow,
      }
    ];
  }, [items, onConfirm, onEdit, onShow]);

  return (
    <Tabs
      ariaLabel="Sections"
      defaultValue={defaultActiveTab}
      items={receiptsList.map((group) => ({
        value: group.type,
        label: `receipt.${group.type.toLowerCase()}`,
        content: (<ReceiptList items={group.items} onEdit={group.onEdit} onShow={group.onShow} onConfirm={group.onConfirm} subcategories={subcategories}  />)
      }))}
    />
  )
}