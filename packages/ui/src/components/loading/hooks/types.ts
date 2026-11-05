import type { ReactNode } from 'react';
import type { LoadingProps } from '../types';

export type LoadingProviderProps = {
  children: ReactNode;
  service?: LoadingProps;
  duration?: number;
  pageRender?: LoadingProps;
};

export type LoadingContextValue = {
  stop: () => void;
  start: () => void;
  stopAll: () => void;
  execute: <T>(callback: () => Promise<T>) => Promise<T>;
  isLoading: boolean;
  stopPageRender: () => void;
  startPageRender: () => void;
  isPageRendering: boolean;
};