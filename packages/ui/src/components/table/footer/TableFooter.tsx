import React from 'react';

import { TableCell } from '../cell';

import type { TableFooterProps, TTableFooter } from './types';


export default function TableFooter<T>({ items, headers, columns, appearance, action }: TableFooterProps<T>) {

  const buildChildren = (column?: TTableFooter<T>): React.ReactNode => {
    if(column?.render) {
      return column.render(items);
    }

    if(column?.text) {
      return column.text;
    }

    return null;
  }

  return (
    <tfoot className={appearance.background}>
    <tr>
      {headers.map((header) => (
        <TableCell
          key={String(header.value)}
          type="footer"
          align={header?.align}
          className={appearance.cell}>
          {buildChildren(columns[header.value as keyof T])}
        </TableCell>
      ))}
      {action && (
        <TableCell type="footer" className={appearance.cell}/>
      )}
    </tr>
    </tfoot>
  )
}

