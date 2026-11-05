'use client';

import React, { useMemo, useState, useRef, useCallback } from 'react';

import Alert from '../Alert';

import {
  ALERT_POSITIONS ,
  type TBuildServiceAlertMessageParams ,
  type TAlert ,
  type TAlertPosition ,
  type TExecuteServiceAlertParams ,
  type TShowAlert ,
} from './types';
import { removeAlertState, buildAlertId } from './business';

import { AlertContext, type AlertContextProps } from './AlertContext';

type AlertProviderProps = {
  children: React.ReactNode;
}

const ALERT_POSITION_STYLE_MAP: Record<TAlertPosition, React.CSSProperties> = {
  'top-left': { top: 16, left: 16 },
  'top-center': { top: 16, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: 16, right: 16 },
};

const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const [alerts, setAlerts] = useState<Array<TAlert>>([]);

  const clearAlerts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setAlerts([]);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);

    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }

    setAlerts((previousState) => removeAlertState(previousState, id));
  }, []);

  const scheduleDismiss = useCallback((id: string, durationMs: number) => {
    if (durationMs <= 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setAlerts((previousState) => removeAlertState(previousState, id));
      timeoutsRef.current.delete(id);
    }, durationMs);

    timeoutsRef.current.set(id, timeout);
  }, []);

  const showAlert = useCallback(({ title,  variant = 'info', message, duration = 5000, position = 'top-right' }: TShowAlert) => {
    const id = buildAlertId();

    setAlerts((previousState) => [...previousState, { id, title, variant, message, position }]);

    scheduleDismiss(id, duration);

    return id;

  }, [scheduleDismiss]);
  
  const buildServiceAlertMessage = useCallback(<T,>({
    type,
    message,
    variant,
    errorMessage,
    messagePrefix,
    successMessage,
  }: TBuildServiceAlertMessageParams<T>) => {
    if(message) {
      return message;
    }

    if (messagePrefix) {
      return `${messagePrefix}.${type}.${variant}`;
    }

    return variant === 'error'
      ? errorMessage ?? `Error to fetch data ${type}`
      : successMessage ?? `Success to fetch data ${type}`;

  },[])
  
  const executeServiceAlert = useCallback(<T,>({
    isOk,
    type,
    alert,
    message,
    duration,
    position,
    defaultAlert = 'both',
    errorMessage,
    messagePrefix,
    successMessage,
  }: TExecuteServiceAlertParams<T>) => {
    const option = alert ?? defaultAlert;
    if (option === 'none') {
      return;
    }
    
    const variant = isOk ? 'success' : 'error';
    
    if(option === 'success' && variant !== 'success') {
      return;
    }
    
    if(option === 'error' && variant !== 'error') {
      return;
    }
    
    const rawMessage = buildServiceAlertMessage({
      type,
      variant,
      message,
      errorMessage,
      messagePrefix,
      successMessage,
    });
    
    showAlert({ 
      message: rawMessage,
      variant,
      duration,
      position
    });
  }, [buildServiceAlertMessage, showAlert]);

  const contextValue: AlertContextProps = useMemo(() => ({
    alerts,
    showAlert,
    clearAlerts,
    dismissAlert,
    executeServiceAlert,
    buildServiceAlertMessage
  }), [
    alerts,
    showAlert,
    clearAlerts,
    dismissAlert,
    executeServiceAlert,
    buildServiceAlertMessage
  ]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {alerts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            pointerEvents: 'none',
          }}
        >
          {ALERT_POSITIONS.map((position) => {
            const alertsByPosition = alerts.filter((alert) => alert.position === position);

            if (alertsByPosition.length === 0) {
              return null;
            }

            return (
              <div
                key={position}
                style={{
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  width: 'min(24rem, calc(100vw - 2rem))',
                  pointerEvents: 'none',
                  ...ALERT_POSITION_STYLE_MAP[position],
                }}
              >
                {alertsByPosition.map((alert) => (
                  <Alert
                    key={alert.id}
                    className="pointer-events-auto"
                    title={alert?.title ? alert.title : alert.message}
                    onClose={() => dismissAlert(alert.id)}
                    variant={alert.variant}
                    description={alert?.title ? alert.message : undefined}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;