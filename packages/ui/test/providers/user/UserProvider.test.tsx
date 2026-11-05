import React from 'react';
import {
  render,
  screen,
} from '@testing-library/react';

import { UserProvider, useUser } from '../../../src/providers/user';

type User = {
  id: string;
  name: string;
  email: string;
};

describe('UserProvider', () => {
  it('should provide the user to its children', () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    function Consumer() {
      const { user } = useUser<User>();

      return (
        <span>
          {user?.name}
        </span>
      );
    }

    render(
      <UserProvider<User> user={user}>
        <Consumer />
      </UserProvider>,
    );

    expect(
      screen.getByText('John Doe'),
    ).toBeInTheDocument();
  });

  it('should provide undefined when user is not provided', () => {
    function Consumer() {
      const { user } = useUser<User>();

      return (
        <span>
          {user === undefined
            ? 'No user'
            : user.name}
        </span>
      );
    }

    render(
      <UserProvider<User>>
        <Consumer />
      </UserProvider>,
    );

    expect(
      screen.getByText('No user'),
    ).toBeInTheDocument();
  });

  it('should update the provided user', () => {
    const firstUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const secondUser: User = {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
    };

    function Consumer() {
      const { user } = useUser<User>();

      return (
        <span>
          {user?.name}
        </span>
      );
    }

    const { rerender } = render(
      <UserProvider<User> user={firstUser}>
        <Consumer />
      </UserProvider>,
    );

    expect(
      screen.getByText('John Doe'),
    ).toBeInTheDocument();

    rerender(
      <UserProvider<User> user={secondUser}>
        <Consumer />
      </UserProvider>,
    );

    expect(
      screen.getByText('Jane Doe'),
    ).toBeInTheDocument();

    expect(
      screen.queryByText('John Doe'),
    ).not.toBeInTheDocument();
  });
});