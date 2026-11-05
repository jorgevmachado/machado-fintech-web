import { OFilterVariants } from './options';

export type TFilterVariants = typeof OFilterVariants[number];

export type TFilterOption = {
  key: string;
  value: string;
  label?: string;
}

export type TFilter = {
  type : TFilterVariants;
  name: string;
  value : string | number;
  label?: string;
  options?: Array<TFilterOption>;
  isLoading?: boolean;
  placeholder?: string;
};

export type FiltersProps = {
  filters: Array<TFilter>;
  onApply: (nextFilters: Record<string, string>) => void;
  onClear?: () => void;
  ariaLabel?: string;
  filterCleanLabel?: string;
  filterApplyLabel?: string;
};

export type TBaseFilter = {
  page?: string;
  limit?: string;
  order_by?: string;
  clean_cache?: boolean;
  with_deleted?: boolean;
}