'use client';
import { useCallback ,useSyncExternalStore } from 'react';

export type PaymentView = 'table' | 'cards';

const PAYMENT_VIEW_STORAGE_KEY = 'fintech:payment-view';

const CARDS_VIEW_MAX_WIDTH = 1024;

/** Fired on `window` so a change in one tab reaches the others. */
const VIEW_CHANGE_EVENT = 'fintech:payment-view-change';

function isPaymentView(value: unknown): value is PaymentView {
  return value === 'table' || value === 'cards';
}

/**
 * The stored choice, else the viewport default. Read through
 * `useSyncExternalStore` so the server snapshot (`table`) and the client's
 * first render agree — reading `localStorage` or `innerWidth` during render
 * would make the hydration output differ from the HTML.
 */
function getSnapshot(): PaymentView {
  try {
    const stored = window.localStorage.getItem(PAYMENT_VIEW_STORAGE_KEY);
    if (isPaymentView(stored)) {
      return stored;
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies): fall through.
  }

  return window.innerWidth < CARDS_VIEW_MAX_WIDTH ? 'cards' : 'table';
}

function getServerSnapshot(): PaymentView {
  return 'table';
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(VIEW_CHANGE_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);

  return () => {
    window.removeEventListener(VIEW_CHANGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

/** Table or cards, remembered across visits; narrow screens start on cards. */
export default function usePaymentView() {
  const view = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setView = useCallback((next: PaymentView) => {
    try {
      window.localStorage.setItem(PAYMENT_VIEW_STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort; the in-memory choice still applies below.
    }

    window.dispatchEvent(new Event(VIEW_CHANGE_EVENT));
  }, []);

  return { view, setView };
}