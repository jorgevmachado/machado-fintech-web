'use client';
import React ,{ useCallback } from 'react';
import {
  BreadcrumbContext ,
  BreadcrumbContextProps ,
  GetBreadcrumbParams ,
} from './BreadcrumbContext';
import { TBreadcrumbItem } from '../breadcrumb-item';
import { buildBreadcrumbs ,getRouteSegmentLabels } from './config';

type BreadcrumbProviderProps = Readonly<{
  home?: string;
  children: React.ReactNode;
}>;

const BreadcrumbProvider = ({ home, children }: BreadcrumbProviderProps) => {
  const getHomeSegment = useCallback((homeSegment?: string): string => {
    if(homeSegment){
      return homeSegment;
    }

    return home ?? 'home';
  }, [home]);

  const getBreadcrumbs = useCallback(({
    pathname,
    homeSegment: customHomeSegment,
    blockedPaths,
    routeSegmentLabels: customRouteSegmentLabels,
  }: GetBreadcrumbParams) => {
    const currentBreadcrumbs: Array<Omit<TBreadcrumbItem, 'onItemClick'>> = []
    const routeSegmentLabels = getRouteSegmentLabels(customRouteSegmentLabels);
    const homeSegment = getHomeSegment(customHomeSegment);
    currentBreadcrumbs.push(...buildBreadcrumbs({
      pathname,
      homeSegment,
      blockedPaths: blockedPaths ?? [] ,
      routeSegmentLabels
    }));
    return currentBreadcrumbs;
  }, [getHomeSegment])

  const value: BreadcrumbContextProps = {
    getBreadcrumbs,
  };

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export default BreadcrumbProvider;