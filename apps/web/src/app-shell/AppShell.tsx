'use client';

import { Suspense, useCallback ,useMemo } from 'react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { Breadcrumb, Navigation, useBreadcrumb } from '@fintech/ui';

import { logoutAction } from '../features/auth';

import NavigationProgress from './NavigationProgress';
import { menu } from './menu';
import { useAppNavigation } from './navigation';

type AppShellProps = {
  children: ReactNode;
  isAuthenticated?: boolean;
};

export default function AppShell({
  children,
  isAuthenticated = false,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useAppNavigation();
  const { breadcrumbs } = useBreadcrumb({ pathname });

  const handleLogout = useCallback(async () => {
    await logoutAction();
    router.push('/join');
    router.refresh();
  }, [router]);

  const getTranslatedBreadCrumbLabel = useCallback((label: string, href: string) => {
    const value = label.toLowerCase();
    if(value === 'institution' && href === '/institution') {
      return 'navigation.institution.title';
    }
    if(value === 'source' && href === '/institution/source') {
      return 'navigation.institution.source';
    }
    if(value === 'destination' && href === '/institution/destination') {
      return 'navigation.institution.destination';
    }

    if(value === 'credit card' && href === '/credit-card') {
      return 'navigation.card';
    }

    return `navigation.${value}`;
  }, []);

  const translatedBreadcrumbs = useMemo(() => {
    return breadcrumbs.map((item) => ({
      ...item,
      label: getTranslatedBreadCrumbLabel(item.label, item.href)
    }))
  }, [breadcrumbs, getTranslatedBreadCrumbLabel]);

  return (
    <Navigation
      menu={menu}
      logout={{
        label: 'navigation.signOut',
        onClick: handleLogout,
      }}
      title="navigation.title"
      variant="dark"
      subtitle="navigation.subtitle"
      iconLogo="money"
      pathname={pathname}
      onItemClick={(item) => router.push(item.href)}
      isAuthenticated={isAuthenticated}
      withThemeSwitcher
      withLanguageSwitch
    >
      <>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {isAuthenticated && (
          <Breadcrumb
            breadcrumbs={translatedBreadcrumbs}
            onItemClick={(href) => router.push(href)}
          />
        )}
        {children}
      </>
    </Navigation>
  );
}
