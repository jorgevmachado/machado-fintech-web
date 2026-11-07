import { DateVO } from '@fintech/shared';

import { TPayer } from './types';

export class Payer {
  public readonly id: string;
  public readonly name: string;
  public readonly created_at: Date;
  public readonly updated_at?: Date;

  constructor(data: TPayer) {
    this.id = data.id;
    this.name = data.name;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  public static create(props: TPayer): Payer {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid payer created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid payer updated_at: ${updatedAtResult.error}`);
      }
    }

    return new Payer(props);
  }
}