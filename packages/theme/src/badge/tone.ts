import type { TBadgeVariant } from './variant';
import { type TTone, OTone } from '../base';

export const BADGE_TONE_CLASS_MAP: Record<TBadgeVariant, Record<TTone ,string>> = {
  solid: {
    primary: 'bg-blue-600 text-white' ,
    secondary: 'bg-slate-700 text-white' ,
    success: 'bg-emerald-500 text-white' ,
    warning: 'bg-amber-400 text-slate-900' ,
    danger: 'bg-red-500 text-white' ,
    info: 'bg-sky-500 text-white' ,
    neutral: 'bg-slate-200 text-slate-700' ,
    default: 'bg-slate-200 text-slate-700' ,
    inherit: 'bg-transparent text-inherit' ,
    muted: 'bg-slate-100 text-slate-600' ,
    subtle: 'bg-slate-100 text-slate-600' ,
    white: 'bg-slate-200 text-slate-700' ,
  } ,
  soft: {
    primary: 'bg-blue-50 text-blue-700' ,
    secondary: 'bg-slate-100 text-slate-700' ,
    success: 'bg-emerald-50 text-emerald-700' ,
    warning: 'bg-amber-50 text-amber-700' ,
    danger: 'bg-red-50 text-red-700' ,
    info: 'bg-sky-50 text-sky-700' ,
    neutral: 'bg-slate-100 text-slate-600' ,
    default: 'bg-slate-100 text-slate-600' ,
    inherit: 'bg-transparent text-inherit' ,
    muted: 'bg-slate-100 text-slate-600' ,
    subtle: 'bg-slate-100 text-slate-600' ,
    white: 'bg-slate-200 text-slate-700' ,
  } ,
  outline: {
    primary: 'border border-blue-500 bg-transparent text-blue-700' ,
    secondary: 'border border-slate-400 bg-transparent text-slate-700' ,
    success: 'border border-emerald-500 bg-transparent text-emerald-700' ,
    warning: 'border border-amber-400 bg-transparent text-amber-700' ,
    danger: 'border border-red-500 bg-transparent text-red-700' ,
    info: 'border border-sky-400 bg-transparent text-sky-700' ,
    neutral: 'border border-slate-300 bg-transparent text-slate-600' ,
    default: 'border border-slate-300 bg-transparent text-slate-600' ,
    inherit: 'border border-transparent bg-transparent text-inherit' ,
    muted: 'border border-slate-300 bg-transparent text-slate-600' ,
    subtle: 'border border-slate-300 bg-transparent text-slate-600' ,
    white: 'border border-slate-200 bg-transparent text-slate-700' ,
  } ,
};

export const getBadgeRandomTone = (): TTone => {
  const randomIndex = Math.floor(Math.random() * OTone.length);

  return OTone[randomIndex] ?? 'primary';
}