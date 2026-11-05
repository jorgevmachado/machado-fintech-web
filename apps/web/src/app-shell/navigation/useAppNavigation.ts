'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useLoading } from '@fintech/ui';

export default function useAppNavigation() {
  const router = useRouter();
  const { startPageRender } = useLoading();

  const push = useCallback((href: string) => {
    startPageRender();
    router.push(href);
  }, [router, startPageRender]);

  const replace = useCallback((href: string) => {
    startPageRender();
    router.replace(href);
  }, [router, startPageRender]);

  const back = useCallback(() => {
    startPageRender();
    router.back();
  }, [router, startPageRender]);

  const forward = useCallback(() => {
    startPageRender();
    router.forward();
  }, [router, startPageRender]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  return {
    push,
    replace,
    back,
    forward,
    refresh,
  };
}
