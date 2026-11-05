export const OTransform = [
  'none' ,
  'uppercase' ,
  'lowercase' ,
  'capitalize'
] as const;

export type TTransform = (typeof OTransform)[number];

export const TRANSFORM_CLASS_MAP: Record<TTransform, string> = {
  none: 'normal-case',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
};