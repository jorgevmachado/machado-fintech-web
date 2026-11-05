'use client';

import { useCallback ,useMemo ,useState } from 'react';

import type { TTableSort ,UseTableSort } from './types';


export const useTableSort = <T> (items: Array<T>): UseTableSort<T> => {
  const [sort, setSort] = useState<TTableSort<T> | undefined>(undefined);

  const toggleSort = useCallback((value: keyof T) => {
    setSort((currentSort) => {
      if (currentSort?.value !== value) {
        return {
          value,
          direction: 'asc',
        };
      }

      if (currentSort.direction === 'asc') {
        return {
          value,
          direction: 'desc',
        };
      }

      return undefined;
    });
  }, []);

  const sortedItems = useMemo(() => {
    if (!sort) {
      return items;
    }

    return [...items].sort((firstItem, secondItem) => {
      const firstValue = firstItem[sort.value];
      const secondValue = secondItem[sort.value];

      if (firstValue === secondValue) {
        return 0;
      }

      const result = firstValue > secondValue ? 1 : -1;

      return sort.direction === 'asc'
        ? result
        : -result;
    });
  }, [items, sort]);

  return { sort, toggleSort, sortedItems };
}
