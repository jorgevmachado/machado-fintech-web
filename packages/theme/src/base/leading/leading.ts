export const OLeading = [
   'none',
   'tight',
   'snug',
   'normal',
   'relaxed',
   'loose',
   '3',
   '4',
   '5',
   '6',
   '7',
   '8',
   '9',
   '10',
] as const;

export type TLeading = (typeof OLeading[number]);

export const LEADING_CLASS_MAP: Record<TLeading, string> = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
  '3': 'leading-3',
  '4': 'leading-4',
  '5': 'leading-5',
  '6': 'leading-6',
  '7': 'leading-7',
  '8': 'leading-8',
  '9': 'leading-9',
  '10': 'leading-10',
};