import { render } from '@testing-library/react';
import { Breadcrumb, Navigation, useBreadcrumb } from '@fintech/ui';
import { usePathname } from 'next/navigation';

import AppShell from '../AppShell';
import { logoutAction } from '@/src/features/auth';
import { useAppNavigation } from '../navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@fintech/ui', () => ({
  Breadcrumb: jest.fn(() => null),
  Navigation: jest.fn(({ children }: { children: React.ReactNode }) => <>{children}</>),
  useBreadcrumb: jest.fn(),
}));

jest.mock('@/src/features/auth', () => ({
  logoutAction: jest.fn(),
}));

jest.mock('../navigation', () => ({
  useAppNavigation: jest.fn(),
}));

jest.mock('../NavigationProgress', () => jest.fn(() => null));

describe('AppShell', () => {
  const push = jest.fn();
  const refresh = jest.fn();
  const breadcrumbs = [
    { href: '/institution', label: 'Institution' },
    { href: '/institution/source', label: 'Source' },
    { href: '/institution/destination', label: 'Destination' },
    { href: '/payer', label: 'Payer' },
  ];

  beforeEach(() => {
    jest.mocked(usePathname).mockReturnValue('/institution');
    jest.mocked(useAppNavigation).mockReturnValue({ push, refresh } as never);
    jest.mocked(useBreadcrumb).mockReturnValue({ breadcrumbs } as never);
  });

  afterEach(() => jest.resetAllMocks());

  it('renders the authenticated layout with translated breadcrumbs and navigation callbacks', async () => {
    render(<AppShell isAuthenticated>Finance page</AppShell>);

    expect(jest.mocked(useBreadcrumb)).toHaveBeenCalledWith({ pathname: '/institution' });
    expect(jest.mocked(Navigation)).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/institution',
        isAuthenticated: true,
        withLanguageSwitch: true,
        variant: 'dark',
      }),
      undefined,
    );
    expect(jest.mocked(Breadcrumb)).toHaveBeenCalledWith(
      expect.objectContaining({
        breadcrumbs: [
          { href: '/institution', label: 'navigation.institution.title' },
          { href: '/institution/source', label: 'navigation.institution.source' },
          { href: '/institution/destination', label: 'navigation.institution.destination' },
          { href: '/payer', label: 'navigation.payer' },
        ],
      }),
      undefined,
    );

    const navigationProps = jest.mocked(Navigation).mock.calls[0]?.[0];
    navigationProps?.onItemClick?.({ href: '/receipt' } as never);
    expect(push).toHaveBeenCalledWith('/receipt');

    await navigationProps?.logout?.onClick?.();
    expect(logoutAction).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenLastCalledWith('/join');
    expect(refresh).toHaveBeenCalledTimes(1);

    const breadcrumbProps = jest.mocked(Breadcrumb).mock.calls[0]?.[0];
    breadcrumbProps?.onItemClick?.('/payer');
    expect(push).toHaveBeenLastCalledWith('/payer');
  });

  it('hides breadcrumbs by default when the session is unauthenticated', () => {
    render(<AppShell>Public page</AppShell>);

    expect(jest.mocked(Navigation)).toHaveBeenCalledWith(
      expect.objectContaining({ isAuthenticated: false }),
      undefined,
    );
    expect(Breadcrumb).not.toHaveBeenCalled();
  });
});
