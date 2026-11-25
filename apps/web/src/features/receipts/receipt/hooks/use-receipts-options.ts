'use client';
import { BaseInputOptions } from '@fintech/ui';
import { useEffect ,useState } from 'react';
import { useAccounts } from '@/src/features/account/hooks';
import { useCreditCards } from '@/src/features/credit-card/hooks';
import { Category ,Subcategory ,useCategories } from '@/src/features/category';
import { Account } from '@/src/features/account';
import { CreditCard } from '@/src/features/credit-card';

type RequestState<T> = {
  key: string;
  data: T | null;
  error: string | null;
};

export type ReceiptOptions = {
  accountsOptions: Array<BaseInputOptions>;
  creditCardsOptions: Array<BaseInputOptions>;
  subcategoriesOptions: Array<BaseInputOptions>;
}

export type ReceiptState = ReceiptOptions & {
  subcategories: Subcategory[];
}

export type ReceiptOptionsResult = ReceiptState & {
  isLoading: boolean;
  error: string | null;
}

const INITIAL_REQUEST_STATE = { key: '', data: null, error: null };
const EMPTY_STATE: ReceiptState = { accountsOptions: [], creditCardsOptions: [], subcategoriesOptions: [], subcategories: [] };

function toReceiptsState(
  accounts: Account[],
  creditCards: CreditCard[],
  categories: Category[],
): ReceiptState {
  const subcategories = categories.filter((category) => category.is_active)
    .flatMap((category) =>
      [...category.subcategories]
      .filter((subcategory) => subcategory.is_active)
      .sort((left, right) => left.order - right.order),
    )
  return {
    subcategories,
    accountsOptions: accounts
    .filter((account) => account.is_active)
    .map((account) => ({ label: account.name, value: account.id })),
    creditCardsOptions: creditCards
    .filter((creditCard) => creditCard.is_active)
    .map((creditCard) => ({ label: creditCard.name, value: creditCard.id })),
    subcategoriesOptions: subcategories.map((subcategory) => ({ label: subcategory.name, value: subcategory.id })),
  }
}

export default function useReceiptsOptions(): ReceiptOptionsResult {
  const [state, setState] = useState<RequestState<ReceiptState>>(INITIAL_REQUEST_STATE);
  const requestKey = 'receipt-options';

  const { fetchList: listAccounts, isLoading: accountLoading } = useAccounts()
  const { fetchList: listCreditCards, isLoading: creditCardLoading } = useCreditCards()
  const { fetchList: listCategories, isLoading: categoryLoading } = useCategories()

  useEffect(() => {
    let isCurrent = true;
    Promise.all([
      listAccounts(),
      listCreditCards(),
      listCategories(),
    ]).then(([accountsResponse, creditCardsResponse, categoriesResponse]) => {
      if(isCurrent) {
        setState({
          key: 'receipt-options',
          data: toReceiptsState(accountsResponse.items, creditCardsResponse.items, categoriesResponse.items),
          error: null,
        })
      }
    }).catch(() => {
      if(isCurrent) {
        setState({ key: 'receipt-options-error', data: null, error:  'Erro ao carregar as opções.' });
      }
    })

    return () => {
      isCurrent = false;
    }
  }, [listAccounts, listCategories, listCreditCards]);

  const isCurrentResponse = state.key === requestKey;

  return {
    ...(isCurrentResponse && state.data ? state.data : EMPTY_STATE),
    isLoading: accountLoading || creditCardLoading || categoryLoading,
    error: isCurrentResponse ? state.error : null,
  };
}