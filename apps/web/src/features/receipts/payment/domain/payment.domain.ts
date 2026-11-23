import { Receipt } from '@/src/features/receipts/receipt';
import { Subcategory } from '@/src/features/category';
import { Payer } from '@/src/features/payer';
import { Beneficiary } from '@/src/features/beneficiary';
import { Institution } from '@/src/features/institution';
import type { TPayment } from './types';
import { DateVO } from '@fintech/shared';

export class Payment {
  public readonly id: string;
  public readonly payer: Payer;
  public readonly amount: number;
  public readonly receipt: Receipt;
  public readonly subcategory: Subcategory;
  public readonly beneficiary: Beneficiary;
  public readonly payment_date: Date;
  public readonly description?: string;
  public readonly source_institution: Institution;
  public readonly destination_institution?: Institution;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  private constructor(props: TPayment){
    this.id = props.id;
    this.payer = props.payer;
    this.amount = props.amount;
    this.receipt = Receipt.create(props.receipt);
    this.subcategory = Subcategory.create(props.subcategory);
    this.beneficiary = Beneficiary.create(props.beneficiary);
    this.payment_date = props.payment_date;
    this.description = props.description;
    this.source_institution = Institution.create(props.source_institution);
    this.destination_institution = props.destination_institution ? Institution.create(props.destination_institution) : undefined;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TPayment): Payment {
    const paymentDateResult = DateVO.tryCreate(props.payment_date);
    if (paymentDateResult.isFailure) {
      throw new Error(`Invalid payment payment_date: ${paymentDateResult.error}`);
    }

    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid payment created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid payment updated_at: ${updatedAtResult.error}`);
      }
    }
    return new Payment(props);
  }
}