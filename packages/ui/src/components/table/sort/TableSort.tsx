'use client';

import React from 'react';

import type { TTableSort } from './types';
import { Icon } from '../../../primitives';

type TableHeaderCellSortProps<T> = {
  sort?: TTableSort<T>;
  value: keyof T;
  toggleSort: (value: keyof T) => void;
}
export default function TableSort<T>({ sort, value, toggleSort }: TableHeaderCellSortProps<T>) {
  const isActive = sort?.value === value;

  const icon = !isActive
    ?  'unfold-more'
    : sort.direction === 'asc'
      ? 'arrow-downward'
      : 'arrow-upward';

  return (
    <Icon
      icon={icon}
      onClick={() => toggleSort(value)}
      className="cursor-pointer text-slate-400"
      aria-label={"Sort Column"}
    />
  )
}