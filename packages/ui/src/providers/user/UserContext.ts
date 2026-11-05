'use client';

import { createContext } from 'react';

export type UserContextValue<TUser> = {
  user?: TUser;
};

export const UserContext = createContext<
  UserContextValue<unknown> | undefined
>(undefined);
