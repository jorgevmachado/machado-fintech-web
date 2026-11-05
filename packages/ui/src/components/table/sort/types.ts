export type TTableSortDirection = 'asc' | 'desc';

export type TTableSort<T> = {
  value: keyof T;
  direction: TTableSortDirection;
};

export type UseTableSort<T> = {
  sort?: TTableSort<T>;
  toggleSort: (value: keyof T) => void;
  sortedItems: Array<T>;
}
