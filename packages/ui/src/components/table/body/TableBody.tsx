import React from 'react';

import { TableCell } from '../cell';

import { TableBodyActions } from './actions';
import type { TableBodyProps } from './types';


export default function TableBody<T>({ items, headers, actions, appearance }: TableBodyProps<T>) {
  return (
    <tbody className={appearance.background}>
      {items.map((item, rowIndex) => (
        <tr key={rowIndex} className={appearance.border}>
          {headers.map((header) => (
            <TableCell
              key={String(header.value)}
              type="body"
              align={header.align}
              className={appearance.cell}
            >
              {header.format
                ? header.format(item[header.value], item)
                : String(item[header.value] ?? '--')
              }
            </TableCell>
          ))}
          {actions && (
            <TableBodyActions item={item} actions={actions} className={appearance.cell}/>
          )}
        </tr>
      ))}
    </tbody>
  );
}