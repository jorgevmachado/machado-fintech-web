'use client';

import { useCallback ,useMemo ,useState } from 'react';

import type { FiltersProps } from './types';

type FetchRequestFn<TFilters> = (filters: TFilters) => void;

type UseFilterProps<TFilters> = {
  fetchRequest: FetchRequestFn<TFilters>;
  initialFilters: TFilters;
  normalizeFilters?: (nextFilters?: TFilters) => TFilters;
  initialInputFilters: FiltersProps['filters'];
}

type UseFilterResult<TFilters> = {
  filters: TFilters;
  clearFilters: () => void;
  applyFilters: (nextFilters: TFilters) => void;
  inputFilters: FiltersProps['filters'];
  clearInputFilters: () => void;
  applyInputFilters: (nextFilters: TFilters) => void;
  updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
}

const buildInputFilterValueMap = (filters: FiltersProps['filters']): Record<string, string | number> => {
  return Object.fromEntries(filters.map((filter) => [filter.name, filter.value]));
};

const useFilter = <TFilters>({
  fetchRequest ,
  initialFilters ,
  normalizeFilters ,
  initialInputFilters ,
}: UseFilterProps<TFilters>): UseFilterResult<TFilters> => {
  const [filters ,setFilters] = useState<TFilters>(initialFilters);
  const [inputFilterValues ,setInputFilterValues] = useState<Record<string ,string | number>>(() => buildInputFilterValueMap(initialInputFilters));

  const inputFilters = useMemo<FiltersProps['filters']>(() => {
    return initialInputFilters.map((filter) => ({
      ...filter ,
      value: inputFilterValues[filter.name] ?? '' ,
    }));
  } ,[initialInputFilters ,inputFilterValues]);

  const applyFilters = useCallback((nextFilters: TFilters) => {
    const normalizedFilters = normalizeFilters ? normalizeFilters(nextFilters) : nextFilters;

    setFilters(normalizedFilters);
    fetchRequest(normalizedFilters);
  } ,[normalizeFilters ,fetchRequest]);

  const applyInputFilters = useCallback((nextFilters: TFilters) => {
    const filterValues = nextFilters as Record<string ,string | undefined>;
    setInputFilterValues((previousState) => {
      const nextState = { ...previousState };

      for (const key of Object.keys(nextState)) {
        nextState[key] = filterValues[key] || '';
      }

      return nextState;
    });

    applyFilters(nextFilters);
  } ,[applyFilters]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    fetchRequest(initialFilters);
  } ,[initialFilters ,fetchRequest]);

  const clearInputFilters = useCallback(() => {
    setInputFilterValues((previousState) => {
      return Object.fromEntries(
        Object.keys(previousState).map((key) => [key ,'']) ,
      );
    });

    clearFilters();
  } ,[clearFilters]);

  const updateInputFilters = useCallback((nextInputFilters: FiltersProps['filters']) => {
      setInputFilterValues(buildInputFilterValueMap(nextInputFilters));
    } ,[]);

  return {
    filters ,
    applyFilters ,
    clearFilters ,
    inputFilters ,
    clearInputFilters ,
    applyInputFilters ,
    updateInputFilters ,
  };
}
export default useFilter;
