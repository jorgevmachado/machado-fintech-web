import { Receipt ,TReceiptPersist } from '../../domain';
import { Table ,TableProps ,useUI } from '@fintech/ui';
import { useCallback ,useMemo } from 'react';
import { Money } from '@fintech/shared';
import { Subcategory } from '@/src/features/category';

type TReceiptListItem = TReceiptPersist & {
  file_name: string;
}

type ReceiptListProps = {
  items: Array<Receipt>;
  onEdit?: (item: TReceiptPersist) => void;
  onShow?: (item: TReceiptPersist) => void;
  onConfirm?: (item: TReceiptPersist) => void;
  subcategories: Array<Subcategory>;
}

export default function ReceiptList({
  items,
  onEdit,
  onShow,
  onConfirm,
  subcategories
}: ReceiptListProps) {

  const { locale } = useUI();

  const data = useMemo(() => {
    const result: Array<TReceiptListItem> = [];
    items.forEach((receipt) => {
      if(receipt.data) {
        const data = {...receipt.data};
        result.push({
          id: receipt.id,
          file_name: receipt.file_name,
          fine: data.fine.value,
          payer: data.payer.value ?? '--',
          barcode: data.barcode.value,
          due_date: data.due_date.value,
          discount: data.discount.value,
          interest: data.interest.value,
          subcategory_id: data.category.value ?? '--',
          description: data.description.value,
          paid_amount: data.paid_amount.value ?? 0,
          beneficiary: data.beneficiary.value ?? '--',
          payment_date: data.payment_date.value,
          total_charges: data.total_charges.value,
          authentication: data.authentication.value,
          transaction_id: data.transaction_id.value,
          effective_payer: data.effective_payer.value,
          document_amount: data.document_amount.value,
          source_institution: data.source_institution.value ?? '--',
          destination_institution: data.destination_institution.value ?? '--',
        })

      }
    });
    return result;
  }, [items]);

  const getSubcategory = useCallback((value: string) => {
    const subcategory_by_id = subcategories.find((item) => item.id === value);
    if(subcategory_by_id) {
      return subcategory_by_id;
    }
    return subcategories.find((item) => item.name === value);
  }, [subcategories]);

  const formatItem = useCallback((item: TReceiptPersist) => {
    return {
      ...item,
      payer: item.payer === '--' ? '' : item.payer,
      barcode: item.barcode === '--' ? '' : item.barcode,
      subcategory_id: item.subcategory_id === '--' ? '' : getSubcategory(item.subcategory_id)?.id ?? '',
      beneficiary: item.beneficiary === '--' ? '' : item.beneficiary,
      authentication: item.authentication === '--' ? '' : item.authentication,
      transaction_id: item.transaction_id === '--' ? '' : item.transaction_id,
      effective_payer: item.effective_payer === '--' ? '' : item.effective_payer,
      source_institution: item.source_institution === '--' ? '' : item.source_institution,
      destination_institution: item.destination_institution === '--' ? '' : item.destination_institution,
    }
  }, [getSubcategory]);

  const actions = useMemo(() => {
    const icons  = [];

    if(onEdit) {
      icons.push({ icon: 'edit' ,onClick: (item: TReceiptPersist) => onEdit(formatItem(item)) });
    }
    if(onShow) {
      icons.push({ icon: 'show' ,onClick: (item: TReceiptPersist) => onShow(formatItem(item)) });
    }
    if(onConfirm) {
      icons.push({ icon: 'confirm' ,onClick: (item: TReceiptPersist) => onConfirm(formatItem(item)), tone: 'success' });
    }

    const actions = {
      text: 'form.action.actions' ,
      icons
    };
    if(icons.length > 0) {
      return actions as TableProps<TReceiptPersist>['actions'];
    }
    return undefined;
  }, [formatItem, onConfirm, onEdit, onShow]);

  return (
    <div className="max-w-full overflow-x-auto rounded-xl">
      <Table
      items={data}
      headers={[
        { value: 'file_name', label: 'receipt.file_name.label' },
        { value: 'payer', label: 'receipt.payer.label' },
        { value: 'subcategory_id', label: 'category.name.label', format: (value) => getSubcategory(value)?.name ?? '' },
        { value: 'beneficiary', label: 'beneficiary.name.label' },
        { value: 'payment_date', label: 'receipt.payment.date.label', format: (value) => value ? new Date(value).toLocaleDateString() : '' },
        { value: 'source_institution', label: 'receipt.payment.source_institution.label' },
        { value: 'destination_institution', label: 'receipt.payment.destination_institution.label' },
        { value: 'paid_amount', label: 'receipt.paid_amount.label', format: (value) => Money.tryCreate(value, { locale }).instance.formatted },
      ]}
      actions={actions}
      />
    </div>
  );
}