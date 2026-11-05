'use client';

import { useContext } from 'react';

import type { LoadingContextValue } from './types';

import { LoadingContext } from './LoadingContext';

export default function useLoading(): LoadingContextValue {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error(
      'useLoading must be used within a LoadingProvider',
    );
  }

  return context;
}
