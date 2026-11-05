'use client';

import React from 'react';
import { BreadcrumbContext ,GetBreadcrumbParams } from './BreadcrumbContext';
import { TBreadcrumbItem } from '../breadcrumb-item';

export const useBreadcrumb = (params: GetBreadcrumbParams): { breadcrumbs: Array<Omit<TBreadcrumbItem, 'onItemClick'>> } => {
  const context = React.useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return {
    breadcrumbs: context.getBreadcrumbs(params)
  };
};
