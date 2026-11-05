import type { TTableAction } from '../../types';

import { IconProps } from '../../../../primitives';

export type TTableBodyAction<T> = Omit<IconProps, 'onClick'> & {
  onClick: (item: T) => void;
};

export type TTableBodyActions<T> = TTableAction & {
  icons: Array<TTableBodyAction<T>>
};