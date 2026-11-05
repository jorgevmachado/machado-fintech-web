'use client';

import React ,{ startTransition, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { FALLBACK_LOCALE, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, type SupportedLocale, resolvePreferredLocale } from '../config';
import { i18n } from '../instance';
import { registerLocalesFiles ,TLocalesFiles } from '../resources';

type LocaleContextValue = {
  locale: SupportedLocale;
  setLocale: (nextLocale: SupportedLocale) => void;
  supportedLocales: readonly SupportedLocale[];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type I18nProviderProps = Readonly<{
  locales?: Partial<TLocalesFiles>;
  children: React.ReactNode;
}>;

export function I18nProvider({ locales, children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(FALLBACK_LOCALE);
  const [hasResolvedLocale, setHasResolvedLocale] = useState<boolean>(false);
  const registeredLocalesRef = useRef<Partial<TLocalesFiles> | undefined>(undefined);

  useEffect(() => {
    if (locales && registeredLocalesRef.current !== locales) {
      Object.entries(locales).forEach(([localeKey, messages]) => {
        if (!messages) {
          return;
        }

        i18n.addResourceBundle(
          localeKey as SupportedLocale,
          'translation',
          messages,
          true,
          true,
        );
      });

      registerLocalesFiles(locales);
      registeredLocalesRef.current = locales;
    }
  }, [locales]);

  useEffect(() => {
    const persistedLocale = globalThis.localStorage.getItem(LOCALE_STORAGE_KEY);
    const browserLocale = globalThis.navigator.language;
    const resolvedLocale = resolvePreferredLocale(persistedLocale, browserLocale);

    startTransition(() => {
      setLocaleState(resolvedLocale);
      setHasResolvedLocale(true);
    });
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    globalThis.document.documentElement.lang = locale;

    if (hasResolvedLocale) {
      globalThis.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  }, [hasResolvedLocale, locale, locales]);

  const setLocale = useCallback((nextLocale: SupportedLocale) => {
    startTransition(() => {
      setLocaleState(nextLocale);
    });
  }, []);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
  }), [locale, setLocale]);

  return (
    <I18nextProvider i18n={i18n}>
      <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
    </I18nextProvider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (context) {
    return context;
  }

  return {
    locale: FALLBACK_LOCALE,
    setLocale: () => undefined,
    supportedLocales: SUPPORTED_LOCALES,
  } satisfies LocaleContextValue;
}
