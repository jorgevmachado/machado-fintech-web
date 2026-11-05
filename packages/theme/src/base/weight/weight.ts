export const OWeight = [
  'bold',
  'thin',
  'black',
  'light',
  'normal',
  'medium',
  'semibold',
  'extralight',
  'extrabold'
] as const;

export type TWeight = (typeof OWeight)[number];

export const WEIGHT_CLASS_MAP: Record<TWeight ,string> = {
  bold: 'font-bold' ,
  thin: 'font-thin' ,
  black: 'font-black' ,
  light: 'font-light' ,
  normal: 'font-normal' ,
  medium: 'font-medium' ,
  semibold: 'font-semibold' ,
  extralight: 'font-extralight' ,
  extrabold: 'font-extrabold' ,
};