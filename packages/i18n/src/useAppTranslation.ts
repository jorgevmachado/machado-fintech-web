'use client';

import { useTranslation } from 'react-i18next';

import { useLocale } from './provider';

export function useAppTranslation() {
  const translation = useTranslation();
  const localeState = useLocale();

  return {
    ...translation,
    ...localeState,
  };
}
