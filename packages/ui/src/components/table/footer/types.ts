import React from 'react';

import type { TTableFooterAppearanceTheme } from '@fintech/theme';

import type { TTableHeader } from '../header';
import type { TTableAction } from '../types';

export type TTableFooter<T> = {
  text?: React.ReactNode;
  render?: (items: Array<T>) => React.ReactNode;
};

export type TableFooterProps<T> = {
  items: Array<T>;
  action?: TTableAction;
  headers: Array<TTableHeader<T>>;
  columns: Partial<Record<keyof T, TTableFooter<T>>>;
  appearance: TTableFooterAppearanceTheme;
};