'use client';

import React, { useMemo } from 'react';

import { tableCellTheme } from '@fintech/theme';

import type { TTableBodyActions } from './types';
import TableBodyAction from './action';

type TableBodyActionsProps<T> = {
  item: T;
  actions: TTableBodyActions<T>;
  className: string;
}

export default function TableBodyActions<T>({ item, actions, className }: TableBodyActionsProps<T>) {
  const tableBodyActionTheme = useMemo(() => tableCellTheme({ size: 'sm', align: actions.align, className }), [actions, className]);
  return (
    <td className={tableBodyActionTheme}>
      <div className="flex gap-2">
        {actions.icons && actions.icons.length > 0 && actions.icons.map((icon, index) => (
          <TableBodyAction key={index} {...icon} item={item} />
        ))}
      </div>

    </td>
  )
}
