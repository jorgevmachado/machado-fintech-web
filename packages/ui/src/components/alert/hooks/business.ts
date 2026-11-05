import type { TAlert } from './types';

export function removeAlertState(alerts: Array<TAlert>, id: string): Array<TAlert> {
  return alerts.filter((alert) => alert.id !== id);
}

export function buildAlertId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}