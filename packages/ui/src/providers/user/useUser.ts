'use client';

import { useContext } from 'react';

import { type UserContextValue, UserContext } from './UserContext';


export const useUser = <TUser>(): UserContextValue<TUser> => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'useUser must be used within UserProvider.',
    );
  }

  return context as UserContextValue<TUser>;
};
