'use client';

import { createContext } from 'react';

import {
  TAlert ,
  TBuildServiceAlertMessageParams ,
  TExecuteServiceAlertParams ,
  TShowAlert,
} from './types';

export type AlertContextProps = {
  alerts: Array<TAlert>;
  showAlert: (event: TShowAlert) => string;
  clearAlerts: () => void;
  dismissAlert: (id: string) => void;
  executeServiceAlert: <T,>(params: TExecuteServiceAlertParams<T>) => void;
  buildServiceAlertMessage: <T,>(params: TBuildServiceAlertMessageParams<T>) => string;
};

export const AlertContext = createContext<AlertContextProps | null>(null);