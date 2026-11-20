import {
  ReceiptData ,
  receiptDataMapper ,
  TReceiptPersist,
} from '@/src/features/receipts';
import { DateVO ,Money } from '@fintech/shared';
import {
  Form ,
  FormProps ,
  FormValidation ,
  useAlert ,
  useUser,
  BaseInputOptions
} from '@fintech/ui';
import { TUser } from '@/src/features/auth';
import { useCallback ,useMemo } from 'react';

type ReceiptFormProps = {
  item: TReceiptPersist;
  onSubmit: (values: TReceiptPersist, data: ReceiptData) => void;
  onCancel: () => void;
  subcategoryOptions: Array<BaseInputOptions>;
};

export default function ReceiptForm({ item, onSubmit, onCancel, subcategoryOptions }: ReceiptFormProps) {
  const { showAlert } = useAlert();
  const { user } = useUser<TUser>();

  const initialValues: Record<string, string> = useMemo(() => {
    const payer = item?.payer && item?.payer !== '' ? item?.payer : user?.name;
    const data: Record<string, string> = {
      id: item.id,
      fine: String(item.fine ?? ''),
      payer: payer ?? '',
      barcode: String(item.barcode ?? ''),
      due_date: item.due_date ? DateVO.format.dateToDateString(item.due_date) ?? '' : '',
      discount: String(item.discount ?? ''),
      interest: String(item.interest ?? ''),
      subcategory_id: item.subcategory_id,
      description: String(item.description ?? ''),
      beneficiary: String(item.beneficiary ?? ''),
      paid_amount: item?.paid_amount?.toFixed(2) ?? '',
      payment_date: item.payment_date ? DateVO.format.dateToDateString(item.payment_date) ?? '' : '',
      total_charges: String(item.total_charges ?? ''),
      authentication: String(item.authentication ?? ''),
      transaction_id: String(item.transaction_id ?? ''),
      effective_payer: String(item.effective_payer ?? ''),
      document_amount: item.document_amount?.toFixed(2) ?? '',
      source_institution: String(item.source_institution ?? ''),
      destination_institution: String(item.destination_institution ?? ''),
    };
    return data;
  } ,[item, user?.name]);

  const fields: FormProps['fields'] = useMemo(() => {
    const paymentDate = !initialValues.payment_date
      ? undefined
      : DateVO.format.dateToDateString(initialValues.payment_date);

    const paidAmount = !initialValues.paid_amount || initialValues.paid_amount === '0'
      ? undefined
      : initialValues.paid_amount;

    return [
      {
        type: 'text' ,
        name: 'payer' ,
        label: 'receipt.payer.label' ,
        placeholder: 'receipt.payer.placeholder' ,
        value: initialValues.payer ?? '',
      } ,
      {
        type: 'autocomplete' ,
        name: 'subcategory_id' ,
        label: 'category.name.label' ,
        options: subcategoryOptions.map((option) => ({ key: option.value, label: option.label, value: option.value })),
        placeholder: 'category.name.placeholder' ,
        required: true ,
        value: initialValues.subcategory_id ?? ''
      } ,
      {
        type: 'text' ,
        name: 'beneficiary' ,
        label: 'receipt.beneficiary.name.label' ,
        placeholder: 'receipt.beneficiary.name.placeholder' ,
        required: true ,
        value: initialValues.beneficiary ?? ''
      } ,
      {
        type: 'text' ,
        name: 'source_institution' ,
        label: 'receipt.source_institution.label' ,
        placeholder: 'receipt.source_institution.placeholder' ,
        value: initialValues.source_institution ?? '',
        required: true ,
      } ,
      {
        type: 'text' ,
        name: 'destination_institution' ,
        label: 'receipt.destination_institution.label' ,
        placeholder: 'receipt.destination_institution.placeholder' ,
        value: initialValues.destination_institution ?? '',
      } ,
      {
        type: 'date' ,
        name: 'payment_date' ,
        label: 'receipt.payment.date.label' ,
        placeholder: 'receipt.payment.date.placeholder' ,
        value: paymentDate ?? '',
        disabled: Boolean(paymentDate) ,
        required: true ,
      } ,
      {
        type: 'money' ,
        name: 'paid_amount' ,
        label: 'receipt.paid_amount.label' ,
        placeholder: 'receipt.paid_amount.placeholder' ,
        value: paidAmount ?? '',
        required: true ,
      },
      {
        type: 'description' ,
        name: 'description' ,
        value: initialValues.description ?? '',
        presentation: {
          minLength: 0
        }
      }
    ];
  } ,[initialValues.beneficiary, initialValues.description, initialValues.destination_institution, initialValues.paid_amount, initialValues.payer, initialValues.payment_date, initialValues.source_institution, initialValues.subcategory_id, subcategoryOptions]);

  const handleOnSuccess = (data: Record<string, string>) => {
    const dataItem = { ...item };
    if(data.payer) {
      dataItem.payer = dataItem.payer !== data.payer ? data.payer : dataItem.payer;
    }
    if(data.subcategory_id) {
      dataItem.subcategory_id = data.subcategory_id !== dataItem.subcategory_id ? data.subcategory_id : dataItem.subcategory_id;
    }

    if(data.description) {
      dataItem.description = data.description !== dataItem.description ? data.description : dataItem.description;
    }

    if(data.beneficiary) {
      dataItem.beneficiary = data.beneficiary !== dataItem.beneficiary ? data.beneficiary : dataItem.beneficiary;
    }
    if(data.source_institution) {
      dataItem.source_institution = data.source_institution !== dataItem.source_institution ? data.source_institution : dataItem.source_institution;
    }
    if(data.destination_institution) {
      dataItem.destination_institution = data.destination_institution !== dataItem.destination_institution ? data.destination_institution : dataItem.destination_institution;
    }
    if(data.payment_date) {
      const validDate = new Date(data.payment_date);
      if(!isNaN(validDate.getTime())) {
        dataItem.payment_date = dataItem.payment_date !== validDate ? validDate : dataItem.payment_date;
      }
    }
    if(data.paid_amount) {
      const validAmount = Money.tryCreate(data.paid_amount).instance.valueNumber;
      if(!isNaN(validAmount)) {
        dataItem.paid_amount = dataItem.paid_amount !== validAmount ? validAmount : dataItem.paid_amount;
        data['paid_amount'] = validAmount.toString();
      }
    }
    const extractedData = receiptDataMapper.objToDomain(data)
    onSubmit(dataItem, extractedData);
  }

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error' ,
      message: validation.errorMessage ?? 'receipt.form.validation.error' ,
      position: 'top-right' ,
    });
  } ,[showAlert]);

  return (
    <Form
      fields={ fields }
      actions={ {
        submit: {
          children: 'form.action.save' ,
          fullWidth: true ,
        } ,
        cancel: {
          children: 'form.action.cancel' ,
          fullWidth: true ,
          onClick: () => onCancel() ,
        },
      } }
      onError={ handleOnError }
      onSuccess={ handleOnSuccess }
      className="space-y-4"
      initialValues={ initialValues }
    />
  );
}