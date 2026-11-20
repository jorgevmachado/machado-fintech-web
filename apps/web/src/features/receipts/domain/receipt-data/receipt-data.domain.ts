import type { TReceiptData ,TReceiptDataField } from './types';
import { DateVO } from '@fintech/shared';

export class ReceiptData {
  public readonly fine: TReceiptDataField<number>;
  public readonly payer: TReceiptDataField<string>;
  public readonly barcode: TReceiptDataField<string>;
  public readonly due_date: TReceiptDataField<Date>;
  public readonly discount: TReceiptDataField<number>;
  public readonly category: TReceiptDataField<string>;
  public readonly interest: TReceiptDataField<number>;
  public readonly description: TReceiptDataField<string>;
  public readonly paid_amount: TReceiptDataField<number>;
  public readonly beneficiary: TReceiptDataField<string>;
  public readonly payment_date: TReceiptDataField<Date>;
  public readonly total_charges: TReceiptDataField<number>;
  public readonly authentication: TReceiptDataField<string>;
  public readonly transaction_id: TReceiptDataField<string>;
  public readonly effective_payer: TReceiptDataField<string>;
  public readonly document_amount: TReceiptDataField<number>;
  public readonly source_institution: TReceiptDataField<string>;
  public readonly destination_institution: TReceiptDataField<string>;

  private constructor(props: TReceiptData) {
    this.fine = props.fine;
    this.payer = props.payer;
    this.barcode = props.barcode;
    this.due_date = props.due_date;
    this.discount = props.discount;
    this.category = props.category;
    this.interest = props.interest;
    this.description = props.description;
    this.paid_amount = props.paid_amount;
    this.beneficiary = props.beneficiary;
    this.payment_date = props.payment_date;
    this.total_charges = props.total_charges;
    this.authentication = props.authentication;
    this.transaction_id = props.transaction_id;
    this.effective_payer = props.effective_payer;
    this.document_amount = props.document_amount;
    this.source_institution = props.source_institution;
    this.destination_institution = props.destination_institution;
  }

  public static create(props: TReceiptData): ReceiptData {
    if(props.due_date && !!props.due_date.value){
      const dueDateResult = DateVO.tryCreate(props.due_date.value);
      if(dueDateResult.isFailure){
        throw new Error(`Invalid receipt due_date: ${props.due_date.value}`);
      }
    }

    if(props.payment_date && !!props.payment_date.value){
      const paymentDateResult = DateVO.tryCreate(props.payment_date.value);
      if(paymentDateResult.isFailure){
        throw new Error(`Invalid receipt payment_date: ${props.payment_date.value}`);
      }
    }

    return new ReceiptData(props);
  }
}