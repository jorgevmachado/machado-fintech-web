import { DateVO } from '@fintech/shared';

import { ReceiptProcessingStatusEnum } from './enum';
import { TReceipt } from './types';

import { ReceiptData } from './receipt-data';

export class Receipt {
  public readonly id: string;
  public readonly data?: ReceiptData;
  public readonly status: ReceiptProcessingStatusEnum;
  public readonly file_name: string;
  public readonly file_type: string;
  public readonly file_size: string;
  public readonly created_at: Date;
  public readonly updated_at?: Date;
  
  private constructor(props: TReceipt) {
    this.id = props.id;
    this.data = props.data ? ReceiptData.create(props.data) : undefined;
    this.status = props.status;
    this.file_name = props.file_name;
    this.file_type = props.file_type;
    this.file_size = props.file_size;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: TReceipt): Receipt {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid receipt created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid receipt updated_at: ${updatedAtResult.error}`);
      }
    }
    return new Receipt(props);
  }
}