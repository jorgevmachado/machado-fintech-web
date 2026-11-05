export const OTracking = [
  'tighter',
  'tight',
  'normal',
  'wide',
  'wider',
  'widest'
] as const;

export type TTracking = (typeof OTracking)[number];

export const TRACKING_CLASS_MAP: Record<TTracking, string> = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
};