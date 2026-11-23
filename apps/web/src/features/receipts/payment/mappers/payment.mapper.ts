import { DateVO ,mapResult ,Mapper ,parseDate ,parseDecimal ,Result } from '@fintech/shared';

import {
  Payment ,
  TPaymentApiData ,
  TPaymentDashboard ,
  TPaymentDashboardApiData,
} from '../domain';
import { payerMapper } from '@/src/features/payer';
import { receiptMapper } from '@/src/features/receipts/receipt';
import {
  subcategoryMapper
} from '@/src/features/category/mappers/subcategory.mapper';
import { beneficiaryMapper } from '@/src/features/beneficiary';
import { institutionMapper } from '@/src/features/institution';

/** The API sends `payment_date` as a date-only value (`YYYY-MM-DD`). */
const dateOnlyParser = (value: string): Date | undefined => DateVO.format.dateStringToDate(value);

export class PaymentMapper extends Mapper<TPaymentApiData ,Payment> {

  public toDomain(data: TPaymentApiData): Payment {
    return Payment.create({
      id: data.id ,
      payer: payerMapper.toDomain(data.payer),
      amount: parseDecimal(data.amount ,'amount' ,'payment') ,
      receipt: receiptMapper.toDomain(data.receipt),
      subcategory: subcategoryMapper.toDomain(data.subcategory),
      beneficiary: beneficiaryMapper.toDomain(data.beneficiary),
      source_institution: institutionMapper.toDomain(data.source_institution),
      destination_institution: data.destination_institution
        ? institutionMapper.toDomain(data.destination_institution)
        : undefined,
      created_at: parseDate(data.created_at ,'created_at' ,'payment') ,
      payment_date: parseDate(data.payment_date ,'payment_date' ,'payment' ,dateOnlyParser) ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'payment') ,
    });
  }

  public toJson(data: Payment): TPaymentApiData {
    return {
      id: data.id ,
      payer: payerMapper.toJson(data.payer),
      amount: data.amount ,
      receipt: receiptMapper.toJson(data.receipt),
      subcategory: subcategoryMapper.toJson(data.subcategory),
      beneficiary: beneficiaryMapper.toJson(data.beneficiary),
      source_institution: institutionMapper.toJson(data.source_institution),
      destination_institution: data.destination_institution
        ? institutionMapper.toJson(data.destination_institution)
        : undefined,
      created_at: data.created_at.toISOString() ,
      payment_date: DateVO.format.dateToDateString(data.payment_date) ?? '' ,
      ...(data.description === undefined ? {} : { description: data.description }) ,
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}) ,
    };
  }

  /** The dashboard arrives with the same Decimal-as-string payload as the list. */
  public toDashboardDomain(data: TPaymentDashboardApiData): TPaymentDashboard {
    return {
      period: {
        start_date: parseDate(data.period.start_date ,'start_date' ,'payment dashboard' ,dateOnlyParser) ,
        end_date: parseDate(data.period.end_date ,'end_date' ,'payment dashboard' ,dateOnlyParser) ,
      },
      summary: {
        total: parseDecimal(data.summary.total ,'summary.total' ,'payment dashboard') ,
        count: data.summary.count ,
        average: parseDecimal(data.summary.average ,'summary.average' ,'payment dashboard') ,
        highest: parseDecimal(data.summary.highest ,'summary.highest' ,'payment dashboard') ,
      },
      monthly: data.monthly.map((item) => ({
        period: item.period ,
        total: parseDecimal(item.total ,'monthly.total' ,'payment dashboard') ,
        count: item.count ,
      })),
      institutions: data.institutions.map((item) => ({
        institution: item.institution ,
        total: parseDecimal(item.total ,'institutions.total' ,'payment dashboard') ,
        count: item.count ,
      })),
      subcategories: data.subcategories.map((item) => ({
        subcategory_id: item.subcategory_id ,
        name: item.name ,
        total: parseDecimal(item.total ,'subcategories.total' ,'payment dashboard') ,
        count: item.count ,
      })),
      payers: data.payers.map((item) => ({
        payer_id: item.payer_id ,
        name: item.name ,
        total: parseDecimal(item.total ,'payers.total' ,'payment dashboard') ,
        count: item.count ,
      })),
      beneficiaries: data.beneficiaries.map((item) => ({
        beneficiary_id: item.beneficiary_id ,
        name: item.name ,
        total: parseDecimal(item.total ,'beneficiaries.total' ,'payment dashboard') ,
        count: item.count ,
      })),
    };
  }

  public mapDashboardResult(
    result: Result<TPaymentDashboardApiData>,
  ): Result<TPaymentDashboard> {
    return mapResult(result ,(data) => this.toDashboardDomain(data));
  }
}

export const paymentMapper = new PaymentMapper();