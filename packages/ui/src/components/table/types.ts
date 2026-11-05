import React from 'react';

import type { TTableAppearanceTheme, TTableAlign } from '@fintech/theme';

import type { TTableHeader } from './header';
import type { TTableBodyActions } from './body';
import type { TTableFooter } from './footer';

export type TTableAction = {
  text: React.ReactNode;
  align?: TTableAlign;
}

export type TableProps<T> = {
  items: Array<T>;
  footer?: Partial<Record<keyof T, TTableFooter<T>>>;
  headers: Array<TTableHeader<T>>;
  actions?: TTableBodyActions<T>;
  appearance?: TTableAppearanceTheme;
}