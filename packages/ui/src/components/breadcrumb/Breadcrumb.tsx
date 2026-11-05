'use client';

import React ,{ useMemo } from 'react';

import type { TIcon } from '@fintech/icons';

import { Icon } from '../../primitives';

import { BreadcrumbItem ,type TBreadcrumbItem } from './breadcrumb-item';


type HomeBreadcrumb = {
  href: string;
  icon: React.ReactNode | TIcon;
  label: string;
  withIcon?: boolean;
  className?: string;
}

type BreadCrumbProps = {
  breadcrumbs: Array<Omit<TBreadcrumbItem, 'onItemClick'>>;
  onItemClick: (href: string) => void;
  homeBreadcrumb?: Partial<Omit<HomeBreadcrumb, 'className'>>;
}

export default function Breadcrumb({ breadcrumbs, onItemClick, homeBreadcrumb }: BreadCrumbProps) {

  const home = useMemo(() => {
    const breadcrumb: HomeBreadcrumb = {
      href: '/home',
      icon: 'home',
      label: 'Go to Home',
      withIcon: true,
    }
    if (!homeBreadcrumb) {
      return breadcrumb;
    }

    if(homeBreadcrumb.label && homeBreadcrumb.label.length > 0) {
      breadcrumb.label = homeBreadcrumb.label;
    }

    if(homeBreadcrumb.icon && homeBreadcrumb.withIcon) {
      breadcrumb.icon = homeBreadcrumb.icon;
    }

    breadcrumb.withIcon = Boolean(homeBreadcrumb.withIcon);

    return breadcrumb;
  }, [homeBreadcrumb]);

  const currentBreadcrumbs = useMemo(() => {
    return breadcrumbs.filter((item) => item.href !== home.href);
  }, [breadcrumbs, home]);

  if(breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-5 flex items-center"
    >
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        <li className="flex items-center">
          <button
            aria-label={home.label}
            className="cursor-pointer flex items-center rounded-md p-1 text-slate-400 transition hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            onClick={() => onItemClick(home.href)}
          >
            {!home.withIcon ? <> { home.label }</> : <Icon icon={home.icon} />}
          </button>
        </li>
        {currentBreadcrumbs.map((item) => (
          <li className="flex items-center gap-x-1" key={item.href}>
            <Icon icon="chevron-right" aria-hidden="true" className="shrink-0 text-slate-300"/>
            <BreadcrumbItem {...item} onItemClick={onItemClick} />
          </li>
        ))}
      </ol>
    </nav>
  );
};
