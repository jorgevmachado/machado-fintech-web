'use client';

import React, { useMemo } from 'react';

import { type TTableAlign, buildTableCellTheme } from '@fintech/theme';

import { useTranslationResolver } from '../../../lang';

type TableCellProps = {
  type: 'body' | 'header' | 'footer';
  align?: TTableAlign;
  children?: React.ReactNode;
  className: string;
}

export default function TableCell({ type, align, children, className }: TableCellProps) {
  const { resolveChildren: resolveTranslation } = useTranslationResolver();
  const tag = type === 'header' ? 'th' : 'td';
  const Component = (tag) as React.ElementType;

  const withContent = useMemo(() => !!children, [children]);

  const cellAppearance = useMemo(() => buildTableCellTheme(type, className, align), [align, className, type]);

  return (
    <Component className={cellAppearance.cell}>
      {withContent && (
        <div className={cellAppearance.content}>
          {resolveTranslation(children, 5)}
        </div>
      )}
    </Component>
  )
}
