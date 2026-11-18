'use client';

import { useEffect ,useState } from 'react';
import useAccounts from '@/src/features/account/hooks/use-accounts';
import { useCreditCards } from '@/src/features/credit-card/hooks';
import { Category ,useCategories } from '@/src/features/category';
import { Account } from '@/src/features/account';
import { CreditCard } from '@/src/features/credit-card';

type RequestState<T> = {
  key: string;
  data: T | null;
  error: string | null;
};

export type TransactionSelectOption = {
  label: string;
  value: string;
};

export type TransactionOptions = {
  accounts: TransactionSelectOption[];
  creditCards: TransactionSelectOption[];
  subcategories: TransactionSelectOption[];
};

/** What the hook returns: the options plus the state of the three requests behind them. */
export type TransactionOptionsResult = TransactionOptions & {
  isLoading: boolean;
  error: string | null;
};


const INITIAL_REQUEST_STATE = { key: '', data: null, error: null };

const OPTIONS_PAGE_SIZE = 50;

const EMPTY_OPTIONS: TransactionOptions = { accounts: [], creditCards: [], subcategories: [] };

function toTransactionOptions(
  accounts: Account[],
  creditCards: CreditCard[],
  categories: Category[],
): TransactionOptions {
  return {
    accounts: accounts
    .filter((account) => account.is_active)
    .map((account) => ({ label: account.name, value: account.id })),
    creditCards: creditCards
    .filter((creditCard) => creditCard.is_active)
    .map((creditCard) => ({ label: creditCard.name, value: creditCard.id })),
    subcategories: categories
    .filter((category) => category.is_active)
    .flatMap((category) =>
      [...category.subcategories]
      .filter((subcategory) => subcategory.is_active)
      .sort((left, right) => left.order - right.order)
      .map((subcategory) => ({ label: `${category.name} › ${subcategory.name}`, value: subcategory.id })),
    ),
  };
}


export default function useTransactionOptions(): TransactionOptionsResult {
  const [state, setState] = useState<RequestState<TransactionOptions>>(INITIAL_REQUEST_STATE);
  const requestKey = 'transaction-options';
  const { fetchList: listAccounts, isLoading: accountLoading } = useAccounts()
  const { fetchList: listCreditCards, isLoading: creditCardLoading } = useCreditCards()
  const { fetchList: listCategories, isLoading: categoryLoading } = useCategories()

  useEffect(() => {
    let isCurrent = true;
    Promise.all([
      listAccounts({ page: '1', limit: OPTIONS_PAGE_SIZE.toString()}),
      listCreditCards({ page: '1', limit: OPTIONS_PAGE_SIZE.toString()}),
      listCategories({ page: '1', limit: OPTIONS_PAGE_SIZE.toString()}),
    ]).then(([accountsResponse, creditCardsResponse, categoriesResponse]) => {
      if(isCurrent) {
        setState({
          key: 'transaction-options',
          data: toTransactionOptions(accountsResponse.items, creditCardsResponse.items, categoriesResponse.items),
          error: null,
        })
      }
    }).catch(() => {
      if(isCurrent) {
        setState({ key: 'transaction-options-error', data: null, error:  'Erro ao carregar as opções.' });
      }
    })

    return () => {
      isCurrent = false;
    };
  }, [listAccounts, listCategories, listCreditCards])

  const isCurrentResponse = state.key === requestKey;

  return {
    ...(isCurrentResponse && state.data ? state.data : EMPTY_OPTIONS),
    isLoading: accountLoading || creditCardLoading || categoryLoading,
    error: isCurrentResponse ? state.error : null,
  };
}