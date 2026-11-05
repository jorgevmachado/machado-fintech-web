'use client';

import { useContext } from 'react';

import { type UIContextProps, UIContext } from './UIContext';


export const useUI = (): UIContextProps => {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error(
      'useUI must be used within UIContextProvider.',
    );
  }

  return context;
};
