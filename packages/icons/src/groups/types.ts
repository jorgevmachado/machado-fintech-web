import type React from 'react';

import type { TIcon } from '../types';
import { OIconGroup } from '../options';

export type TIconGroup = typeof OIconGroup[number];

export type TIconGroupIcons = Record<TIcon, React.ReactNode>;

export type TIconGroups = Record<TIconGroup, Partial<TIconGroupIcons>>;