/** @jest-environment jsdom */

import { fireEvent, render, waitFor } from '@testing-library/react';

import { HTTP_UNAUTHORIZED_EVENT } from '@fintech/shared';

import SessionExpirationHandler from '../SessionExpirationHandler';
import { logoutAction } from '../actions';

const mockRouter = {
  refresh: jest.fn(),
  replace: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../actions', () => ({
  logoutAction: jest.fn(),
}));

describe('SessionExpirationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (logoutAction as jest.Mock).mockResolvedValue(undefined);
  });

  it('clears the server session and redirects when an API request returns unauthorized', async () => {
    render(<SessionExpirationHandler />);
    fireEvent(window, new Event(HTTP_UNAUTHORIZED_EVENT));

    await waitFor(() => {
      expect(logoutAction).toHaveBeenCalledTimes(1);
      expect(mockRouter.replace).toHaveBeenCalledWith('/join');
      expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
    });
  });

  it('handles concurrent unauthorized responses only once', async () => {
    render(<SessionExpirationHandler />);
    fireEvent(window, new Event(HTTP_UNAUTHORIZED_EVENT));
    fireEvent(window, new Event(HTTP_UNAUTHORIZED_EVENT));

    await waitFor(() => {
      expect(logoutAction).toHaveBeenCalledTimes(1);
    });
  });
});
