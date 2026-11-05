'use client';

import React from 'react';
import { useAppTranslation } from '@fintech/i18n';

import { UIContext } from './UIContext';

type UIContextProviderProps = {
  children: React.ReactNode;
}

export default function UIContextProvider({ children }: UIContextProviderProps) {
  const { locale } = useAppTranslation();
  return (
    <UIContext.Provider value={{ locale }}>
      {children}
    </UIContext.Provider>
  );
}

