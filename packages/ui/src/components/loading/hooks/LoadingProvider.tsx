'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Loading from '../Loading';
import { LoadingContext } from './LoadingContext';
import type {
  LoadingContextValue,
  LoadingProviderProps,
} from './types';

const PAGE_RENDER_COMPLETION_DURATION = 500;

export default function LoadingProvider({
  children,
  service,
  duration = 600,
  pageRender,
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pageRenderState, setPageRenderState] = useState<'idle' | 'loading' | 'completing'>('idle');

  const loadingCount = useRef(0);
  const pageRenderCount = useRef(0);

  const loadingStartedAt = useRef<number | null>(null);
  const pageRenderStartedAt = useRef<number | null>(null);

  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageRenderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPageRendering = pageRenderState !== 'idle';
  const isPageRenderCompleting = pageRenderState === 'completing';

  const start = useCallback(() => {
    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current);
      loadingTimer.current = null;
    }

    if (loadingCount.current === 0) {
      loadingStartedAt.current = Date.now();
      setIsLoading(true);
    }

    loadingCount.current += 1;
  }, []);

  const stop = useCallback(() => {
    if (loadingCount.current === 0) {
      return;
    }

    loadingCount.current -= 1;

    if (
      loadingCount.current === 0 &&
      loadingStartedAt.current !== null
    ) {
      const elapsed = Date.now() - loadingStartedAt.current;
      const remaining = Math.max(0, duration - elapsed);

      loadingTimer.current = setTimeout(() => {
        loadingStartedAt.current = null;
        loadingTimer.current = null;
        setIsLoading(false);
      }, remaining);
    }
  }, [duration]);

  const startPageRender = useCallback(() => {
    if (pageRenderTimer.current) {
      clearTimeout(pageRenderTimer.current);
      pageRenderTimer.current = null;
    }

    if (pageRenderCount.current === 0) {
      pageRenderStartedAt.current = Date.now();
      setPageRenderState('loading');
    }

    pageRenderCount.current += 1;
  }, []);

  const stopPageRender = useCallback(() => {
    if (pageRenderCount.current === 0) {
      return;
    }

    pageRenderCount.current -= 1;

    if (pageRenderCount.current !== 0) {
      return;
    }

    setPageRenderState('completing');

    pageRenderTimer.current = setTimeout(() => {
      pageRenderStartedAt.current = null;
      pageRenderTimer.current = null;
      setPageRenderState('idle');
    }, PAGE_RENDER_COMPLETION_DURATION);
  }, []);

  const stopAll = useCallback(() => {
    loadingCount.current = 0;

    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current);
      loadingTimer.current = null;
    }

    loadingStartedAt.current = null;
    setIsLoading(false);
  }, []);

  const execute = useCallback(async <T,>(callback: () => Promise<T>) => {
    start();
    try {
      return await callback();
    } finally {
      stop();
    }
  }, [start, stop]);

  const value = useMemo<LoadingContextValue>(() => ({
    stop,
    start,
    stopAll,
    execute,
    isLoading,
    startPageRender,
    stopPageRender,
    isPageRendering,
  }), [
    stop,
    start,
    stopAll,
    execute,
    isLoading,
    startPageRender,
    stopPageRender,
    isPageRendering,
  ]);

  useEffect(() => {
    return () => {
      if (loadingTimer.current) {
        clearTimeout(loadingTimer.current);
      }

      if (pageRenderTimer.current) {
        clearTimeout(pageRenderTimer.current);
      }
    };
  }, []);
  return (
    <LoadingContext.Provider value={value}>
      {isPageRendering && pageRender && (
        <div className="fixed inset-x-0 top-18 z-110">
          <Loading {...pageRender} complete={isPageRenderCompleting} />
        </div>
      )}

      {isLoading && service && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Loading {...service} />
        </div>
      )}

      {children}
    </LoadingContext.Provider>
  );
}