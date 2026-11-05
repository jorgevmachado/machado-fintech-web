'use client';

import { createContext } from 'react';

import { type TBreadcrumbItem } from '../breadcrumb-item';

export type GetBreadcrumbParams = {
  pathname: string;
  homeSegment?: string;
  blockedPaths?: Array<string>;
  routeSegmentLabels?: Record<string, string>;
};

export type BreadcrumbContextProps = {
  getBreadcrumbs: (params: GetBreadcrumbParams) => Array<Omit<TBreadcrumbItem, 'onItemClick'>>;
};
export const BreadcrumbContext = createContext<BreadcrumbContextProps | undefined>(undefined);
