export const OInputSize = [
  'sm' ,
  'md' ,
  'lg'
] as const;

export type TInputSize = (typeof OInputSize)[number];

export const INPUT_SIZE_CLASS_MAP: Record<TInputSize, string> = {
  sm: 'h-9 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-11 text-base',
};