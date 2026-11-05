'use client';

import React ,{ useCallback ,useMemo } from 'react';

import { buildTableActionTheme } from '@fintech/theme';

import { Icon } from '../../../../../primitives';

import { TTableBodyAction } from '../types';

type TableBodyActionProps<T> = TTableBodyAction<T> & {
  item: T;
}

export default function TableBodyAction<T>({ icon, item, onClick, className, ...props}: TableBodyActionProps<T>) {

  const handleOnClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onClick?.(item);
  }, [onClick, item]);


  const classNameList = useMemo(() => buildTableActionTheme(typeof icon === 'string' ? icon : undefined, className), [className, icon]);

  return (
    <Icon
      {...props}
      icon={icon}
      onClick={handleOnClick}
      className={classNameList}
    />
  )
}
