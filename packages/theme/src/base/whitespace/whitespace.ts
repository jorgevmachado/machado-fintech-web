export const OWhitespace = ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] as const;
export type TWhitespace = (typeof OWhitespace[number]);

export const WHITESPACE_CLASS_MAP: Record<TWhitespace, string> = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
  pre: 'whitespace-pre',
  'pre-line': 'whitespace-pre-line',
  'pre-wrap': 'whitespace-pre-wrap',
  'break-spaces': 'whitespace-break-spaces',
};