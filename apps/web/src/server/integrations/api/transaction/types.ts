import { TTransactionPersist } from '@/src/features/transaction/domain';

export type TTransactionApiPersist = Omit<TTransactionPersist, 'id' | 'account' | 'subcategory' | 'credit_card' | 'settled_on' |'expected_on'> & {
  account_id: string;
  settled_on?: string;
  expected_on: string;
  subcategory_id?: string;
  credit_card_id?: string;
};