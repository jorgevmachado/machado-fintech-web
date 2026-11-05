'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { useLoading } from '@fintech/ui';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { stopPageRender, stopAll } = useLoading();
  const previousUrl = useRef<string | null>(null);
  const currentUrl = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    if (previousUrl.current === null) {
      previousUrl.current = currentUrl;
      return;
    }

    if (currentUrl === previousUrl.current) {
      return;
    }

    previousUrl.current = currentUrl;
    stopAll();
    stopPageRender();
  }, [currentUrl, stopAll, stopPageRender]);

  return null;
}
