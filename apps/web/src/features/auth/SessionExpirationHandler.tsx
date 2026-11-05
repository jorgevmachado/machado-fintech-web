'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { HTTP_UNAUTHORIZED_EVENT } from '@fintech/shared';

import { logoutAction } from './actions';

export default function SessionExpirationHandler() {
  const router = useRouter();
  const handlingUnauthorized = useRef(false);

  useEffect(() => {
    const handleUnauthorized = async () => {
      if (handlingUnauthorized.current) {
        return;
      }

      handlingUnauthorized.current = true;
      try {
        await logoutAction();
      } finally {
        router.replace('/join');
        router.refresh();
      }
    };

    window.addEventListener(HTTP_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(HTTP_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [router]);

  return null;
}
