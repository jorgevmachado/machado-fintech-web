import { render } from '@testing-library/react';
import { useLoading } from '@fintech/ui';
import { usePathname, useSearchParams } from 'next/navigation';

import NavigationProgress from '../../NavigationProgress';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@fintech/ui', () => ({
  useLoading: jest.fn(),
}));

describe('NavigationProgress', () => {
  const stopAll = jest.fn();
  const stopPageRender = jest.fn();
  let pathname = '/home';
  let search = '';

  beforeEach(() => {
    pathname = '/home';
    search = '';
    jest.mocked(usePathname).mockImplementation(() => pathname);
    jest.mocked(useSearchParams).mockImplementation(() => new URLSearchParams(search) as never);
    jest.mocked(useLoading).mockReturnValue({ stopAll, stopPageRender } as never);
  });

  afterEach(() => jest.clearAllMocks());

  it('stores the initial URL and ignores unchanged renders', () => {
    const { rerender } = render(<NavigationProgress />);
    rerender(<NavigationProgress />);

    expect(stopAll).not.toHaveBeenCalled();
    expect(stopPageRender).not.toHaveBeenCalled();
  });

  it('stops active loading after pathname or query changes', () => {
    const { rerender } = render(<NavigationProgress />);
    pathname = '/receipt';
    rerender(<NavigationProgress />);
    expect(stopAll).toHaveBeenCalledTimes(1);
    expect(stopPageRender).toHaveBeenCalledTimes(1);

    search = 'status=processed';
    rerender(<NavigationProgress />);
    expect(stopAll).toHaveBeenCalledTimes(2);
    expect(stopPageRender).toHaveBeenCalledTimes(2);
  });
});
