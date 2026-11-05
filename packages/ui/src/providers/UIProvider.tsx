'use client';
import React ,{ useMemo } from 'react';

import { I18nProvider, type TLocalesFiles, mergeLocaleFiles } from '@fintech/i18n';
import {
  AlertProvider ,
  BreadcrumbProvider ,
  filterLocales ,
  formLocales,
} from '../components';
import { UIContextProvider } from './ui-context';

type UiProviderProps = {
  locales?: TLocalesFiles;
  children: React.ReactNode;
}

export default function UIProvider({
  locales,
  children,
}: UiProviderProps) {

  const mergedLocaleFiles = useMemo(() => {
    const listLocales: Array<TLocalesFiles> = [];
    listLocales.push(filterLocales);
    listLocales.push(formLocales);
    if (locales) {
      listLocales.push(locales);
    }
    return mergeLocaleFiles(listLocales);
  }, [locales]);

  return (
    <I18nProvider locales={mergedLocaleFiles}>
      <AlertProvider>
        <BreadcrumbProvider>
          <UIContextProvider>
            {children}
          </UIContextProvider>
        </BreadcrumbProvider>
      </AlertProvider>
    </I18nProvider>
  );
}