'use client';

import React,{ useMemo } from 'react';

import { buildTableTheme } from '@fintech/theme';

import type { TableProps } from './types';

import { useTableSort } from './sort';
import { TableHeader } from './header';
import { TableBody } from './body';
import { TableFooter } from './footer';

export default function Table<T>({
  items,
  footer,
  headers,
  actions,
  appearance
}: TableProps<T>) {
  const { sort, toggleSort, sortedItems } = useTableSort(items);

  const basicAction = useMemo(() => {
    if (actions) {
      return { text: actions.text, align: actions.align };
    }
    return undefined;
  }, [actions]);

  const tableAppearance = useMemo(() => buildTableTheme(appearance),[appearance]);

  return (
    <div className={tableAppearance.table}>
      <table className={tableAppearance.content}>
        <TableHeader
          sort={sort}
          action={basicAction}
          headers={headers}
          toggleSort={toggleSort}
          appearance={tableAppearance.header}
        />
        <TableBody
          items={sortedItems}
          headers={headers}
          actions={actions}
          appearance={tableAppearance.body}
        />
        {
          footer && (
            <TableFooter
              items={sortedItems}
              action={basicAction}
              headers={headers}
              columns={footer}
              appearance={tableAppearance.footer}
            />
          )
        }
      </table>
    </div>
  )
}
