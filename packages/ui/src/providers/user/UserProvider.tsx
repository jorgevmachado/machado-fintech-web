'use client';
import React from 'react';
import { UserContext } from './UserContext';

type UserProviderProps<TUser> = {
  user?: TUser;
  children: React.ReactNode;
};

export default function UserProvider<TUser>({
  user,
  children,
}: UserProviderProps<TUser>) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}