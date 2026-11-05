import React from 'react';

import type { TTableHeaderAppearanceTheme, TTableAlign } from '@fintech/theme';

import type { TTableAction } from '../types';
import type { TTableSort } from '../sort';

export type TTableHeader<T> = {
  [K in keyof T]: {
    value: K;
    label: React.ReactNode;
    align?: TTableAlign;
    sortable?: boolean;
    format?: (value: T[K], item: T) => React.ReactNode;
  };
}[keyof T];

export type TableHeaderProps<T> = {
  sort?: TTableSort<T>;
  action?: TTableAction;
  headers: Array<TTableHeader<T>>;
  toggleSort: (value: keyof T) => void;
  appearance: TTableHeaderAppearanceTheme;
}