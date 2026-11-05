export const ODecoration = [
  'none' ,
  'underline' ,
  'lineThrough' ,
  'overline',
] as const;

export type TDecoration = (typeof ODecoration[number]);

export const DECORATION_CLASS_MAP: Record<TDecoration, string> = {
  none: 'no-underline',
  underline: 'underline',
  lineThrough: 'line-through',
  overline: 'overline',
};