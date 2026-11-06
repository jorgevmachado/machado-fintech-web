import React ,{ HTMLAttributes ,type ReactNode } from 'react';

import type {
  TBadgeShape ,
  TBadgeVariant ,
  TReducedSize ,
  TTone,
} from '@fintech/theme';

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  tone?: TTone;
  random?: boolean;
  size?: TReducedSize;
  shape?: TBadgeShape;
  style?: React.CSSProperties;
  variant?: TBadgeVariant;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

