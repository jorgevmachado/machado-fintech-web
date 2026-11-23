import { Mapper ,parseDate  } from '@fintech/shared';

import { Receipt ,TReceiptApiData } from '../domain';
import {
  receiptDataMapper
} from './receipt-data.mapper';

export class ReceiptMapper extends Mapper<TReceiptApiData ,Receipt> {

  public toDomain(data: TReceiptApiData): Receipt {
    return Receipt.create({
      id: data.id ,
      data: data?.data ? receiptDataMapper.toDomain(data.data) : undefined ,
      status: data.status ,
      file_name: data.file_name ,
      file_type: data.file_type ,
      file_size: data.file_size ,
      created_at: parseDate(data.created_at ,'created_at' ,'receipt') ,
      updated_at: data.updated_at == null
        ? undefined
        : parseDate(data.updated_at ,'updated_at' ,'receipt') ,
    });
  }

  public toJson(data: Receipt): TReceiptApiData {
    return {
      id: data.id ,
      data: data?.data ? receiptDataMapper.toJson(data.data) : undefined ,
      status: data.status ,
      file_name: data.file_name ,
      file_type: data.file_type ,
      file_size: data.file_size ,
      created_at: data.created_at.toISOString() ,
      ...(data.updated_at
        ? { updated_at: data.updated_at.toISOString() }
        : {}) ,
    };
  }
}

export const receiptMapper = new ReceiptMapper();