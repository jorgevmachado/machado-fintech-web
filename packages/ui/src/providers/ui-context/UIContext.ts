'use client';

import React from 'react';
import type { SupportedLocale } from '@fintech/i18n';

export type UIContextProps = {
  locale: SupportedLocale;
}

export const UIContext = React.createContext<UIContextProps | undefined>(undefined);
