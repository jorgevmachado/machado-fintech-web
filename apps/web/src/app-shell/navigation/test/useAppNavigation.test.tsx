import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { useLoading } from '@fintech/ui';

import useAppNavigation from '../useAppNavigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@fintech/ui', () => ({
  useLoading: jest.fn(),
}));

describe('useAppNavigation', () => {
  const router = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };
  const startPageRender = jest.fn();

  beforeEach(() => {
    jest.mocked(useRouter).mockReturnValue(router as never);
    jest.mocked(useLoading).mockReturnValue({ startPageRender } as never);
  });

  afterEach(() => jest.resetAllMocks());

  it('starts navigation feedback for route changes but not refresh', () => {
    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.push('/home');
      result.current.replace('/login');
      result.current.back();
      result.current.forward();
      result.current.refresh();
    });

    expect(startPageRender).toHaveBeenCalledTimes(4);
    expect(router.push).toHaveBeenCalledWith('/home');
    expect(router.replace).toHaveBeenCalledWith('/login');
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.forward).toHaveBeenCalledTimes(1);
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
});
