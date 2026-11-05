import React from 'react';
import {
  renderHook,
} from '@testing-library/react';

import { useUser } from '../../../src/providers/user';
import { UserContext } from '../../../src/providers/user/UserContext';

type User = {
  id: string;
  name: string;
  email: string;
};

describe('useUser', () => {
  it('should return the user context', () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const context = {
      user,
    };

    const { result } = renderHook(
      () => useUser<User>(),
      {
        wrapper: ({ children }) => (
          <UserContext.Provider
            value={context}
          >
            {children}
          </UserContext.Provider>
        ),
      },
    );

    expect(result.current).toEqual(context);
  });

  it('should return undefined when the user is not provided', () => {
    const context = {
      user: undefined,
    };

    const { result } = renderHook(
      () => useUser<User>(),
      {
        wrapper: ({ children }) => (
          <UserContext.Provider
            value={context}
          >
            {children}
          </UserContext.Provider>
        ),
      },
    );

    expect(result.current.user).toBeUndefined();
  });

  it('should throw when used outside UserProvider', () => {
    expect(() =>
      renderHook(() => useUser<User>()),
    ).toThrow(
      'useUser must be used within UserProvider.',
    );
  });
});