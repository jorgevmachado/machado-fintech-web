import React from 'react';

import { TableCell } from '../cell';
import type { TableHeaderProps } from './types';
import { TableSort } from '../sort';

const TableHeader = <T,>({ sort, headers, action, toggleSort, appearance }: TableHeaderProps<T>) => {
  return (
    <thead className={appearance.background}>
    <tr>
      {headers.map((header) => (
        <TableCell
          key={String(header.value)}
          type="header"
          align={header.align}
          className={appearance.cell}
        >
          <>
            {header.label}
            {header.sortable && header.value !== undefined && toggleSort && (
              <TableSort sort={sort} value={header.value} toggleSort={toggleSort}/>
            )}
          </>
        </TableCell>
      ))}
      {action && (
        <TableCell type="header" align={action.align} className={appearance.cell}>
          {action.text}
        </TableCell>
      )}
    </tr>
    </thead>
  )
}
TableHeader.displayName = 'TableHeader';
export default TableHeader;