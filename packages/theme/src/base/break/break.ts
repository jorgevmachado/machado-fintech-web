export const OBreak = ['normal', 'words', 'all', 'keep'] as const;

export type TBreak = (typeof OBreak[number]);

export const BREAK_CLASS_MAP: Record<TBreak, string> = {
  normal: 'break-normal',
  words: 'break-words',
  all: 'break-all',
  keep: 'break-keep',
};