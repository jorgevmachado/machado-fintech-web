import { DateVO ,Mapper ,NumberVO } from '@fintech/shared';
import {
  ReceiptData ,ReceiptFieldStatusMap ,
  TReceiptDataApiData ,
  TReceiptDataField ,
} from '@/src/features/receipts/domain';

export class ReceiptDataMapper extends Mapper<TReceiptDataApiData, ReceiptData> {

  private parseNumber(value: number | string | null | undefined, field: string): number | undefined {
    if (value == null || value === '') {
      return undefined;
    }

    const result = NumberVO.tryCreate(value);
    if (result.isFailure) {
      throw new Error(`Invalid receipt ${field}: ${value}`);
    }

    return result.instance.value;
  }

  private parseDateString(value: Date | null | undefined, field: string): string | undefined {
    if (value == null) {
      return undefined;
    }

    const result = DateVO.format.dateToDateString(value);
    if (!result) {
      throw new Error(`Invalid receipt ${field}: ${value}`);
    }

    return result;
  }

  private requireDateOnly(value: string | null | undefined, field: string): Date | undefined {
    if (value == null || value === '') {
      return undefined;
    }

    const date = DateVO.format.dateStringToDate(value);
    if (!date) {
      throw new Error(`Invalid receipt ${field}: ${value}`);
    }

    return date;
  }

  private mapField<TInput, TOutput>(
    field: TReceiptDataField<TInput>,
    mapper: (value: NonNullable<TInput>) => TOutput | undefined,
  ):TReceiptDataField<TOutput>{
    const { value, ...properties } = field;
    return {
      ...properties,
      value: value == null ? undefined : mapper(value),
    };
  }

  public toDomain(data: TReceiptDataApiData): ReceiptData {
    return ReceiptData.create({
      fine: this.mapField(data.fine, (value) => this.parseNumber(value, 'fine')),
      payer: this.mapField(data.payer, (value) => value),
      barcode: this.mapField(data.barcode, (value) => value),
      due_date: this.mapField(data.due_date, (value) => this.requireDateOnly(value, 'due_date')),
      discount: this.mapField(data.discount, (value) => this.parseNumber(value, 'discount')),
      category: this.mapField(data.category, (value) => value),
      interest: this.mapField(data.interest, (value) => this.parseNumber(value, 'interest')),
      description: this.mapField(data.description, (value) => value),
      paid_amount: this.mapField(data.paid_amount, (value) => this.parseNumber(value, 'paid_amount')),
      beneficiary: this.mapField(data.beneficiary, (value) => value),
      payment_date: this.mapField(data.payment_date, (value) => this.requireDateOnly(value, 'payment_date')),
      total_charges: this.mapField(data.total_charges, (value) => this.parseNumber(value, 'total_charges')),
      authentication: this.mapField(data.authentication, (value) => value),
      transaction_id: this.mapField(data.transaction_id, (value) => value),
      effective_payer: this.mapField(data.effective_payer, (value) => value),
      document_amount: this.mapField(data.document_amount, (value) => this.parseNumber(value, 'document_amount')),
      source_institution: this.mapField(data.source_institution, (value) => value),
      destination_institution: this.mapField(data.destination_institution, (value) => value),
    })
  }

  public toJson(data: ReceiptData): TReceiptDataApiData {
    return {
      fine: this.mapField(data.fine, (value) => this.parseNumber(value, 'fine')),
      payer: this.mapField(data.payer, (value) => value),
      barcode: this.mapField(data.barcode, (value) => value),
      due_date: this.mapField<Date, string>(data.due_date, (value) => this.parseDateString(value, 'due_date')),
      discount: this.mapField(data.discount, (value) => this.parseNumber(value, 'discount')),
      category: this.mapField(data.category, (value) => value),
      interest: this.mapField(data.interest, (value) => this.parseNumber(value, 'interest')),
      description: this.mapField(data.description, (value) => value),
      paid_amount: this.mapField(data.paid_amount, (value) => this.parseNumber(value, 'paid_amount')),
      beneficiary: this.mapField(data.beneficiary, (value) => value),
      payment_date: this.mapField<Date, string>(data.payment_date, (value) => this.parseDateString(value, 'payment_date')),
      total_charges: this.mapField(data.total_charges, (value) => this.parseNumber(value, 'total_charges')),
      authentication: this.mapField(data.authentication, (value) => value),
      transaction_id: this.mapField(data.transaction_id, (value) => value),
      effective_payer: this.mapField(data.effective_payer, (value) => value),
      document_amount: this.mapField(data.document_amount, (value) => this.parseNumber(value, 'document_amount')),
      source_institution: this.mapField(data.source_institution, (value) => value),
      destination_institution: this.mapField(data.destination_institution, (value) => value),
    }
  }

  private mapFieldObject<TOutput>(field: string, data: Record<string, string>, mapper: (value: NonNullable<string>) => TOutput | undefined): TReceiptDataField<TOutput> {
    const rawValue = data[field];
    const value = rawValue == null ? undefined : mapper(rawValue);
    return {
      value,
      status: value ? ReceiptFieldStatusMap.FOUND : ReceiptFieldStatusMap.NOT_FOUND,
    }
  }

  public objToDomain(data: Record<string, string>): ReceiptData {
    return ReceiptData.create({
      fine: this.mapFieldObject('fine', data, (value) => this.parseNumber(value, 'fine')),
      payer: this.mapFieldObject('payer', data, (value) => value),
      barcode: this.mapFieldObject('barcode', data, (value) => value),
      due_date: this.mapFieldObject('due_date', data, (value) => this.requireDateOnly(value, 'due_date')),
      discount: this.mapFieldObject('discount', data, (value) => this.parseNumber(value, 'discount')),
      category: this.mapFieldObject('category', data, (value) => value),
      interest: this.mapFieldObject('interest', data, (value) => this.parseNumber(value, 'interest')),
      description: this.mapFieldObject('description', data, (value) => value),
      paid_amount: this.mapFieldObject('paid_amount', data, (value) => this.parseNumber(value, 'paid_amount')),
      beneficiary: this.mapFieldObject('beneficiary', data, (value) => value),
      payment_date: this.mapFieldObject('payment_date', data, (value) => this.requireDateOnly(value, 'payment_date')),
      total_charges: this.mapFieldObject('total_charges', data, (value) => this.parseNumber(value, 'total_charges')),
      authentication: this.mapFieldObject('authentication', data, (value) => value),
      transaction_id: this.mapFieldObject('transaction_id', data, (value) => value),
      effective_payer: this.mapFieldObject('effective_payer', data, (value) => value),
      document_amount: this.mapFieldObject('document_amount', data, (value) => this.parseNumber(value, 'document_amount')),
      source_institution: this.mapFieldObject('source_institution', data, (value) => value),
      destination_institution: this.mapFieldObject('destination_institution', data, (value) => value),
    })
  }

}

export const receiptDataMapper = new ReceiptDataMapper();