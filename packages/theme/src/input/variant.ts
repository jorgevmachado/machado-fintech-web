export const OInputVariant = ['outline' , 'filled' , 'ghost'] as const;

export type TInputVariant = (typeof OInputVariant)[number];

export const INPUT_VARIANT_CLASS_MAP: Record<TInputVariant, string> = {
  outline: 'border border-slate-200 bg-white text-slate-700 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100',
  filled: 'border border-transparent bg-slate-100 text-slate-800 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100',
  ghost: 'border border-transparent bg-transparent text-slate-700 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100',
};