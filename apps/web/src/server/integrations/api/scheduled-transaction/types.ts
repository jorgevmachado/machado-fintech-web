import {
  TScheduledTransactionPersist
} from '@/src/features/scheduled-transaction/domain';

export type TScheduledTransactionApiPersist = Omit<TScheduledTransactionPersist, 'id' | 'account' | 'subcategory' | 'credit_card' | 'settled_on' |'expected_on' | 'occurrence_on'> & {
  account_id: string;
  settled_on?: string;
  expected_on: string;
  occurrence_on: string;
  subcategory_id?: string;
  credit_card_id?: string;
};